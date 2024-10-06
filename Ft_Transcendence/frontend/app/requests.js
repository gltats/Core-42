document.addEventListener('DOMContentLoaded', () => {
    const fetchRequestsButton = document.getElementById('get-requests-btn');
    const requestsModal = document.getElementById('friendsRequestPopUp');
    const requestsList = document.getElementById('request-list');
    const sendRequestButton = document.getElementById('send-request-btn');
	//translations
	const translations = {
			english: {
				enterUsername:'Please enter a username.',
				requestFrom: 'Request from',
				acceptButton: 'Accept',
				rejectButton: 'Reject',
				requestSent: 'Friend request sent!',
				errorSendingRequest: 'Error sending friend request:',
				errorSendingRequestGeneral: 'An error occurred while sending the friend request.'

			},
			french: {
				enterUsername:'Veuillez entrer un nom d\'utilisateur.',
				requestFrom: 'Demande de',
				acceptButton: 'Accepter',
				rejectButton: 'Rejeter',
				requestSent: 'Demande d\'ami envoyée!',
				errorSendingRequest: 'Erreur lors de l\'envoi de la demande d\'ami:',
				errorSendingRequestGeneral: 'Une erreur s\'est produite lors de l\'envoi de la demande d\'ami.'
			},
			spanish: {
				enterUsername:'Por favor, introduzca un nombre de usuario.',
				requestFrom: 'Solicitud de',
				acceptButton: 'Aceptar',
				rejectButton: 'Rechazar',
				requestSent: '¡Solicitud de amistad enviada!',
				errorSendingRequest: 'Error al enviar la solicitud de amistad:',
				errorSendingRequestGeneral: 'Se produjo un error al enviar la solicitud de amistad.'

			},
			german: {
				enterUsername:'Bitte geben Sie einen Benutzernamen ein.',
				requestFrom: 'Anfrage von',
				acceptButton: 'Akzeptieren',
				rejectButton: 'Ablehnen',
				requestSent: 'Freundschaftsanfrage gesendet!',
				errorSendingRequest: 'Fehler beim Senden der Freundschaftsanfrage:',
				errorSendingRequestGeneral: 'Beim Senden der Freundschaftsanfrage ist ein Fehler aufgetreten.'
			},
			dutch: {
				enterUsername:'Voer een gebruikersnaam in.',
				requestFrom: 'Verzoek van',
				acceptButton: 'Accepteren',
				rejectButton: 'Weigeren',
				requestSent: 'Vriendschapsverzoek verzonden!',
				errorSendingRequest: 'Fout bij het verzenden van het vriendschapsverzoek:',
				errorSendingRequestGeneral: 'Er is een fout opgetreden bij het verzenden van het vriendschapsverzoek.'

			},
			russian: {
				enterUsername: 'Пожалуйста, введите имя пользователя.',
				requestFrom: 'Запрос от',
				acceptButton: 'Принять',
				rejectButton: 'Отклонить',
				requestSent: 'Запрос на дружбу отправлен!',
				errorSendingRequest: 'Ошибка при отправке запроса на дружбу:',
				errorSendingRequestGeneral: 'При отправке запроса на дружбу произошла ошибка.'

			},
};

	    // Function to get the translation for the current language
		function getTranslation(key) {
			const savedLanguage = localStorage.getItem('selectedLanguage') || 'english';
			return translations[savedLanguage][key];
		}

    if (!fetchRequestsButton || !requestsModal || !requestsList || !sendRequestButton) {
        return;
    }

    // Show the modal and fetch friend requests
    fetchRequestsButton.addEventListener('click', () => {
        fetchFriendRequests();
    });

    sendRequestButton.addEventListener('click', () => {
        const username = document.getElementById('friend-username').value; // Assuming you have an input field with this ID
        if (username) {
            sendFriendRequest(username);
        } else {
			alert(getTranslation('enterUsername'));
        }
    });

    function fetchFriendRequests() {
        const csrfToken = getCookie('csrftoken');
        fetch('https://localhost/api/friend-request/list_friend_requests/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                requestsList.innerHTML = ''; // Clear existing requests
                data.requests.forEach(request => {
					const requestItem = document.createElement('li');
                    requestItem.textContent = `${getTranslation('requestFrom')} ${request.from_username}`;
                    
                    const acceptButton = document.createElement('button');
					acceptButton.className = "btn btn-light ms-2 me-2 mb-2";
                    acceptButton.textContent = getTranslation('acceptButton');
                    acceptButton.addEventListener('click', () => acceptFriendRequest(request.id));
                    
                    const rejectButton = document.createElement('button');
					rejectButton.className = "btn btn-light ms-2 me-2 mb-2";
                    rejectButton.textContent = getTranslation('rejectButton');
                    rejectButton.addEventListener('click', () => rejectFriendRequest(request.id));
                    
                    requestItem.appendChild(acceptButton);
                    requestItem.appendChild(rejectButton);
                    
                    requestsList.appendChild(requestItem);
                });
            } else {
                console.error('Error fetching friend requests:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function acceptFriendRequest(requestId) {
        const csrfToken = getCookie('csrftoken');
        fetch(`https://localhost/api/friend-request/accept_request/${requestId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Friend request accepted!');
                fetchFriendRequests(); // Refresh the friend requests list
            } else {
                console.error('Error accepting friend request:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function rejectFriendRequest(requestId) {
        const csrfToken = getCookie('csrftoken');
        fetch(`https://localhost/api/friend-request/decline_request/${requestId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Friend request rejected!');
                fetchFriendRequests(); // Refresh the friend requests list
            } else {
                console.error('Error rejecting friend request:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function sendFriendRequest(username) {
        const csrfToken = getCookie('csrftoken');
        fetch(`https://localhost/api/friend-request/${username}/send_request/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Friend request sent!');
                alert(getTranslation('requestSent'));
            } else {
                console.error('Error sending friend request:', data.message);
                alert(getTranslation('errorSendingRequest') + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(getTranslation('errorSendingRequestGeneral'));
        });
    }

});

function friendsRequestPopUp() {
	var popup = document.getElementById("friendsRequestPopUp");
	if (popup.style.display === "none" || popup.style.display === "") {
		popup.style.display = "block";
	} else {
		popup.style.display = "none";
	}
}

function friendsRequestPopUpClose() {
	var popup = document.getElementById("friendsRequestPopUp");
	popup.style.display = "none";
	///if click outside the popup also close the popup
}

function friendsPopUp() {
	var popup = document.getElementById("friendsPopUp");
	if (popup.style.display === "none" || popup.style.display === "") {
		popup.style.display = "block";
	} else {
		popup.style.display = "none";
	}
}

function friendsPopUpClose() {
	var popup = document.getElementById("friendsPopUp");
	popup.style.display = "none";
	///if click outside the popup also close the popup
}

