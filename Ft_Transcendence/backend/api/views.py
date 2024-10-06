from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.contrib.auth import get_user_model, login, logout, authenticate, update_session_auth_hash
from django.contrib.auth.views import LogoutView
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets
from backend.utils.redis_utils import mark_user_online

from .models import User, Match, FriendRequest
from .serializers import (
    UserSerializer, 
    FriendSerializer, 
    BlockedUserSerializer, 
    UserLoginSerializer, 
    UserDataSerializer, 
    PasswordChangeSerializer,
    AvatarUpdateSerializer,
    FriendRequestSerializer,
    )

from .forms import CustomUserCreationForm
from requests_oauthlib import OAuth2Session
from oauthlib.oauth2 import AccessDeniedError
from django.conf import settings
import requests, secrets, logging, pyotp, qrcode, io, base64, os

logger = logging.getLogger(__name__)

class UserLoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserLoginSerializer

    @extend_schema(request=UserLoginSerializer)
    @csrf_exempt
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            otp_code = request.data.get('otp_code')
            user = authenticate(request, username=username, password=password)

            if user is not None:
                if user.tfa_enabled:
                    if otp_code:
                        if user.verify_tfa_code(otp_code):
                            login(request, user)
                            refresh = RefreshToken.for_user(user)
                            return Response({
                                'status': 'success',
                                'message': 'User logged in successfully',
                                'access_token': str(refresh.access_token),
                                'refresh_token': str(refresh),
                            })
                        else:
                            return Response({'status': 'error', 'message': 'Invalid 2FA code.'}, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        return Response({
                            'status': 'tfa_enabled',
                            'message': 'Two-factor authentication is required for this account.',
                        })
                login(request, user)
                refresh = RefreshToken.for_user(user)
                return Response({
                    'status': 'success',
                    'message': 'User logged in successfully',
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh),
                })
            else:
                return Response({'status': 'error', 'message': 'Invalid login. Please try again.'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_online(request):
    mark_user_online(request.user.id)
    return Response({"status": "online"})

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            try:
                user = get_user_model().objects.get(username=response.data['username'])
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': response.data
                }, status=status.HTTP_201_CREATED)
            except ObjectDoesNotExist:
                return Response({'error': 'User not found after creation.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return response

    @extend_schema(request=UserSerializer)
    def post(self, request, *args, **kwargs):
        """Create a new user"""
        return super().post(request, *args, **kwargs)
    
    def register(request):
        if request.method == 'POST':
            form = CustomUserCreationForm(request.POST)
            if form.is_valid():
                user_login = form.cleaned_data.get('login')
                email = form.cleaned_data.get('email')
                username_exists = User.objects.filter(username=user_login).exists()
                email_exists = User.objects.filter(email=email).exists()
                if username_exists or email_exists:
                    return render(request, 'register.html', {'form': form, 'error': 'User already exists.'})
                else:
                    user = form.save()
                    login(request, user)
                    return redirect('success_url')
            else:
                return render(request, 'register.html', {'form': form})
        else:
            form = CustomUserCreationForm()
            return render(request, 'register.html', {'form': form})


class BlockedUserViewSet(viewsets.ModelViewSet):
    serializer_class = BlockedUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.blocked_users.all()

    @action(detail=True, methods=['post'])
    def block(request, username):
        try:
            user_to_block = get_user_model().objects.get(username=username)
        except get_user_model().DoesNotExist:
            return Response({'status': 'error', 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if user_to_block == request.user:
            return Response({'status': 'error', 'message': 'You cannot block yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        request.user.blocked_users.add(user_to_block)
        return Response({'status': 'success', 'message': f'User {user_to_block.username} has been blocked.'})

    @action(detail=True, methods=['post'])
    def unblock(request, username):
        try:
            user_to_unblock = get_user_model().objects.get(username=username)
        except get_user_model().DoesNotExist:
            return Response({'status': 'error', 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if user_to_unblock == request.user:
            return Response({'status': 'error', 'message': 'You cannot unblock yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        if user_to_unblock not in request.user.blocked_users.all():
            return Response({'status': 'error', 'message': 'User is not blocked.'}, status=status.HTTP_400_BAD_REQUEST)

        request.user.blocked_users.remove(user_to_unblock)
        return Response({'status': 'success', 'message': f'User {user_to_unblock.username} has been unblocked.'})
    

class FriendListViewSet(viewsets.ModelViewSet):
    serializer_class = FriendSerializer
    permission_classes = [IsAuthenticated]
    
    @extend_schema(responses=FriendSerializer)
    @action(detail=False, methods=['get'])
    def list_friends(self, request):
        mark_user_online(request.user.id)
        friends = request.user.friends.all()
        serializer = FriendSerializer(friends, many=True)
        return Response(serializer.data)

    @extend_schema(request=None, responses=FriendSerializer)
    @action(detail=False, methods=['post'], url_path='(?P<username>[^/.]+)/add_friend')
    def add_friend(self, request, username=None):
        if username is None:
            return Response({'status': 'error', 'message': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if username == request.user.username:
            return JsonResponse({'status': 'error', 'message': 'You cannot add yourself as a friend.'}, status=400)
        try:
            friend = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'status': 'error', 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if friend in request.user.blocked_users.all():
            return Response({'status': 'error', 'message': 'You have blocked this user.'}, status=status.HTTP_400_BAD_REQUEST)

        request.user.friends.add(friend)
        serializer = FriendSerializer(friend)
        return Response({'status': 'success', 'friends': serializer.data})

    @extend_schema(request=None, responses=FriendSerializer)
    @action(detail=False, methods=['delete'], url_path='(?P<username>[^/.]+)/remove_friend')
    def remove_friend(self, request, username=None):
        if username == request.user.username:
            return Response({'status': 'error', 'message': 'You cannot remove yourself as a friend.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friend = get_user_model().objects.get(username=username)
        except get_user_model().DoesNotExist:
            return Response({'status': 'error', 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if friend not in request.user.friends.all():
            return Response({'status': 'error', 'message': 'User is not a friend.'}, status=status.HTTP_400_BAD_REQUEST)

        request.user.friends.remove(friend)
        friend.friends.remove(request.user)

        return Response({'status': 'success', 'message': 'Friend removed.'})

class FriendRequestViewSet(viewsets.ModelViewSet):
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def list_friend_requests(self, request):
        """List friend requests for the authenticated user."""
        if not request.user.is_authenticated:
            return Response({'status': 'error', 'message': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        friend_requests = FriendRequest.objects.filter(to_user=request.user, is_accepted=False, is_rejected=False)
        serializer = FriendRequestSerializer(friend_requests, many=True)
        return Response({'status': 'success', 'requests': serializer.data})

    @action(detail=False, methods=['post'], url_path=r'(?P<username>[^/.]+)/send_request')
    def send_request(self, request, username=None):
        if username is None:
            return Response({'status': 'error', 'message': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if username == request.user.username:
            return JsonResponse({'status': 'error', 'message': 'You cannot send a friend request to yourself.'}, status=400)
        try:
            to_user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'status': 'error', 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        if FriendRequest.objects.filter(from_user=request.user, to_user=to_user).exists():
            return Response({'status': 'error', 'message': 'Friend request already sent.'}, status=status.HTTP_400_BAD_REQUEST)
        if FriendRequest.objects.filter(from_user=to_user, to_user=request.user).exists():
            return Response({'status': 'error', 'message': 'Friend request already received.'}, status=status.HTTP_400_BAD_REQUEST)
        if to_user in request.user.friends.all():
            return Response({'status': 'error', 'message': 'User is already in your friend list.'}, status=status.HTTP_400_BAD_REQUEST)

        friend_request = FriendRequest.objects.create(from_user=request.user, to_user=to_user)
        return Response({'status': 'success', 'request_id': friend_request.id})

    @action(detail=False, methods=['post'], url_path=r'accept_request/(?P<request_id>\d+)')
    def accept_request(self, request, request_id=None):
        try:
            friend_request = FriendRequest.objects.get(id=request_id, to_user=request.user)
        except FriendRequest.DoesNotExist:
            return Response({'status': 'error', 'message': 'Friend request not found.'}, status=status.HTTP_404_NOT_FOUND)

        friend_request.accept()
        return Response({'status': 'success', 'message': 'Friend request accepted.'})

    @action(detail=False, methods=['post'], url_path=r'decline_request/(?P<request_id>\d+)')
    def decline_request(self, request, request_id=None):
        try:
            friend_request = FriendRequest.objects.get(id=request_id, to_user=request.user)
        except FriendRequest.DoesNotExist:
            return Response({'status': 'error', 'message': 'Friend request not found.'}, status=status.HTTP_404_NOT_FOUND)

        friend_request.decline()
        return Response({'status': 'success', 'message': 'Friend request declined.'})
    

#42 API
def get_oauth_client_info(request):
    return Response({
        'client_id': settings.CLIENT_ID,
        'redirect_uri': settings.REDIRECT_URI,
        'client_secret': settings.CLIENT_SECRET,
    })

def oauth2_login(request):
    oauth = OAuth2Session(settings.CLIENT_ID, redirect_uri=settings.REDIRECT_URI)
    state = secrets.token_urlsafe(16)
    authorization_url, state = oauth.authorization_url(settings.AUTHORIZATION_BASE_URL)

    request.session['oauth_state'] = state
    return redirect(authorization_url)

def oauth2_callback(request):
    try:
        oauth = OAuth2Session(settings.CLIENT_ID, state=request.session['oauth_state'], redirect_uri=settings.REDIRECT_URI)
        token = oauth.fetch_token(settings.TOKEN_URL, client_secret=settings.CLIENT_SECRET,
            authorization_response=request.build_absolute_uri())

        response = requests.get(settings.USER_INFO_URL, headers={'Authorization': f'Bearer {token["access_token"]}'})
        user_info = response.json()
        existing_user = User.objects.filter(username=user_info['login'], is_42=False).first()
        if existing_user:
            print(f"User {existing_user.username} already exists.")
            return redirect('https://localhost/')
        user, created = User.objects.update_or_create(
            username=user_info['login'],
            defaults={
                'first_name': user_info['first_name'],
                'last_name': user_info['last_name'],
                'email': user_info['email'],
                'is_42': True,
            }
        )
        avatar_url = user_info['image']['versions']['medium']
        avatar_response = requests.get(avatar_url)
        if avatar_response.status_code == 200:
            avatar_file = ContentFile(avatar_response.content)
            file_name = f"{user_info['login']}_avatar.jpg"
        else:
            avatar_file = None
            file_name = None
        if avatar_file and file_name: 
            user.avatar.save(file_name, avatar_file, save=True)

        oauth2_user_login(request, user)
        access_token = token['access_token']
        refresh_token = str(RefreshToken.for_user(user))

        html = f"""
        <!DOCTYPE html>
        <html>
        <body>
        <script>
        function OAuth_token_callback(accessToken, refreshToken) {{
            sessionStorage.setItem('access_token', accessToken);
            sessionStorage.setItem('refresh_token', refreshToken);
            window.location.href = "https://localhost/";
        }}
        OAuth_token_callback('{access_token}', '{refresh_token}');
        </script>
        </body>
        </html>
        """
        return HttpResponse(html)
    except AccessDeniedError:
        return redirect('https://localhost/')
    except Exception as e:
        print(f"An error occurred: {e}")
        return redirect('https://localhost/')

def oauth2_user_login(request, user):
    if not user.login_flag:
        user.login_flag = True
        user.save()
    login(request, user)

class UserDataView(generics.RetrieveAPIView):
    serializer_class = UserDataSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    @extend_schema(responses=UserDataSerializer)
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_password(request):
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        user = request.user
        new_password = serializer.validated_data['new_password']
        
        user.set_password(new_password)
        user.save()
        
        update_session_auth_hash(request, user)
        
        return Response({'message': 'Password updated successfully.'}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_avatar(request):
    user = request.user
    serializer = AvatarUpdateSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Avatar updated successfully.', 'avatar_url': user.avatar.url}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomLogoutView(LogoutView):
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            request.user.login_flag = False
            request.user.save()
            logout(request)
        return HttpResponseRedirect(('https://localhost'))

@api_view(['POST'])
def record_match_result(request):
    try:
        winner_username = request.data.get('winner_username')
        loser_username = request.data.get('loser_username')

        if not winner_username or not loser_username:
            return Response({'error': 'Both winner and loser usernames are required'}, status=400)

        match = Match.objects.create(
            winner_username=winner_username,
            loser_username=loser_username
        )

        return Response({'status': 'Match result recorded', 'match': {
            'winner_username': match.winner_username,
            'loser_username': match.loser_username,
            'date': match.date.isoformat()
        }})
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
@api_view(['GET'])
def get_match_history(request, username):
    try:
        matches = Match.objects.filter(
            winner_username=username
        ).values('winner_username', 'loser_username', 'date').order_by('-date')[:5]

        lost_matches = Match.objects.filter(
            loser_username=username
        ).values('winner_username', 'loser_username', 'date').order_by('-date')[:5]

        all_matches = list(matches) + list(lost_matches)

        all_matches = sorted(all_matches, key=lambda x: x['date'], reverse=True)[:5]

        def truncate_username(username):
            return username[:6] + '...' if len(username) > 6 else username

        for match in all_matches:
            match['winner_username'] = truncate_username(match['winner_username'])
            match['loser_username'] = truncate_username(match['loser_username'])

        return Response({'matches': all_matches})
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
@api_view(['POST'])
@csrf_exempt
@login_required
def tfa_view(request):
    user = request.user

    if request.method == 'POST':
        if user.tfa_enabled:
            user.tfa_secret = None
            user.tfa_enabled = False
            user.save()
            return Response({'message': '2FA disabled successfully.'})

        else:
            secret = pyotp.random_base32()
            user.tfa_secret = secret
            user.tfa_enabled = True
            user.save()
            totp = pyotp.TOTP(secret)
            uri = totp.provisioning_uri(name=user.email, issuer_name='Transcendence')
            qr = qrcode.make(uri)
            buffered = io.BytesIO()
            qr.save(buffered, format="PNG")
            qr_code_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

            return Response({'qr_code_url': f'data:image/png;base64,{qr_code_base64}'})
    else:
        return Response({'error': 'Invalid method.'}, status=405)