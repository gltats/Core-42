function languagesPopUp() {
	var popup = document.getElementById("languagesPopUp");
	if (popup.style.display === "none" || popup.style.display === "") {
		popup.style.display = "block";
	} else {
		popup.style.display = "none";
	}
}

function languagesPopUpClose() {
	var popup = document.getElementById("languagesPopUp");
	popup.style.display = "none";
}

document.addEventListener('DOMContentLoaded', function () {
	const translations = {
		english: {
			mainTitle: "42Pong",
			pongTitle: "Pong",
			help2FA: 'Please note press yes a QR code will be generated, wait for a few seconds',
			help2FA2: 'If your 2FA is activated and you press yes it will disable it',
			defaultColors: "Default Colors",
			title: "Welcome",
			description: "This is a sample description in English.",
			h2Accesibility: "Accessibility",
			preader: "Reader",
			changeFont: "Change the font:",
			languages: "Languages",
			english: "English",
			spanish: "Spanish",
			french: "French",
			german: "German",
			dutch: "Dutch",
			russian: "Russian",
			pcRequiered: "PC required",
			pPcRequiered: "For this game you need a PC",
			enterPlayers: "Enter Player Names:",
			penterPlayers: "Enter 'AI-ko' into the 'Right Player Name' if you wish to play against AI",
			rightPlayerName: "Right Player Name",
			pongBackground: "Background:",
			pongBallColor: "Ball Color:",
			pongLeftPlayerColor: "Left Player Color:",
			pongRightPlayerColor: "Right Player Color:",
			StartGame: "Start Game",
			pongCreateTournament: "Create Tournament",
			pongRestartGame: "Restart Game",
			QuitGame: "Quit Game",
			pongContinueGame: "Continue",
			close: "Close",
			giveUp: "Give Up",
			adjustPongBall: "Adjust Ball Speed:",
			h1rock: "Rock Paper Scissors",
			pRockEnterPlayers: "Enter 'pc' into the '2nd Player Name' if you wish to play against AI",
			rockRightPlayerName: "2nd Player Name",
			rock: "rock",
			paper: "paper",
			scissors: "scissors",
			rockResult: "Result: ",
			rockHistory: "History of last 3 games:",
			editButton: "Edit Profile",
			editH2: "Edit Personal Data",
			currentPass: "Current Password",
			enterCurrent: "Enter Current Password",
			newPass: "New Password",
			enterNew: "Enter New Password",
			save: "Save Changes",
			chooseAvatar: "Choose Avatar",
			uploadAvatar: "Upload Avatar",
			gameHistory: "GAME HISTORY",
			wins: "WINS",
			losses: "LOSSES",
			winner: "Winner",
			loser: "Loser",
			date: "Date",
			friendsH2: "FRIENDS",
			showFriends: "Show Friends",
			friendsList: "Friends List",
			getFriendRequest: "Get Friend Request",
			friendsrequestsH2: "Friend Requests",
			sendFriendsRequestH2: "Send Friend Request",
			enterFriendName: "Enter Friend Name",
			sendFriendsRequestButton: "Send Request",
			removeFriend: "Remove Friend",
			footer: "✌🏽 This website was coded by 42 students",
			enable2FAp: "Enable/Disable 2FA?",
			yes: "Yes",
			no: "No",
			scan:"Scan this QR code to enable 2FA:",

		},
		spanish: {
			mainTitle: "42Pong",
			pongTitle: "Pong",
			help2FA: 'Por favor, ten en cuenta que si presionas sí se generará un código QR, espera unos segundos',
			help2FA2: 'Si tu 2FA está activado y presionas sí se desactivará',
			defaultColors: "Colores por defecto",
			title: "Bienvenido",
			description: "Esta es una descripción de muestra en español.",
			h2Accesibilidad: "Accesibilidad",
			preader: "Lector",
			changeFont: "Cambiar el tipo de letra:",
			languages: "Idiomas",
			english: "Inglés",
			spanish: "Español",
			french: "Francés",
			german: "Alemán",
			dutch: "Holandés",
			russian: "Ruso",
			pcRequiered: "Se necesita PC",
			pPcRequiered: "Para este juego necesitas un PC",
			enterPlayers: "Introduzca los nombres de los jugadores:",
			penterPlayers: "Introduce 'AI-ko' en el 'Nombre del Jugador Derecho' si deseas jugar contra la IA",
			rightPlayerName: "Nombre del jugador derecho",
			pongBackground: "Fondo:",
			pongBallColor: "Color de la pelota:",
			pongLeftPlayerColor: "Color del jugador izquierdo:",
			pongRightPlayerColor: "Color del jugador derecho:",
			StartGame: "Empezar partida",
			pongCreateTournament: "Crear Torneo",
			pongRestartGame: "Reiniciar partida",
			QuitGame: "Salir del juego",
			pongContinueGame: "Continuar",
			close: "Cerrar",
			giveUp: "Abandonar",
			adjustPongBall: "Ajustar la velocidad de la bola:",
			h1rock: "Piedra Papel Tijera",
			pRockEnterPlayers: "Introduce 'pc' en el '2º Nombre de Jugador' si deseas jugar contra la IA",
			rockRightPlayerName: "Nombre del 2º jugador",
			rock: "piedra",
			paper: "papel",
			scissors: "tijeras",
			rockResult: "Resultado: ",
			rockHistory: "Historial de las 3 últimas partidas:",
			editButton: "Editar perfil",
			editH2: "Editar Datos Personales",
			currentPass: "Contraseña actual",
			enterCurrent: "Introducir contraseña actual",
			newPass: "Nueva contraseña",
			enterNew: "Introducir nueva contraseña",
			save: "Guardar cambios",
			chooseAvatar: "Elegir avatar",
			uploadAvatar: "Subir avatar",
			gameHistory: "HISTORIAL",
			wins: "VICTORIAS",
			losses: "DERROTAS",
			winner: "Ganador",
			loser: "Perdedor",
			date: "Fecha",
			friendsH2: "AMIGOS",
			showFriends: "Mostrar amigos",
			friendsList: "Lista de amigos",
			getFriendRequest: "Obtener solicitud de amistad",
			friendsrequestsH2: "Solicitudes de amistad",
			sendFriendsRequestH2: "Enviar solicitud de amistad",
			enterFriendName: "Introducir nombre del amigo",
			sendFriendsRequestButton: "Enviar Solicitud",
			removeFriend: "Eliminar amigo",
			footer: "✌🏽 Este sitio web ha sido programado por estudiantes de 42",
			enable2FAp: "¿Activar/Desactivar 2FA?",
			yes: "Sí",
			no: "No",
			scan:"Escanea este código QR para activar 2FA:",
		},

		french: {
			mainTitle: "42Pong",
			pongTitle: "Pong",
			help2FA: 'Veuillez noter que si vous appuyez sur oui, un code QR sera généré, attendez quelques secondes',
			help2FA2: 'Si votre 2FA est activé et que vous appuyez sur oui, il sera désactivé',
			defaultColors: "Couleurs par défaut",
			title: "Bienvenue",
			description: "Ceci est une description d'exemple en français.",
			h2Accesibility: "Accessibilité",
			preader: "Lecteur",
			changeFont: "Changer la police:",
			languages: "Langues",
			english: "Anglais",
			spanish: "Espagnol",
			french: "Français",
			german: "Allemand",
			dutch: "Néerlandais",
			russian: "Russe",
			pcRequiered: "PC requis",
			pPcRequiered: "Pour ce jeu, vous avez besoin d'un PC",
			enterPlayers: "Entrez les noms des joueurs:",
			penterPlayers: "Entrez 'AI-ko' dans la zone 'Nom du joueur droit' si vous souhaitez jouer contre l'IA", pPlayerName: "Nom du bon joueur", pPlayerName: "Nom du bon joueur",
			rightPlayerName: "Nom du joueur droit",
			pongBackground: "Arrière-plan:",
			pongBallColor: "Couleur de la balle:",
			pongLeftPlayerColor: "Couleur du joueur gauche:",
			pongRightPlayerColor: "Couleur du joueur droit:",
			StartGame: "Commencer la partie",
			pongCreateTournament: "Créer un tournoi",
			pongRestartGame: "Redémarrer la partie",
			QuitGame: "Quitter le jeu",
			pongContinueGame: "Continuer",
			close: "Fermer",
			giveUp: "Abandonner",
			adjustPongBall: "Ajuster la vitesse de la balle:",
			h1rock: "Pierre Feuille Ciseaux",
			pRockEnterPlayers: "Entrez 'pc' dans '2nd Player Name' si vous voulez jouer contre l'IA",
			rockRightPlayerName: "Nom du 2ème joueur",
			rock: "rock",
			paper: "feuille",
			scissors: "ciseaux",
			rockResult: "Résultat: ",
			rockHistory: "Historique des 3 dernières parties:",
			editButton: "Modifier le profil",
			editH2: "Modifier les données personnelles",
			currentPass: "Mot de passe actuel",
			enterCurrent: "Saisir le mot de passe actuel",
			newPass: "Nouveau mot de passe",
			enterNew: "Saisir le nouveau mot de passe",
			save: "Enregistrer les modifications",
			chooseAvatar: "Choisir un avatar",
			uploadAvatar: "Télécharger un avatar",
			gameHistory: "HISTOIRE",
			wins: "VICTOIRES",
			losses: "DEFAITES",
			winner: "Gagnant",
			loser: "Perdant",
			date: "date",
			friendsH2: "AMIS",
			showFriends: "Afficher les amis",
			friendsList: "Liste d'amis",
			getFriendRequest: "Voir les demandes d'amis",
			friendsrequestsH2: "Demandes d'amis",
			sendFriendsRequestH2: "Envoyer une demande d'ami",
			enterFriendName: "Saisir le nom d'un ami",
			sendFriendsRequestButton: "Envoyer une demande",
			removeFriend: "Supprimer l'ami",
			footer: "✌🏽 Ce site web a été programmé par des étudiants de 42",
			enable2FAp: "Activer/Désactiver 2FA?",
			yes: "Oui",
			no: "Non",
			scan:"Scannez ce QR code pour activer le 2FA:",

		},
		german: {
			mainTitle: "42Pong",
			pongTitle: "Pong",
			help2FA: 'Bitte beachten Sie, dass bei einem Klick auf Ja ein QR-Code generiert wird. Bitte warten Sie einige Sekunden',
			help2FA2: 'Wenn Ihr 2FA aktiviert ist und Sie auf Ja klicken, wird es deaktiviert',
			defaultColors: "Standardfarben",
			title: "Willkommen",
			description: "Dies ist eine Beispielbeschreibung auf Deutsch.",
			h2Accesibility: "Barrierefreiheit",
			preader: "Leser",
			changeFont: "Ändern Sie die Schriftart:",
			languages: "Sprachen",
			english: "Englisch",
			spanisch: "Spanisch",
			französisch: "Französisch",
			deutsch: "Deutsch",
			dutch: "Niederländisch",
			russian: "Russisch",
			pcRequiered: "PC erforderlich",
			pPcRequiered: "Für dieses Spiel benötigen Sie einen PC",
			enterPlayers: "Geben Sie die Namen der Spieler ein:",
			penterPlayers: "Geben Sie 'AI-ko' in das Feld 'Right Player Name' ein, wenn Sie gegen die KI spielen möchten",
			rightPlayerName: "Rechter Spielername",
			pongBackground: "Hintergrund:",
			pongBallColor: "Ballfarbe:",
			pongLeftPlayerColor: "Farbe des linken Spielers:",
			pongRightPlayerColor: "Farbe des rechten Spielers:",
			StartGame: "Spiel starten",
			pongCreateTournament: "Turnier erstellen",
			pongRestartGame: "Spiel neu starten",
			QuitGame: "Spiel beenden",
			pongContinueGame: "Spiel fortsetzen",
			close: "Schließen",
			giveUp: "Aufgeben",
			adjustPongBall: "Ballgeschwindigkeit anpassen:",
			h1rock: "Stein-Papier-Schere",
			pRockEnterPlayers: "Geben Sie 'pc' in das Feld '2nd Player Name' ein, wenn Sie gegen die KI spielen wollen",
			rockRightPlayerName: "Name des zweiten Spielers",
			rock: "rock",
			paper: "Papier",
			scissors: "Schere",
			rockResult: "Ergebnis: ",
			rockHistory: "Geschichte der letzten 3 Spiele:",
			editButton: "Profil bearbeiten",
			editH2: "Persönliche Daten bearbeiten",
			currentPass: "Aktuelles Passwort",
			enterCurrent: "Aktuelles Passwort eingeben",
			newPass: "Neues Kennwort",
			enterNew: "Neues Kennwort eingeben",
			save: "Änderungen speichern",
			chooseAvatar: "Avatar auswählen",
			uploadAvatar: "Avatar hochladen",
			gameHistory: "GESCHICHTE",
			wins: "VICTORIES",
			losses: "NIEDERLAGEN",
			winner: "Gewinner",
			loser: "Verlierer",
			date: "Datum",
			friendsH2: "FREUNDE",
			showFriends: "Freunde anzeigen",
			friendsList: "Liste der Freunde",
			getFriendRequest: "Freundschaftsanfrage erhalten",
			friendsrequestsH2: "Freundschaftsanfragen",
			sendFriendsRequestH2: "Freundschaftsanfrage senden",
			enterFriendName: "Name des Freundes eingeben",
			sendFriendsRequestButton: "Anfrage senden",
			removeFriend: "Freund entfernen",
			footer: "✌🏽 Diese Website wurde von 42 Studenten programmiert",
			enable2FAp: "2FA aktivieren/deaktivieren?",
			yes: "Ja",
			no: "Nein",
			scan:"Scannen Sie diesen QR-Code, um 2FA zu aktivieren:",
		},

		dutch: 
		{
			mainTitle: "42Pong",
			pongTitle: "Pong",
			help2FA: 'Houd er rekening mee dat als je op ja drukt, er een QR-code wordt gegenereerd, wacht een paar seconden',
			help2FA2: 'Als je 2FA is geactiveerd en je op ja drukt, wordt het gedeactiveerd',
			defaultColors: "Standaardkleuren",
			title: "Welkom",
			description: "Dit is een voorbeeldbeschrijving in het Engels.",
			h2Accesibility: "Toegankelijkheid",
			preader: "Reader",
			changeFont: "Wijzig het lettertype:",
			languages: "Talen",
			english: "Engels",
			spanish: "Spaans",
			french: "Frans",
			german: "Duits",
			dutch: "Nederlands",
			russian: "Russisch",
			pcRequiered: "PC vereist",
			pPcRequiered: "Voor dit spel heb je een pc nodig",
			enterPlayers: "Voer spelersnamen in:",
			penterPlayers: "Voer 'AI-ko' in bij 'Right Player Name' als je tegen AI wilt spelen",
			rightPlayerName: "Naam rechter speler",
			pongBackground: "Achtergrond:",
			pongBallColor: "Kleur van de bal:",
			pongLeftPlayerColor: "Kleur linkerspeler:",
			pongRightPlayerColor: "Kleur rechterspeler:",
			StartGame: "Start Spel",
			pongCreateTournament: "Creëer toernooi",
			pongRestartGame: "Spel herstarten",
			QuitGame: "Spel verlaten",
			pongContinueGame: "Doorgaan",
			close: "Sluiten",
			giveUp: "Give Up",
			adjustPongBall: "Balsnelheid aanpassen:",
			h1rock: "Steen Papier Schaar",
			pRockEnterPlayers: "Voer 'pc' in bij '2nd Player Name' als je tegen AI wilt spelen",
			rockRightPlayerName: "2e Spelersnaam",
			rock: "rock",
			paper: "papier",
			scissors: "schaar",
			rockResult: "Resultaat: ",
			rockHistory: "Geschiedenis van laatste 3 spellen:",
			editButton: "Profiel bewerken",
			editH2: "Persoonlijke gegevens bewerken",
			currentPass: "Huidig wachtwoord",
			enterCurrent: "Huidig wachtwoord invoeren",
			newPass: "Nieuw wachtwoord",
			enterNew: "Voer nieuw wachtwoord in",
			save: "Wijzigingen opslaan",
			chooseAvatar: "Avatar kiezen",
			uploadAvatar: "Avatar uploaden",
			gameHistory: "SPELGESCHIEDENIS",
			wins: "WINNEN",
			losses: "VERLIES",
			winner: "Winnaar",
			loser: "Verliezer",
			date: "Datum",
			friendsH2: "VRIENDEN",
			showFriends: "Vrienden weergeven",
			friendsList: "Vriendenlijst",
			getFriendRequest: "Vriendverzoek krijgen",
			friendsrequestsH2: "vriendverzoeken",
			sendFriendsRequestH2: "Verstuur vriendschapsverzoek",
			enterFriendName: "Voer vriendnaam in",
			sendFriendsRequestButton: "Verstuur verzoek",
			removeFriend: "Vriend verwijderen",
			footer: "✌🏽 Deze website is gecodeerd door 42 studenten",
			enable2FAp: "2FA inschakelen/uitschakelen?",
			yes: "Ja",
			no: "Nee",
			scan:"Scan deze QR-code om 2FA in te schakelen:",
		},
		russian: {
			mainTitle: "42 Понг",
			pongTitle: "Понг",
			help2FA: 'Обратите внимание, что если вы нажмете да, будет сгенерирован QR-код, подождите несколько секунд',
			help2FA2: 'Если ваш 2FA активирован и вы нажмете да, он будет отключен',
			defaultColors: "Цвета по умолчанию",
			title: "Добро пожаловать",
			description: "Это пример описания на русском языке.",
			h2Accesibility: "Доступность",
			preader: "Читатель",
			changeFont: "Изменить шрифт:",
			languages: "Языки",
			english: "Английский",
			spanish: "Испанский",
			french: "Французский",
			german: "Немецкий",
			dutch: "Голландский",
			russian: "Русский",
			pcRequiered: "Требуется ПК",
			pPcRequiered: "Для этой игры требуется ПК",
			enterPlayers: "Введите имена игроков:",
			penterPlayers: "Введите 'AI-ko' в поле 'Имя второго игрока', если хотите играть против ИИ",
			rightPlayerName: "Имя второго игрока",
			pongBackground: "Фон:",
			pongBallColor: "Цвет мяча:",
			pongLeftPlayerColor: "Цвет левого игрока:",
			pongRightPlayerColor: "Цвет правого игрока:",
			StartGame: "Начать игру",
			pongCreateTournament: "Создать турнир",
			pongRestartGame: "Перезапустить игру",
			QuitGame: "Выйти из игры",
			pongContinueGame: "Продолжить",
			close: "Закрыть",
			giveUp: "Сдаться",
			adjustPongBall: "Настроить скорость мяча:",
			h1rock: "Камень Ножницы Бумага",
			pRockEnterPlayers: "Введите 'pc' в поле 'Имя второго игрока', если хотите играть против ИИ",
			rockRightPlayerName: "Имя второго игрока",
			rock: "камень",
			paper: "бумага",
			scissors: "ножницы",
			rockResult: "Результат: ",
			rockHistory: "История последних 3 игр:",
			editButton: "Редактировать профиль",
			editH2: "Редактировать личные данные",
			currentPass: "Текущий пароль",
			enterCurrent: "Введите текущий пароль",
			newPass: "Новый пароль",
			enterNew: "Введите новый пароль",
			save: "Сохранить изменения",
			chooseAvatar: "Выбрать аватар",
			uploadAvatar: "Загрузить аватар",
			gameHistory: "ИСТОРИЯ ИГР",
			wins: "ПОБЕДЫ",
			losses: "ПОРАЖЕНИЯ",
			winner: "Победитель",
			loser: "Проигравший",
			date: "Дата",
			friendsH2: "ДРУЗЬЯ",
			showFriends: "Показать друзей",
			friendsList: "Список друзей",
			getFriendRequest: "Получить запрос в друзья",
			friendsrequestsH2: "Запросы в друзья",
			sendFriendsRequestH2: "Отправить запрос в друзья",
			enterFriendName: "Введите имя друга",
			sendFriendsRequestButton: "Отправить запрос",
			removeFriend: "Удалить друга",
			footer: "✌🏽 Этот сайт был создан студентами 42",
			enable2FAp: "Включить/Отключить 2FA?",
			yes: "Да",
			no: "Нет",
			scan: "Сканируйте этот QR-код для включения 2FA",
		},
	};

	function changeLanguage(language) {
		document.querySelectorAll('[data-translate]').forEach(function (element) {
			const key = element.getAttribute('data-translate');
			if (translations[language][key]) {
				element.textContent = translations[language][key];
			}
		});

		document.querySelectorAll('[data-translate-placeholder]').forEach(function (element) {
			const key = element.getAttribute('data-translate-placeholder');
			if (translations[language][key]) {
				element.setAttribute('placeholder', translations[language][key]);
			}
		});

		// Save the selected language to localStorage
		localStorage.setItem('selectedLanguage', language);
	}

	// Load the saved language from localStorage
	const savedLanguage = localStorage.getItem('selectedLanguage');
	if (savedLanguage) {
		changeLanguage(savedLanguage);
	}
	document.getElementById("englishButton").addEventListener("click", function () {
		if(readerFlag === true)
		{
			alert("Please stop the reader before changing the language");
			changeLanguage("english");
			return;
		}
		changeLanguage("english");
	});

	document.getElementById("spanishButton").addEventListener("click", function () {
		if(readerFlag === true)
			{
				alert("Please stop the reader before changing the language");
				changeLanguage("english");
				return;
			}
		changeLanguage("spanish");
	});

	document.getElementById("frenchButton").addEventListener("click", function () {
		if(readerFlag === true)
			{
				alert("Please stop the reader before changing the language");
				changeLanguage("english");
				return;
			}
		changeLanguage("french");
	});

	document.getElementById("germanButton").addEventListener("click", function () {
		if(readerFlag === true)
			{
				alert("Please stop the reader before changing the language");
				changeLanguage("english");
				return;
			}
		changeLanguage("german");
	});

	document.getElementById("dutchButton").addEventListener("click", function () {
		if(readerFlag === true)
			{
				alert("Please stop the reader before changing the language");
				changeLanguage("english");
				return;
			}
		changeLanguage("dutch");
	});

	document.getElementById("russianButton").addEventListener("click", function () {
		if(readerFlag === true)
			{
				alert("Please stop the reader before changing the language");
				changeLanguage("english");
				return;
			}
		changeLanguage("russian");
	});
});