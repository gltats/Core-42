document.addEventListener('DOMContentLoaded', function () {
    let gameHistory = [];
    const stoneHistoryCard = document.getElementById('stoneHistoryCard');
    stoneHistoryCard.style.display = 'none'; // Initially hide the history card

    const translations = {
        english: {
            diferentNames: 'Please enter different names for both players.',
            nameForBoth: 'Please enter names for both players.',
            turn: `'s turn`,
            draw: `It's a Draw!💙`,
            win: `, you win!🥳`,
            lose: `, you lost!😓`,
            result: 'Result',
            for: 'for',
        },
        spanish: {
            diferentNames: 'Por favor, ingrese nombres diferentes para ambos jugadores.',
            nameForBoth: 'Por favor, ingrese nombres para ambos jugadores.',
            turn: ` turno`,
            draw: `¡Es un empate!💙`,
            win: `, ¡ganaste!🥳`,
            lose: `, perdiste!😓`,
            result: 'Resultado',
            for: 'para',
        },
        french: {
            diferentNames: 'Veuillez entrer des noms différents pour les deux joueurs.',
            nameForBoth: 'Veuillez entrer des noms pour les deux joueurs.',
            turn: ` tour`,
            draw: `C'est un match nul!💙`,
            win: `, vous gagnez!🥳`,
            lose: `, vous avez perdu!😓`,
            result: 'Résultat',
            for: 'pour',
        },
        german: {
            diferentNames: 'Bitte geben Sie unterschiedliche Namen für beide Spieler ein.',
            nameForBoth: 'Bitte geben Sie Namen für beide Spieler ein.',
            turn: ` Zug`,
            draw: `Es ist ein Unentschieden!💙`,
            win: `, du gewinnst!🥳`,
            lose: `, du hast verloren!😓`,
            result: 'Ergebnis',
            for: 'für',
        },
        dutch: {
            diferentNames: 'Voer verschillende namen in voor beide spelers.',
            nameForBoth: 'Voer namen in voor beide spelers.',
            turn: ` beurt`,
            draw: `Het is een gelijkspel!💙`,
            win: `, je wint!🥳`,
            lose: `, je hebt verloren!😓`,
            result: 'Resultaat',
            for: 'voor',
        },
        russian: {
            diferentNames: 'Пожалуйста, введите разные имена для обоих игроков.',
            nameForBoth: 'Пожалуйста, введите имена для обоих игроков.',
            turn: ` ход`,
            draw: `Ничья!💙`,
            win: `, вы выиграли!🥳`,
            lose: `, вы проиграли!😓`,
            result: 'результат',
            for: 'для',
        },
    };

    // Function to get the translation for the current language
    function getTranslation(key) {
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'english';
        return translations[savedLanguage][key];
    }

    const computerChoiceDisplay = document.getElementById('computer-choice');
    const userChoiceDisplay = document.getElementById('user-choice');
    const resultDisplay = document.getElementById('resultStone');
    const possibleChoices = document.querySelectorAll('.rock-game');
    const rockOverlay = document.getElementById('rockOverlay');
    const startRockButton = document.getElementById('startRockButton');
    const leftRockPlayerName = document.getElementById('leftRockPlayerName');
    const rightRockPlayerName = document.getElementById('rightRockPlayerName');
    const startSRockScreen = document.getElementById('startSRockScreen');
    const quitRockButton = document.getElementById('quitRockButton');
    const playerChoose = document.getElementById('playerChoose');
    rockOverlay.style.display = 'none';

    const choices = ['rock', 'paper', 'scissors'];
	const choiceEmojis = {
        rock: '✊',
        paper: '✋',
        scissors: '✌️'
    };
    const resultColors = {
        draw: '#0dcaf0',
        win: '#39e600',
        lose: '#e60000'
    };

    let userChoice;
    let computerChoice;
    let result;
    let leftPlayer;
    let rightPlayer;

    startRockButton.addEventListener('click', () => {
        leftPlayer = leftRockPlayerName.value.trim();
        rightPlayer = rightRockPlayerName.value.trim();

        if (leftPlayer === rightPlayer) {
            alert(getTranslation('diferentNames'));
            return;
        }

        if (leftPlayer && rightPlayer) {
            rockOverlay.style.display = 'block'; // Show the overlay
            startSRockScreen.style.display = 'none'; // Hide the start screen

            // Remove any existing event listeners to avoid conflicts
            possibleChoices.forEach(choice => {
                choice.removeEventListener('click', handleUserChoice);
                choice.removeEventListener('click', handleTwoPlayerChoice);
            });

            if (rightPlayer.toLowerCase() === 'pc') {
                // Handle the case where the right player is the computer
                possibleChoices.forEach(choice => choice.addEventListener('click', handleUserChoice));
            } else {
                // Handle the case where both players are human
                possibleChoices.forEach(choice => choice.addEventListener('click', handleTwoPlayerChoice));
            }
            displayPlayer(); // Display the first player's turn
        } else {
            alert(getTranslation('nameForBoth'));
        }
    });

    quitRockButton.addEventListener('click', () => {
        // Hide the game overlay
        rockOverlay.style.display = 'none';
        // Show the start screen
        startSRockScreen.style.display = 'block';
        // Optionally, reset any game state variables if needed
        userChoiceDisplay.innerHTML = '';
        computerChoiceDisplay.innerHTML = '';
        resultDisplay.innerHTML = '';
        userChoice = null;
        computerChoice = null;
        result = null;
    });

    function handleUserChoice(event) {
        userChoice = event.target.id;
        userChoiceDisplay.innerHTML = `${leftPlayer}: ${choiceEmojis[userChoice]}`;
        generateComputerChoice();
        determineResult();
        displayResult();
    }

	function handleTwoPlayerChoice(event) {
		if (!userChoice) {
			userChoice = event.target.id;
			displayPlayer(); // Display the second player's turn
		} else {
			computerChoice = event.target.id;
			// Display both choices after the second player has made their choice
			userChoiceDisplay.innerHTML = `${leftPlayer}: ${choiceEmojis[userChoice]}`;
			computerChoiceDisplay.innerHTML = `${rightPlayer}: ${choiceEmojis[computerChoice]}`;
			determineResult();
			displayResult();
			userChoice = null; // Reset for the next round
			displayPlayer(); // Display the first player's turn again
		}
	}

    function displayPlayer() {
        if (!userChoice) {
            playerChoose.textContent = `${leftPlayer} ${getTranslation('turn')}`;
        } else {
            playerChoose.textContent = `${rightPlayer} ${getTranslation('turn')}`;
        }
    }

	function updateGameHistory() {
		let translatedResult;
		switch(result) {
			case 'draw':
				translatedResult = getTranslation('draw');
				break;
			case 'win':
				translatedResult = getTranslation('win');
				break;
			case 'lose':
				translatedResult = getTranslation('lose');
				break;
		}
	
		gameHistory.unshift({
			text: `${leftPlayer}: ${choiceEmojis[userChoice]} vs ${rightPlayer}: ${choiceEmojis[computerChoice]} ${translatedResult}`,
			result: result
		});
	
		gameHistory = gameHistory.slice(0, 3);
	
		if (stoneHistoryCard.style.display === 'none') {
			stoneHistoryCard.style.display = 'block';
		}
	
		const historyDisplays = [
			document.getElementById('stoneHistory1'),
			document.getElementById('stoneHistory2'),
			document.getElementById('stoneHistory3')
		];
	
		historyDisplays.forEach((display, index) => {
			if (gameHistory[index]) {
				display.textContent = gameHistory[index].text;
				display.style.color = resultColors[gameHistory[index].result];
			} else {
				display.textContent = '';
			}
		});
	}

    function generateComputerChoice() {
        const randomIndex = Math.floor(Math.random() * choices.length);
        computerChoice = choices[randomIndex];
        computerChoiceDisplay.innerHTML = `PC: ${choiceEmojis[computerChoice]}`;
    }

    function determineResult() {
        if (computerChoice === userChoice) {
            result = 'draw';
        } else if (
            (computerChoice ==='rock' && userChoice === 'paper') ||
            (computerChoice === 'paper' && userChoice === 'scissors') ||
            (computerChoice === 'scissors' && userChoice === 'rock')
        ) 
		{
            result = 'win';
        } else {
            result = 'lose';
        }
    }

    function displayResult() {
        let resultMessage;

        switch(result) {
            case 'draw':
				resultMessage = getTranslation('draw');
				break;
            case 'win':
				resultMessage = `${leftPlayer} ${getTranslation('win')}`;
				break;
            case 'lose':
				resultMessage = `${leftPlayer} ${getTranslation('lose')}`;
				break;
        }

        resultDisplay.innerHTML = resultMessage;
        resultDisplay.style.color = resultColors[result];

        updateGameHistory();
    }
});