document.addEventListener('DOMContentLoaded', function () {
	const canvas = document.getElementById('pongCanvas');
	const context = canvas ? canvas.getContext('2d') : null;
	const overlay = document.getElementById('overlay');
	const popup = document.getElementById('popup');
	const winnerMessage = document.getElementById('winnerMessage');
	const leftGiveUpButton = document.getElementById('leftGiveUp');
	const rightGiveUpButton = document.getElementById('rightGiveUp');
	const ballSpeedSlider = document.getElementById('ballSpeed');
	const controlsContainer = document.getElementById('controlsContainer');
	const quitPongButton = document.getElementById('quitPongButton');
	const restartPongButton = document.getElementById('restartPongButton');
	const continueButton = document.getElementById('continueButton');
	const playerMessage = document.getElementById('playerMessage');
	const numberWins = document.getElementById('numberWins');
	const numberLoses = document.getElementById('numberLoses');
	document.getElementById('defaultButton').addEventListener('click', function() {
		document.getElementById('backgroundColor').value = '#000000';
		document.getElementById('ballColor').value = '#FFFFFF';
		document.getElementById('leftPlayerColor').value = '#FF0000';
		document.getElementById('rightPlayerColor').value = '#0000FF';
	});


	// Game constants
	const paddleWidth = 10;
	const paddleHeight = 100;
	const ballRadius = 10;
	const playerSpeed = 6;
	const winningScore = 5;
	const scoreMargin = 50; // Margin for score from the top
	const nameMargin = 50; // Margin for name from the bottom

	// Gamemode
	let gameMode = 'ordinary'; // Possible values: 'ordinary', 'tournament'
	let gameCounter = 0; // Counter to keep track of the current game in the tournament

	// Customization options
	let backgroundColor = '#000000';
	let ballColor = '#FFFFFF';
	let leftPlayerColor = '#FF0000';
	let rightPlayerColor = '#0000FF';

	// Player names
	let leftPlayerName = 'Player';
	let rightPlayerName = 'Player 2';
	let isAI = false; // Flag to determine if AI is active
	let gameRunning = true; // Flag to control the game loop

	let pongState = null;
	let socket = null;
	let pause = false;

	// Translations dictionary
	const translations = {
		'english': {
			winsTournament: 'Wins the Tournament!',
			wins: 'Wins!',
			enterNames: 'Please enter your names',
			player: 'Player',
			enterPlayerNameNumber: 'Enter player name number ',
			beginTournament: 'Begin Tournament',
			namesMustBeDifferent: 'Player names must be different',
			fourPlayersRequired: 'Tournament can only be played with 4 players',
			uniqueNamesRequired: 'All player names must be unique'
		},
		'spanish': {
			winsTournament: '¡Gana el Torneo!',
			wins: '¡Gana!',
			enterNames: 'Por favor, ingrese los nombres de los jugadores',
			player: 'Jugador',
			enterPlayerNameNumber: 'Ingrese el nombre del jugador número ',
			beginTournament: 'Comenzar Torneo',
			namesMustBeDifferent: 'Los nombres de los jugadores deben ser diferentes',
			fourPlayersRequired: 'El torneo solo se puede jugar con 4 jugadores',
			uniqueNamesRequired: 'Todos los nombres de los jugadores deben ser únicos'
		},
		'german': {
			winsTournament: 'Gewinnt das Turnier!',
			wins: 'Gewinnt!',
			enterNames: 'Bitte geben Sie Ihre Namen ein',
			player: 'Spieler',
			enterPlayerNameNumber: 'Geben Sie den Spielernamen Nummer ein ',
			beginTournament: 'Turnier beginnen',
			namesMustBeDifferent: 'Spielernamen müssen unterschiedlich sein',
			fourPlayersRequired: 'Das Turnier kann nur mit 4 Spielern gespielt werden',
			uniqueNamesRequired: 'Alle Spielernamen müssen eindeutig sein'
		},
		'french': {
			winsTournament: 'Gagne le tournoi!',
			wins: 'Gagne!',
			enterNames: 'Veuillez entrer vos noms',
			player: 'Joueur',
			enterPlayerNameNumber: 'Entrez le nom du joueur numéro ',
			beginTournament: 'Commencer le tournoi',
			namesMustBeDifferent: 'Les noms des joueurs doivent être différents',
			fourPlayersRequired: 'Le tournoi ne peut être joué qu\'avec 4 joueurs',
			uniqueNamesRequired: 'Tous les noms de joueurs doivent être uniques'
		},
		'dutch': {
			winsTournament: 'Wint het toernooi!',
			wins: 'Wint!',
			enterNames: 'Voer alstublieft uw namen in',
			player: 'Speler',
			enterPlayerNameNumber: 'Voer de spelersnaam nummer in ',
			beginTournament: 'Toernooi starten',
			namesMustBeDifferent: 'Spelernamen moeten verschillend zijn',
			fourPlayersRequired: 'Het toernooi kan alleen worden gespeeld met 4 spelers',
			uniqueNamesRequired: 'Alle spelernamen moeten uniek zijn'
		},
		'russian': {
			winsTournament: 'Выигрывает турнир!',
			wins: 'Победа!',
			enterNames: 'Пожалуйста, введите ваши имена',
			player: 'Игрок',
			enterPlayerNameNumber: 'Введите имя игрока номер ',
			beginTournament: 'Начать турнир',
			namesMustBeDifferent: 'Имена игроков должны быть разными',
			fourPlayersRequired: 'Турнир можно играть только c 4 игроками',
		}
	};

	// Function to get the translation for the current language
	function getTranslation(key) {
		const savedLanguage = localStorage.getItem('selectedLanguage') || 'english';
		return translations[savedLanguage][key];
	}

	// Player paddle (left)
	const playerLeft = {
		x: 0,
		y: canvas ? canvas.height / 2 - paddleHeight / 2 : 0,
		width: paddleWidth,
		height: paddleHeight,
		color: leftPlayerColor,
		dy: 0,
		score: 0
	};

	// Opponent paddle (right)
	const playerRight = {
		x: canvas ? canvas.width - paddleWidth : 0,
		y: canvas.height / 2 - paddleHeight / 2,
		width: paddleWidth,
		height: paddleHeight,
		color: rightPlayerColor,
		dy: 0,
		score: 0
	};

	// Ball
	const ball = {
		x: canvas ? canvas.width / 2 : 0,
		y: canvas ? canvas.height / 2 : 0,
		radius: ballRadius,
		speed: parseInt(ballSpeedSlider.value, 10),
		dx: 4,
		dy: -4,
		color: ballColor
	};

	// Draw rectangle (paddles)
	function drawRect(x, y, w, h, color) {
		context.fillStyle = color;
		context.fillRect(x, y, w, h);
	}

	// Draw circle (ball)
	function drawCircle(x, y, r, color) {
		context.fillStyle = color;
		context.beginPath();
		context.arc(x, y, r, 0, Math.PI * 2, false);
		context.closePath();
		context.fill();
	}

	// Draw text (scores and names)
	function drawText(text, x, y, color, align = 'center') {
		context.fillStyle = color;
		context.font = '35px Arial';
		context.textAlign = align;
		context.fillText(text, x, y);
	}

	// Draw net
	function drawNet() {
		for (let i = 0; i < canvas.height; i += 15) {
			drawRect(canvas.width / 2 - 1, i, 2, 10, '#fff');
		}
	}

	// Create a gradient color
	function createGradient(color1, color2) {
		const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
		gradient.addColorStop(0, color1);
		gradient.addColorStop(1, color2);
		return gradient;
	}

	// Draw everything
	function draw() {
		// if (gameState !== 'running') return; // Skip drawing if the game is paused
		// Clear the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		// Set the background color
		context.fillStyle = backgroundColor;
		context.fillRect(0, 0, canvas.width, canvas.height);

		// Draw net
		drawNet();

		// Draw paddles
		// drawRect(playerLeft.x, playerLeft.y, playerLeft.width, playerLeft.height, playerLeft.color);
		// drawRect(playerRight.x, playerRight.y, playerRight.width, playerRight.height, playerRight.color);

		drawRect(playerLeft.x, pongState.player_left.paddle_position, playerLeft.width, playerLeft.height, playerLeft.color);
		drawRect(playerRight.x, pongState.player_right.paddle_position, playerRight.width, playerRight.height, playerRight.color);

		// Draw ball
		// drawCircle(ball.x, ball.y, ball.radius, ball.color);
		drawCircle(pongState.ball.x_position, pongState.ball.y_position, ball.radius, ball.color);

		// Create gradients for scores and names
		const leftGradient = createGradient(playerLeft.color, 'white');
		const rightGradient = createGradient('white', playerRight.color);

		// Draw scores
		drawText(pongState.player_left.score, canvas.width / 4, scoreMargin, leftGradient);
		drawText(pongState.player_right.score, 3 * canvas.width / 4, scoreMargin, rightGradient);

		// Draw player names (mirroring the score positions)
		drawText(leftPlayerName, canvas.width / 4, canvas.height - nameMargin, leftGradient);
		drawText(rightPlayerName, 3 * canvas.width / 4, canvas.height - nameMargin, rightGradient);
	}

	window.addEventListener('beforeunload', function () {
		if (socket) {
			socket.close();
		}
	});




	function continueGame() {
		// Check the current match and update accordingly
		const currentMatch = localStorage.getItem('currentMatch');
		let nextMatch;

		// Determine the winner based on the current game state
		const winner = pongState.player_left.score >= pongState.player_right.score ? leftPlayerName : rightPlayerName;

		switch (currentMatch) {
			case 'firstSemiFinal':
				// Store the winner of the first semi-final
				localStorage.setItem('firstSemiFinalWinner', winner);
				nextMatch = 'secondSemiFinal';
				break;
			case 'secondSemiFinal':
				// Store the winner of the second semi-final
				localStorage.setItem('secondSemiFinalWinner', winner);
				nextMatch = 'final';
				break;
			case 'final':
				// The final match has been played, clear localStorage after determining and displaying the winner
				const finalWinner = winner;
				winnerMessage.textContent = `${finalWinner} ${getTranslation('winsTournament')}`;
				winnerMessage.style.color = pongState.player_left.score >= pongState.player_right.score ? playerLeft.color : playerRight.color;
				overlay.style.display = 'flex';
				popup.style.display = 'block';
				gameRunning = false; // Stop the game loop
				document.removeEventListener('keydown', keyDownHandler);
				document.removeEventListener('keyup', keyUpHandler);

				// Clear localStorage
				localStorage.removeItem('firstSemiFinalWinner');
				localStorage.removeItem('secondSemiFinalWinner');
				localStorage.removeItem('currentMatch');
				return;
			default:
				// If no match is currently set, start with the first semi-final
				nextMatch = 'firstSemiFinal';
				break;
		}

		// Update the currentMatch in localStorage to the next match
		localStorage.setItem('currentMatch', nextMatch);

		// Logic to set player names for the next match
		if (nextMatch === 'secondSemiFinal') {
			leftPlayerName = localStorage.getItem('player3');
			rightPlayerName = localStorage.getItem('player4');
		} else if (nextMatch === 'final') {
			leftPlayerName = localStorage.getItem('firstSemiFinalWinner');
			rightPlayerName = localStorage.getItem('secondSemiFinalWinner');
		}

		// Set up for the next match
		restartGame(); // Restart the game for the next match
	}


	function endGame() {
		// Determine winner
		const winnerName = pongState.player_left.score >= winningScore ? leftPlayerName : rightPlayerName;
		const winnerMessageText = `${winnerName} ${getTranslation('wins')}`;
		const winnerColor = pongState.player_left.score >= winningScore ? playerLeft.color : playerRight.color;

		pongState.player_left.score >= winningScore ? sendResult(1) : sendResult(2);
		// Display winner
		if (gameMode === 'ordinary') {
			if (pongState.player_left.score >= winningScore) {
				numberWins.textContent = parseInt(numberWins.textContent) + 1;
			}
			else {
				numberLoses.textContent = parseInt(numberLoses.textContent) + 1;
			}
		}
		winnerMessage.textContent = winnerMessageText;
		winnerMessage.style.color = winnerColor;
		overlay.style.display = 'flex';
		popup.style.display = 'block';

		// Stop the game loop
		isAI = false;
		gameRunning = false;
		restartGameState();
		// Remove event listeners to stop paddle movement
		document.removeEventListener('keydown', keyDownHandler);
		document.removeEventListener('keyup', keyUpHandler);

		// Store winner in localStorage
		if (gameMode === 'ordinary') {
			localStorage.setItem('pongGameWinner', winnerName);
		}
	}

	// Give up function
	function giveUp(player) {
		const winner = player === 'left' ? `${rightPlayerName}  ${getTranslation('wins')}` : `${leftPlayerName}  ${getTranslation('wins')}`;
		player === 'left' ? sendResult(2) : sendResult(1);
		winnerMessage.textContent = winner;
		winnerMessage.style.color = player === 'left' ? playerRight.color : playerLeft.color;
		overlay.style.display = 'flex';
		popup.style.display = 'block';
		isAI = false;
		gameRunning = false; // Stop the game loop
		if (gameMode === 'ordinary') {
			if (player === 'left') {
				numberLoses.textContent = parseInt(numberLoses.textContent) + 1;
			}
			else {
				numberWins.textContent = parseInt(numberWins.textContent) + 1;
			}
		}
		restartGameState();
		document.removeEventListener('keydown', keyDownHandler);
		document.removeEventListener('keyup', keyUpHandler);
	}

	// Restart game
	function restartGame() {
		gameRunning = true; // Restart the game loop
		restartGameState();
		overlay.style.display = 'none';
		popup.style.display = 'none';
		document.addEventListener('keydown', keyDownHandler);
		document.addEventListener('keyup', keyUpHandler);
		requestAnimationFrame(gameLoop);
	}

	function quitGame() {
		document.getElementById('startScreen').style.display = 'block';
		canvas.style.display = 'none';
		overlay.style.display = 'none';
		popup.style.display = 'none';
		controlsContainer.style.display = 'none';
		gameRunning = false; // Stop the game loop
		localStorage.removeItem('pongGameWinner');
		if (socket)
			socket.close();
	}


	async function fetchAndDisplayMatchHistory() {
		try {
			// Fetch match history data
			const response = await fetch(`https://localhost/api/match-history/${leftPlayerName}/`, {
				headers: {
					'Content-Type': 'application/json',
				}
			});
			// Parse the JSON response
			const result = await response.json();
			matches = result.matches
			// Display the matches
			const tableBody = document.querySelector('#match-history tbody');
			tableBody.innerHTML = ''; // Clear existing rows
			matches.sort((a, b) => new Date(b.date) - new Date(a.date));
			matches.forEach(match => {
				const row = document.createElement('tr');
				row.innerHTML = `
					<td>${match.winner_username}</td>
					<td>${match.loser_username}</td>
					<td>${new Date(match.date).toLocaleString()}</td>
				`;
				tableBody.appendChild(row);
			});
	
		} catch (error) {
			// Handle any errors that occur during fetch or display
			console.error('Error:', error);
		}
	}

	// Start game
	function startGame() {
		gameMode = 'ordinary';
		displayButtons();
		const leftNameInput = document.getElementById('leftPlayerName').value.trim();
		const rightNameInput = document.getElementById('rightPlayerName').value.trim();

		if (leftNameInput === rightNameInput) {
			alert(getTranslation('namesMustBeDifferent'));
			return;
		}

		leftPlayerName = leftNameInput || 'Player';
		rightPlayerName = rightNameInput || 'Player 2';
		isAI = rightNameInput === 'AI-ko';

		// Get customization options
		backgroundColor = document.getElementById('backgroundColor').value;
		ballColor = document.getElementById('ballColor').value;
		leftPlayerColor = document.getElementById('leftPlayerColor').value;
		rightPlayerColor = document.getElementById('rightPlayerColor').value;

		// Update player and ball colors
		playerLeft.color = leftPlayerColor;
		playerRight.color = rightPlayerColor;
		ball.color = ballColor;

		// Set button colors
		leftGiveUpButton.style.color = leftPlayerColor;
		rightGiveUpButton.style.color = rightPlayerColor;

		document.getElementById('startScreen').style.display = 'none';
		canvas.style.display = 'block';
		controlsContainer.style.display = 'flex';
		leftGiveUpButton.style.display = 'block';
		rightGiveUpButton.style.display = 'block';
		rightGiveUpButton.addEventListener('click', () => giveUp('right'));
		leftGiveUpButton.addEventListener('click', () => giveUp('left'));
		restartPongButton.addEventListener('click', restartGame);
		quitPongButton.addEventListener('click', quitGame);
		document.addEventListener('keydown', keyDownHandler);
		document.addEventListener('keyup', keyUpHandler);
		// gameRunning = true;
		// requestAnimationFrame(gameLoop);	
		initializeGameState();
	}

	function initializeGameState() {
		const initialGameState = {
			player_left: { name: leftPlayerName, score: 0, paddle_position: canvas.height / 2 - paddleHeight / 2, player_speed: 0, canvas_height: canvas.height, x_position: 0, player_height: paddleHeight, player_width: paddleWidth },
			player_right: { name: rightPlayerName, score: 0, paddle_position: canvas.height / 2 - paddleHeight / 2, player_speed: 0, canvas_height: canvas.height, x_position: canvas ? canvas.width - paddleWidth : 0, player_height: paddleHeight, player_width: paddleWidth },
			ball: { x_position: ball.x, y_position: ball.y, speed: ball.speed, dx: ball.dx, dy: ball.dy, radius: ball.radius, canvas_height: canvas.height, canvas_width: canvas.width },
			game_over: false, winner: null, pause: false, isAI: isAI,
		};
		pongState = initialGameState;

		gameRunning = true;
		setupWebSocket();
		requestAnimationFrame(gameLoop);
	}

	// Attach start button event listener
	document.getElementById('startButton').addEventListener('click', startGame);
	document.getElementById('tournamentButton').addEventListener('click', lobby);

	// Handle color input change
	function handleColorChange(event) {
		const input = event.target;
		const color = input.value;
		input.style.backgroundColor = color;
	}

	// Attach color change handler to color inputs
	document.querySelectorAll('input[type="color"]').forEach(input => {
		input.addEventListener('change', handleColorChange);
		input.addEventListener('input', handleColorChange);
	});

	// Game loop
	function gameLoop() {
		document.getElementById('continueButton').addEventListener('click', function () {
			updateTournamentMessage(leftPlayerName, rightPlayerName);

			if (!gameRunning && gameMode === 'tournament') {
				// Logic to set player names based on gameCounter
				if (gameCounter === 0) {
					showPopup();
					leftPlayerName = localStorage.getItem('player1');
					rightPlayerName = localStorage.getItem('player2');
					gameCounter++;
					continueGame();
				} else if (gameCounter === 1) {
					showPopup();
					leftPlayerName = localStorage.getItem('player3');
					rightPlayerName = localStorage.getItem('player4');
					gameCounter++;
					continueGame();
				} else if (gameCounter === 2) {
					leftPlayerName = localStorage.getItem('firstSemiFinalWinner');
					rightPlayerName = localStorage.getItem('secondSemiFinalWinner');
					gameCounter++;
					continueGame();
				} else if (gameCounter === 3) {
					// End the tournament
					localStorage.removeItem('player1');
					localStorage.removeItem('player2');
					localStorage.removeItem('player3');
					localStorage.removeItem('player4');
					localStorage.removeItem('firstSemiFinalWinner');
					localStorage.removeItem('secondSemiFinalWinner');
					localStorage.removeItem('currentMatch');
					gameCounter = 0;
					gameMode = 'ordinary';
					document.getElementById('leftGiveUp').disabled = false;
					document.getElementById('rightGiveUp').disabled = false;
					quitGame();
				}
			}
		});
		if (!gameRunning || !pongState) return; // Exit the loop if the game is not running
		// movePaddles();
		// moveBall();
		// draw();
		// requestAnimationFrame(gameLoop);
		draw();
		if (pongState.ball.speed !== parseInt(ballSpeedSlider.value, 10) || pongState.pause !== pause) {
			sendGameState();
		}
		setTimeout(() => {
			requestAnimationFrame(gameLoop);
		}, 1000 / 60); // Adjust the time delay as needed (e.g., 1000 / 60 for 60 FPS)
		if (pongState.game_over) {
			endGame();
			draw();
			return;
		}
	}

	function keyDownHandler(e) {
		switch (e.key) {
			case 'w':
				// playerLeft.dy = -playerSpeed;
				pongState.player_left.player_speed = -playerSpeed;
				break;
			case 's':
				// playerLeft.dy = playerSpeed;
				pongState.player_left.player_speed = playerSpeed;
				break;
			case 'ArrowUp':
				if (!isAI) {
					// playerRight.dy = -playerSpeed;
					pongState.player_right.player_speed = -playerSpeed;
					e.preventDefault();
				}
				break;
			case 'ArrowDown':
				if (!isAI) {
					// playerRight.dy = playerSpeed;
					pongState.player_right.player_speed = playerSpeed;
					e.preventDefault();
				}
				break;
		}
		sendPlayerState();
	}

	function keyUpHandler(e) {
		switch (e.key) {
			case 'w':
				pongState.player_left.player_speed = 0;
				break;
			case 's':
				pongState.player_left.player_speed = 0;
				break;
			case 'ArrowUp':
				if (!isAI) pongState.player_right.player_speed = 0;
				break;
			case 'ArrowDown':
				if (!isAI) pongState.player_right.player_speed = 0;
				break;
		}
		sendPlayerState();
	}

	function setupWebSocket() {
		socket = new WebSocket(`wss://${window.location.host}/ws/pong/game/${generateUniqueGameId()}/`);
		console.log('WebSocket opened at: ', `wss://${window.location.host}/ws/pong/game/${generateUniqueGameId()}/`);
		socket.onopen = function () {
			// Send initial game state
			socket.send(JSON.stringify({
				'action': 'initialize',
				'game_state': pongState
			}));
		};

		socket.onmessage = function (event) {
			const data = JSON.parse(event.data);
			if (data.error) {
				console.error('WebSocket error:', data.error);
			} else if (data.type === 'game_state_update') {
				pongState = data.game_state;
			}
		};

		socket.onclose = function () {
			console.error('WebSocket closed.');
		};
	}

	function sendGameState() {
		if (socket.readyState === WebSocket.OPEN) {
			const state = {
				action: 'update',
				ball: {
					speed: parseInt(ballSpeedSlider.value, 10),
				},
				pause: pause,
			};
			socket.send(JSON.stringify(state));
		}
	}

	function sendResult(result) {
		if (socket.readyState === WebSocket.OPEN) {
			const state = {
				action: 'result',
				score: result,
				player_right: rightPlayerName,
				mode: gameMode,
			};
			socket.send(JSON.stringify(state));
		}
		setTimeout(async () => {
			await fetchAndDisplayMatchHistory();
		}, 1000);
	}

	function sendPlayerState() {
		if (socket.readyState === WebSocket.OPEN) {
			const state = {
				action: 'update',
				player_left: {
					player_speed: pongState.player_left.player_speed,
				},
				player_right: {
					player_speed: pongState.player_right.player_speed,
				},
			};
			socket.send(JSON.stringify(state));
		}
	}

	function restartGameState() {
		if (socket.readyState === WebSocket.OPEN) {
			const state = {
				action: 'restart',
			};
			socket.send(JSON.stringify(state));
		}
	}

	function generateUniqueGameId() {
		return Math.random().toString(36).substring(2, 15);
	}


	function lobby() {

		const playerInputs = [];

		// Create the modal overlay
		const modalOverlay = document.createElement('div');
		modalOverlay.style.position = 'fixed';
		modalOverlay.style.top = '0';
		modalOverlay.style.left = '0';
		modalOverlay.style.width = '100%';
		modalOverlay.style.height = '100%';
		modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
		modalOverlay.style.display = 'flex';
		modalOverlay.style.justifyContent = 'center';
		modalOverlay.style.alignItems = 'center';
		modalOverlay.style.zIndex = '1000';

		// Create the modal box
		const modalBox = document.createElement('div');
		modalBox.style.width = '300px';
		modalBox.style.padding = '20px';
		modalBox.style.backgroundColor = 'rgba(224, 217, 217, 0.7)';
		modalBox.style.borderRadius = '5px';
		modalBox.style.textAlign = 'center';

		// Add the message
		const message = document.createElement('h5');
		message.textContent = getTranslation('enterNames');
		message.style.setProperty('color', 'rgba(138, 43, 226, 1)', 'important');
		modalBox.appendChild(message);

		// Add the input fields and labels
		for (let i = 1; i <= 4; i++) {
			const label = document.createElement('label');
			label.textContent = `${getTranslation('player')} ${i}`;
			label.style.display = 'block';
			label.style.marginTop = '10px';
			label.className = 'form-label';

			const input = document.createElement('input');
			input.type = 'text';
			input.placeholder = `${getTranslation('enterPlayerNameNumber')} ${i}`;
			input.style.marginTop = '5px';
			input.className = 'form-control';
			input.style.color = 'rgb(3, 170, 170)';

			modalBox.appendChild(label);
			modalBox.appendChild(input);

			playerInputs.push(input);
		}

		// Append the modal box to the overlay
		modalOverlay.appendChild(modalBox);

		// Create the "Begin Tournament" button
		const beginButton = document.createElement('button');
		beginButton.textContent = getTranslation('beginTournament');
		beginButton.style.marginTop = '20px';
		//botstrap button btn btn-light
		beginButton.className = 'btn btn-info';

		// Append the button to the modal box
		modalBox.appendChild(beginButton);

		// Append the overlay to the body
		document.body.appendChild(modalOverlay);

		// Function to close the modal
		modalOverlay.addEventListener('click', function (event) {
			// Close if the user clicks outside the modal box
			if (event.target === modalOverlay) {
				document.body.removeChild(modalOverlay);
			}
		});

		beginButton.addEventListener('click', function () {
			// Check if all inputs have values
			const allFilled = playerInputs.every(input => input.value.trim() !== '');
			const playerNames = playerInputs.map(input => input.value.trim());

			// Check if all names are unique
			const allUnique = new Set(playerNames).size === playerNames.length;

			if (allFilled && allUnique) {
				startTournament(playerNames);
				document.body.removeChild(modalOverlay);
			} else if (!allFilled) {
				// Display a message if not all fields are filled
				alert(getTranslation('fourPlayersRequired'));
			} else {
				// Display a message if names are not unique
				alert(getTranslation('uniqueNamesRequired'));
			}
		});
	}

	function shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]]; // Swap elements
		}
	}

	function startTournament(playerNames) {
		gameMode = 'tournament';
		document.getElementById('leftGiveUp').disabled = true;
		document.getElementById('rightGiveUp').disabled = true;
		displayButtons();
		gameCounter = 0; // Ensure the game counter is reset at the start

		// Shuffle player names to randomly seed them into the semifinals
		shuffle(playerNames);

		// Store player names in localStorage
		localStorage.setItem('player1', playerNames[0]);
		localStorage.setItem('player2', playerNames[1]);
		localStorage.setItem('player3', playerNames[2]);
		localStorage.setItem('player4', playerNames[3]);

		// Set the current match to the first semi-final
		localStorage.setItem('currentMatch', 'firstSemiFinal');

		// Initialize the first game
		leftPlayerName = playerNames[0];
		rightPlayerName = playerNames[1];
		updateTournamentMessage(leftPlayerName, rightPlayerName);
		showPopup();
		playGame();
	}

	function playGame() {
		// Simulate the game
		document.getElementById('startScreen').style.display = 'none';
		canvas.style.display = 'block';
		controlsContainer.style.display = 'flex';
		leftGiveUpButton.style.display = 'block';
		rightGiveUpButton.style.display = 'block';
		rightGiveUpButton.addEventListener('click', () => giveUp('right'));
		leftGiveUpButton.addEventListener('click', () => giveUp('left'));
		restartPongButton.addEventListener('click', restartGame);
		quitPongButton.addEventListener('click', quitGame);
		document.addEventListener('keydown', keyDownHandler);
		document.addEventListener('keyup', keyUpHandler);
		// gameRunning = true;
		// requestAnimationFrame(gameLoop);
		initializeGameState();

		// Store the winner in localStorage
	}

	function displayButtons() {
		// Hide all buttons initially
		restartPongButton.style.display = 'none';
		quitPongButton.style.display = 'none';
		continueButton.style.display = 'none';

		if (gameMode === 'ordinary') {
			// For ordinary game mode, show restart and quit buttons
			restartPongButton.style.display = 'block';
			quitPongButton.style.display = 'block';
		} else if (gameMode === 'tournament') {
			// For tournament mode, decide based on the gameCounter
			if (gameCounter === 0 || gameCounter === 1) {
				// For first and second semifinals, show only continue button
				continueButton.style.display = 'block';
			} else if (gameCounter === 2) {
				// For the final, show only quit button
				quitPongButton.style.display = 'block';
			}
		}
	}

	function updateTournamentMessage(leftPlayerName, rightPlayerName) {
		const messageElement = document.getElementById('tournamentMessage');
		messageElement.innerHTML = `${leftPlayerName} vs ${rightPlayerName}`;
	}

	// JavaScript: Add event listener to the "Create Tournament" button
	document.getElementById('tournamentButton').addEventListener('click', function () {
		const leftPlayerName = document.getElementById('leftPlayerName').value;
		const rightPlayerName = document.getElementById('rightPlayerName').value;
	});

	// JavaScript: Show and Hide Popup Functions
	function showPopup() {
		document.getElementById('tournamentMessage').style.display = 'block';
		gameState = 'paused'; // Start the game
		pause = true;

		setTimeout(function () {
			hidePopup();
		}, 3000); // 3000 milliseconds = 3 seconds
	}

	function hidePopup() {
		document.getElementById('tournamentMessage').style.display = 'none';
		gameState = 'running'; // Resume the game
		pause = false;

	}

	// Close Popup When Close Button is Clicked
	document.getElementById('closePopup').addEventListener('click', hidePopup);

	// Show Popup When "Start Game" Button is Clicked

});
