from django.urls import path, include
from django.contrib.auth import views as auth_views
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from . import views
from .views import (
    CustomLogoutView, 
    BlockedUserViewSet, 
    FriendListViewSet, 
    UserLoginView, 
    UserDataView,
    FriendRequestViewSet,
    update_password,
    update_avatar,
    mark_online,
    get_match_history,
    tfa_view,
)
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'blocked-users', BlockedUserViewSet, basename='blocked-users')
router.register(r'friends', FriendListViewSet, basename='friend')
router.register(r'friend-request', FriendRequestViewSet, basename='friend-request')

urlpatterns = [
    path('user_registration/', views.UserCreate.as_view(), name='user-create'),
    path('user_login/', csrf_exempt(UserLoginView.as_view()), name='user_login'),
    path('user_logout/', csrf_exempt(CustomLogoutView.as_view()), name='user_logout'),
    path('user/data/', UserDataView.as_view(), name='user_data'),
    path('42_login/', auth_views.LoginView.as_view(), name='42_login'),
    path('42_logout/', csrf_exempt(auth_views.LogoutView.as_view()), name='42_logout'),
    path('mark-online/', mark_online, name='mark-online'),
    path('update_password/', update_password, name='update_password'),
    path('update_avatar/', update_avatar, name='update_avatar'),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('accounts/', include('allauth.urls')),
    path('accounts/42/login/', csrf_exempt(views.oauth2_login), name='42_login'),
    path('accounts/42/login/callback/', views.oauth2_callback, name='42_callback'),
    path('accounts/42/get_oauth_client_info', views.get_oauth_client_info, name='42_get_oauth_client_info'),
    path('tfa/', tfa_view, name='tfa_enable_disable'),
    path('match-history/<str:username>/', get_match_history, name='get_match_history'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]

