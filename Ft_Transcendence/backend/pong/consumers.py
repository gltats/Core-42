import json, logging, math, asyncio, time, random
from channels.generic.websocket import AsyncWebsocketConsumer
from api.models import Match, User
from channels.db import database_sync_to_async

logger = logging.getLogger(__name__)
game_states = {}
class PongConsumer(AsyncWebsocketConsumer):
    def __init__(self):
        self.groups = []
        self.loop_tasks = []
        self.lastAIUpdateTime = 0
        self.AIUpdateInterval = 50
        self.missChance = 0.01
        self.aiSpeed = 6
    
    async def connect(self):
        self.game_state_id = self.scope['url_route']['kwargs']['game_state_id']
        self.game_state_group_name = f'game_{self.game_state_id}'
        logger.info(f"Connecting to game state: {self.game_state_id}")
        await self.channel_layer.group_add(
            self.game_state_group_name,
            self.channel_name
        )

        if self.game_state_group_name not in game_states:
            logger.info(f"Creating new game state for: {self.game_state_id}")
            game_states[self.game_state_group_name] = {
                'player_left': {
                    'paddle_position': 0,
                    'x_position': 0,
                    'player_speed': 0,
                    'canvas_height': 600,
                    'player_height': 100,
                    'player_width': 10,
                    'score': 0,
                },
                'player_right': {
                    'paddle_position': 0,
                    'x_position': 0,
                    'player_speed': 0,
                    'canvas_height': 600,
                    'player_height': 100,
                    'player_width': 10,
                    'score': 0
                },
                'ball': {
                    'x_position': 0,
                    'y_position': 0,
                    'speed': 0,
                    'dx': 0,
                    'dy': 0,
                    'radius': 10,
                    'canvas_height': 600,
                    'canvas_width': 800
                },
                'game_over': False,
                'winner': None,
                'pause' : False,
                'isAI': False,
            }
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.game_state_group_name,
            self.channel_name
        )
        # self.loop_task.cancel()
        for task in self.loop_tasks:
            task.cancel()
        
        await self.close()

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        if action == 'fetch':
            await self.fetch_game_state()
        elif action == 'initialize':
            await self.initialize_game_state(data)
        elif action == 'update':
            await self.update_game_state(data)
        elif action == 'restart':
            await self.restart_game()
        elif action == 'result':
            await self.result_game(data)

    async def initialize_game_state(self, data):
        game_state = data['game_state']
        if game_state is None:
            await self.send(text_data=json.dumps({'error': 'GameState not found'}))
            return
        #Initialize the game state
        game_states[self.game_state_group_name]['winner'] = None
        game_states[self.game_state_group_name]['game_over'] = False
        game_states[self.game_state_group_name]['pause'] = False
        game_states[self.game_state_group_name]['isAI'] = game_state.get('isAI', False)
        #Initialize the left player
        game_states[self.game_state_group_name]['player_left']['score'] = 0
        game_states[self.game_state_group_name]['player_left']['paddle_position'] = game_state.get('player_left', {}).get('paddle_position', 0)
        game_states[self.game_state_group_name]['player_left']['player_speed'] = game_state.get('player_left', {}).get('player_speed', 0)
        game_states[self.game_state_group_name]['player_left']['canvas_height'] = game_state.get('player_left', {}).get('canvas_height', 600)
        game_states[self.game_state_group_name]['player_left']['x_position'] = game_state.get('player_left', {}).get('x_position', 0)
        game_states[self.game_state_group_name]['player_left']['player_height'] = game_state.get('player_left', {}).get('player_height', 100)
        game_states[self.game_state_group_name]['player_left']['player_width'] = game_state.get('player_left', {}).get('player_width', 10)
        #Initialize the right player
        game_states[self.game_state_group_name]['player_right']['score'] = 0
        game_states[self.game_state_group_name]['player_right']['canvas_height'] = game_state.get('player_right', {}).get('canvas_height', 600)
        game_states[self.game_state_group_name]['player_right']['paddle_position'] = game_state.get('player_right', {}).get('paddle_position', 0)
        game_states[self.game_state_group_name]['player_right']['player_speed'] = game_state.get('player_right', {}).get('player_speed', 0)
        game_states[self.game_state_group_name]['player_right']['x_position'] = game_state.get('player_right', {}).get('x_position', 0)
        game_states[self.game_state_group_name]['player_right']['player_height'] = game_state.get('player_right', {}).get('player_height', 100)
        game_states[self.game_state_group_name]['player_right']['player_width'] = game_state.get('player_right', {}).get('player_width', 10)
        #Initialize the ball
        game_states[self.game_state_group_name]['ball']['x_position'] = game_state.get('ball', {}).get('x_position', 0)
        game_states[self.game_state_group_name]['ball']['y_position'] = game_state.get('ball', {}).get('y_position', 0)
        game_states[self.game_state_group_name]['ball']['speed'] = game_state.get('ball', {}).get('speed', 0)
        game_states[self.game_state_group_name]['ball']['dx'] = game_state.get('ball', {}).get('dx', 0)
        game_states[self.game_state_group_name]['ball']['dy'] = game_state.get('ball', {}).get('dy', 0)
        game_states[self.game_state_group_name]['ball']['radius'] = game_state.get('ball', {}).get('radius', 0)
        game_states[self.game_state_group_name]['ball']['canvas_width'] = game_state.get('ball', {}).get('canvas_width', 800)
        game_states[self.game_state_group_name]['ball']['canvas_height'] = game_state.get('ball', {}).get('canvas_height', 600)

        game_states[self.game_state_group_name] = game_state 
        await self.channel_layer.group_send(
            self.game_state_group_name,
            {
                'type': 'game_state_update',
                'game_state': game_state
            })
        
        # self.loop_task = asyncio.create_task(self.game_loop())
        self.loop_tasks.append(asyncio.create_task(self.game_loop()))
        self.loop_tasks.append(asyncio.create_task(self.player_loop()))
        if (game_states[self.game_state_group_name]['isAI'] == True):
            self.loop_tasks.append(asyncio.create_task(self.ai_loop()))

    async def fetch_game_state(self):
        game_state = game_states.get(self.game_state_group_name)
        if game_state:
            await self.send(text_data=json.dumps({
            'type': 'game_state_update',
            'game_state': game_state
        }))
        else:
            await self.send(text_data=json.dumps({'error': 'GameState not found'}))

    async def update_game_state(self, data):
        game_state = game_states.get(self.game_state_group_name)
        if game_state is None:
            await self.send(text_data=json.dumps({'error': 'GameState not found'}))
            return
        if 'pause' in data:
            game_state['pause'] = data.get('pause', game_state['pause'])
        player_left = game_state['player_left']
        if 'player_left' in data:
            player_left_data = data['player_left']
            player_left['player_speed'] = player_left_data.get('player_speed', player_left['player_speed'])

        player_right = game_state['player_right']
        if 'player_right' in data and not game_state['isAI']:
            player_right_data = data['player_right']
            player_right['player_speed'] = player_right_data.get('player_speed', player_right['player_speed'])
    
        if 'ball' in data:
            ball_data = data['ball']
            ball = game_state['ball']
            ball['speed'] = ball_data.get('speed', ball['speed'])
            
        game_states[self.game_state_group_name] = game_state
        await self.channel_layer.group_send(
            self.game_state_group_name,
            {
                'type': 'game_state_update',
                'game_state': game_state
            })
   
    async def game_loop(self):
        while True:
            try:
                await self.update_ball_position()
                await asyncio.sleep(0.02)
            except asyncio.CancelledError:
                logger.info(f"Game loop cancelled for game: {self.game_state_id}")
                break
            except Exception as e:
                logger.error(f"Error in game loop for game: {self.game_state_id}: {e}")

    async def player_loop(self):
        while True:
            try:
                await self.update_player_position()
                await asyncio.sleep(0.02)
            except asyncio.CancelledError:
                logger.info(f"Game loop cancelled for game: {self.game_state_id}")
                break
            except Exception as e:
                logger.error(f"Error in game loop for game: {self.game_state_id}: {e}")

    async def update_player_position(self):
        game_state = game_states.get(self.game_state_group_name)
        if game_state:
            if game_state['pause'] is True:
                return
            player_left = game_state['player_left']
            player_right = game_state['player_right']

        if (player_left['player_speed'] < 0 and player_left['paddle_position'] > 0) or (player_left['player_speed'] > 0 and (player_left['paddle_position'] + player_left['player_height']) < player_left['canvas_height']):
            player_left['paddle_position'] += player_left['player_speed']
        
        if (player_right['player_speed'] < 0 and player_right['paddle_position'] > 0) or (player_right['player_speed'] > 0 and (player_right['paddle_position'] + player_right['player_height']) < player_right['canvas_height']):
            player_right['paddle_position'] += player_right['player_speed']
        
    async def update_ball_position(self):
        game_state = game_states.get(self.game_state_group_name)
        if game_state:
            if game_state['pause'] is True:
                return
            ball = game_state['ball']
            player_left = game_state['player_left']
            player_right = game_state['player_right']

            ball['x_position'] += ball['dx']
            ball['y_position'] += ball['dy']
            
            ball['dx'] = ball['speed'] * math.copysign(1, ball['dx'])
            ball['dy'] = ball['speed'] * math.copysign(1, ball['dy'])

            #Collision with the top edges of the canvas
            if ball['y_position'] + ball['radius'] > ball['canvas_height'] or ball['y_position'] - ball['radius'] < 0:
                ball['dy'] = -ball['dy']

            # Left paddle collision
            if (ball['x_position'] - ball['radius'] < (player_left['x_position'] + player_left['player_width']) and 
                ball['x_position'] + ball['radius'] > player_left['x_position'] and 
                ball['y_position'] > player_left['paddle_position'] and 
                ball['y_position'] < (player_left['paddle_position'] + player_left['player_height'])):
                ball['x_position'] = player_left['x_position'] + player_left['player_width'] + ball['radius']  # Adjust position
                ball['dx'] = -ball['dx']

            # Right paddle collision
            if (ball['x_position'] + ball['radius'] > player_right['x_position'] and 
                ball['x_position'] - ball['radius'] < player_right['x_position'] + player_right['player_width'] and 
                ball['y_position'] > player_right['paddle_position'] and 
                ball['y_position'] < player_right['paddle_position'] + player_right['player_height']):
                ball['x_position'] = player_right['x_position'] - ball['radius']  # Adjust position
                ball['dx'] = -ball['dx']

            if ball['x_position'] - ball['radius'] < 0:
                player_right['score'] += 1
                self.reset_ball(ball)

            if ball['x_position'] + ball['radius'] > ball['canvas_width']:
                player_left['score'] += 1
                self.reset_ball(ball)
            
            if (player_left['score'] == 5 or player_right['score'] == 5):
                game_state['game_over'] = True
                game_state['winner'] = 'player_left' if player_left['score'] == 5 else 'player_right'
            else:
                game_state['game_over'] = False

            game_states[self.game_state_group_name] = game_state
            await self.channel_layer.group_send(
            self.game_state_group_name,
            {
                'type': 'game_state_update',
                'game_state': game_state
            }
        )
    
    async def ai_loop(self):
        while True:
            try:
                await self.ai_move()
                await asyncio.sleep(0.01)
            except asyncio.CancelledError:
                logger.info(f"AI loop cancelled for game: {self.game_state_id}")
                break
            except Exception as e:
                logger.error(f"Error in AI loop for game: {self.game_state_id}: {e}")

    async def ai_move(self):

        game_state = game_states.get(self.game_state_group_name)
        if game_state:
            if game_state['pause'] is True:
                return
            player_right = game_state['player_right']
            ball = game_state['ball']
            currentTime = int(time.time() * 1000)
            if (currentTime - self.lastAIUpdateTime) >= self.AIUpdateInterval:
                if random.random() > self.missChance:
                    if ball['y_position'] < player_right['paddle_position'] + player_right['player_height'] / 2:
                        player_right['player_speed'] = -self.aiSpeed
                    elif ball['y_position'] > player_right['paddle_position'] + player_right['player_height'] / 2:
                        player_right['player_speed'] = self.aiSpeed
                    else:
                        player_right['player_speed'] = 0
                else:
                    player_right['player_speed'] = self.aiSpeed if random.random() < 0.5 else -self.aiSpeed
                self.lastAIUpdateTime = currentTime
            

    def reset_ball(self, ball):
        ball['x_position'] = ball['canvas_width'] / 2
        ball['y_position'] = ball['canvas_height'] / 2
        ball['dx'] = ball['speed'] * math.copysign(1, ball['dx'])
        ball['dy'] = ball['speed'] * math.copysign(1, ball['dy'])

    async def restart_game(self):
        game_state = game_states.get(self.game_state_group_name)
        if game_state:
            game_state['player_left']['score'] = 0
            game_state['player_left']['paddle_position'] = game_state['player_left']['canvas_height'] / 2 - game_state['player_left']['player_height'] / 2
            game_state['player_right']['score'] = 0
            game_state['player_right']['paddle_position'] = game_state['player_right']['canvas_height'] / 2 - game_state['player_right']['player_height'] / 2
            game_state['winner'] = None
            game_state['game_over'] = False
            self.reset_ball(game_state['ball'])
            game_states[self.game_state_group_name] = game_state
            await self.channel_layer.group_send(
                self.game_state_group_name,
                {
                    'type': 'game_state_update',
                    'game_state': game_state
                }
            )
    
    async def game_state_update(self, event):
        game_state = event['game_state']
        await self.send(text_data=json.dumps({
            'type': 'game_state_update',
            'game_state': game_state
        }))

    @database_sync_to_async
    def result_game(self, data):
        if 'score' in data:
            score = data['score']
            player_right = data['player_right']
            if (score == 1):
                user = self.scope['user']
                if 'mode' in data:
                    if data['mode'] == 'ordinary':
                        user.wins += 1
                winner = user.username
                loser = player_right
            elif (score == 2):
                user = self.scope['user']
                if 'mode' in data:
                    if data['mode'] == 'ordinary':
                        user.losses += 1
                winner = player_right
                loser = user.username
            user.save()
            try:
            # Check if player_right exists in the User model
                right_user = User.objects.get(username=player_right)
                if right_user.username == winner:
                    right_user.wins += 1
                else:
                    right_user.losses += 1
                right_user.save()
            except User.DoesNotExist:
                print(f"User with username '{player_right}' does not exist.")
                return
            match = Match.objects.create(
            winner_username=winner,
            loser_username=loser)
            match.save()
            

