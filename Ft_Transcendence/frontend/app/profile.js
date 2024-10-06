document.addEventListener('DOMContentLoaded', function () {
	const username = document.getElementById('userName');
	const userNameOnProfile = document.getElementById('userNameOnProfile');
	const rockplayer = document.getElementById('leftRockPlayerName');
	const pongplayer = document.getElementById('leftPlayerName');
	const userAvatar = document.getElementById('userAvatar');
	const numberWins = document.getElementById('numberWins');
	const numberLoses = document.getElementById('numberLoses');
	const csrfToken = getCookie('csrftoken');
	let current_user;
	let socket = null;

		//translations
		const translations = {
			english: {
				passwordStrength:'Password must contain at least one uppercase letter, one lowercase letter, and one number',
				requieredField: 'This field is required',
				diferentPass: 'New password must be different from the old one',
				waitforConfirmation: 'New password accepted, wait for confirmation',
				updatePassError: 'An error occurred while updating the password:',
				avatarUpdated: 'Avatar updated successfully!',
				avatarError: 'Error updating avatar: ',
				online: 'is Online',
				offline: 'is Offline',
			},
			french: {
				passwordStrength:'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre',
				requieredField: 'Ce champ est requis',
				diferentPass: 'Le nouveau mot de passe doit être différent de l\'ancien',
				waitforConfirmation: 'Nouveau mot de passe accepté, attendez la confirmation',
				updatePassError: 'Une erreur s\'est produite lors de la mise à jour du mot de passe:',
				avatarUpdated: 'Avatar mis à jour avec succès!',
				avatarError: 'Erreur lors de la mise à jour de l\'avatar: ',
				online: 'En ligne',
				offline: 'Hors ligne',
			},
			spanish: {
				passwordStrength:'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número',
				requieredField: 'Este campo es obligatorio',
				diferentPass: 'La nueva contraseña debe ser diferente de la anterior',
				waitforConfirmation: 'Nueva contraseña aceptada, espere la confirmación',
				updatePassError: 'Se produjo un error al actualizar la contraseña:',
				avatarUpdated: 'Avatar actualizado con éxito!',
				avatarError: 'Error al actualizar el avatar: ',
				online: 'En línea',
				offline: 'Desconectado',

			},
			german: {
				passwordStrength:'Das Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten',
				requieredField: 'Dieses Feld ist erforderlich',
				diferentPass: 'Das neue Passwort muss sich vom alten unterscheiden',
				waitforConfirmation: 'Neues Passwort akzeptiert, auf Bestätigung warten',
				updatePassError: 'Beim Aktualisieren des Passworts ist ein Fehler aufgetreten:',
				avatarUpdated: 'Avatar erfolgreich aktualisiert!',
				avatarError: 'Fehler beim Aktualisieren des Avatars: ',
				online: 'Online',
				offline: 'Offline',

			
			},
			dutch: {
				passwordStrength:'Wachtwoord moet minimaal één hoofdletter, één kleine letter en één cijfer bevatten',
				requieredField: 'Dit veld is verplicht',
				diferentPass: 'Nieuw wachtwoord moet verschillend zijn van het oude',
				waitforConfirmation: 'Nieuw wachtwoord geaccepteerd, wacht op bevestiging',
				updatePassError: 'Er is een fout opgetreden bij het bijwerken van het wachtwoord:',
				avatarUpdated: 'Avatar succesvol bijgewerkt!',
				avatarError: 'Fout bij het bijwerken van de avatar: ',
				online: 'Online',
				offline: 'Offline',


			},
			russian: {
				passwordStrength: 'Пароль должен содержать как минимум одну заглавную букву, одну строчную букву и одну цифру',
				requieredField: 'Это поле обязательно для заполнения',
				diferentPass: 'Новый пароль должен отличаться от старого',
				waitforConfirmation: 'Новый пароль принят, дождитесь подтверждения',
				updatePassError: 'Произошла ошибка при обновлении пароля:',
				avatarUpdated: 'Аватар успешно обновлен!',
				avatarError: 'Ошибка обновления аватара: ',
				online: 'В сети',
				offline: 'Не в сети',
			},
};

	    // Function to get the translation for the current language
		function getTranslation(key) {
			const savedLanguage = localStorage.getItem('selectedLanguage') || 'english';
			return translations[savedLanguage][key];
		}

	fetch('https://localhost/api/user/data/', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
		},
		credentials: 'include', // Include cookies for the current domain
	})
		.then(response => {
			if (!response.ok) {

				sessionStorage.removeItem('access_token');
				sessionStorage.removeItem('refresh_token');
				const isLoggedIn = localStorage.getItem('isLoggedIn');
				if (isLoggedIn === 'true') {
					localStorage.removeItem('isLoggedIn');
					window.location.reload();
				}
				throw new Error(`HTTP error status: ${response.status}`);
			}
			const contentType = response.headers.get('content-type');
			if (!contentType || !contentType.includes('application/json')) {
				throw new Error("Received non-JSON response");
			}
			return response.json();
		})
		.then(data => {
			// Corrected from data.name to data.username
			online_status(data.id);
			username.textContent = data.username;
			userNameOnProfile.textContent = current_user = data.username;
			rockplayer.value = current_user = data.username;
			pongplayer.value = current_user = data.username;
			numberWins.textContent = data.wins;
			numberLoses.textContent = data.losses;
			if (data.avatar) {
				userAvatar.src = data.avatar; // Set the avatar URL
				userAvatar.alt = `${data.username}'s Avatar`;
			} else {
				userAvatar.src = './srcs/img/astronaut.png'
			}
			if (data.is_42 === true) {
				document.getElementById('twoFaButton').style.display = 'none';
			}
			return fetchMatchHistory(current_user);
		})
		.then(matches => displayMatches(matches))
		.catch(error => console.error('Error fetching user profile:', error));

	// EDIT PERSONAL PROFILE MODAL

	var modal = document.getElementById("editModal");

	// Get the button that opens the modal
	var openModalButton = document.getElementById("openModalButton");

	// Get the <span> element that closes the modal
	var closeModalButton = document.getElementById("closeModalButton");

	// Open the modal when the button is clicked
	openModalButton.addEventListener("click", function () {
		// Show the modal (no need to fetch data since you just want to change the username)
		modal.style.display = "block";
	});

	// Close the modal when the close button (span) is clicked
	closeModalButton.addEventListener("click", function () {
		modal.style.display = "none";
	});

	// Close the modal if the user clicks anywhere outside of it
	window.addEventListener("click", function (event) {
		if (event.target === modal) {
			modal.style.display = "none";
		}
	});

	// Optionally, close the modal with the Escape key
	document.addEventListener("keydown", function (event) {
		if (event.key === "Escape") {
			modal.style.display = "none";
		}
	});

	document.getElementById("editForm").addEventListener("submit", function (event) {
		event.preventDefault(); // Prevent the form from submitting in the traditional way

		// Get form data
		var oldPassword = document.getElementById("oldPassword").value;
		var newPassword = document.getElementById("newPassword");
		const passwordValue = newPassword.value.trim();
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
		const passwordError = document.getElementById('newPasswordError');
		const passwordAccepted = document.getElementById('passwordChanged');
		let newCheckedPassword;

		// Check that the new value is strong enough
		if (!passwordRegex.test(passwordValue)) {
			passwordError.innerHTML = getTranslation('passwordStrength');
			passwordError.style.display = 'block';
			return; // Stop form submission if the password is invalid
		}
		else if (newPassword.value === '') {
			passwordError.innerHTML = getTranslation('requieredField');
			passwordError.style.display = 'block';
			return;
		}
		else if (newPassword.value === oldPassword) {
			passwordError.innerHTML = getTranslation('diferentPass');
			passwordError.style.display = 'block';
			return;
		} else {
			passwordError.style.display = 'none';
			passwordAccepted.style.display = 'block';
			passwordAccepted.innerHTML = getTranslation('waitforConfirmation');
			newCheckedPassword = newPassword.value;
		}
		// Prepare the data to be sent
		var formData = {
			old_password: oldPassword,
			new_password: newCheckedPassword
		};

		const csrfToken = getCookie('csrftoken');

		// Send the data using fetch API
		fetch("https://localhost/api/update_password/", {
			method: "PATCH",
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken, // Include the CSRF token if needed
			},
			body: JSON.stringify(formData)
		})
			.then(response => {
				if (!response.ok) {
					return response.json().then(data => {
						passwordError.innerHTML = 'The old password is wrong';
							passwordError.style.display = 'block';
							passwordAccepted.style.display = 'none';
						throw new Error(data.error || 'Error updating password');
					});
				}
				
				return response.json();
			})
			.then(() => {
				alert("Password updated successfully!");
				modal.style.display = "none";
			})
			.catch(error => {
				console.error("Error:", error);
				alert(getTranslation('updatePassError') + error.message);
			});
	});

	document.getElementById("avatarForm").addEventListener("submit", function (event) {
		event.preventDefault(); // Prevent the form from submitting in the traditional way

		var formData = new FormData();
		var avatarFile = document.getElementById("avatarInput").files[0];
		formData.append("avatar", avatarFile);

		const csrfToken = getCookie('csrftoken');

		fetch("https://localhost/api/update_avatar/", {
			method: "PATCH",
			headers: {
				'X-CSRFToken': csrfToken, // Include the CSRF token if needed
			},
			body: formData
		})
			.then(response => {
				if (response.ok) {
					return response.json(); // Parse JSON if the response is OK
				} else {
					return response.json().then(data => {
						// Handle error message from the server
						throw new Error(data.message || 'An error occurred while updating the avatar.');
					});
				}
			})
			.then(data => {
				alert(getTranslation('avatarUpdated'));
				document.getElementById("userAvatar").src = data.avatar_url;
			})
			.catch(error => {
				console.error("Error:", error);
			});
	});
	//MATCH HISTORY

	const fetchMatchHistory = async (username) => {
		try {
			const response = await fetch(`https://localhost/api/match-history/${username}/`, {
				headers: {
					'Content-Type': 'application/json',
					// Add authorization header if needed
					// 'Authorization': `Bearer ${yourAccessToken}`
				}
			});
			const result = await response.json();
			return result.matches;
		} catch (error) {
			console.error('Error fetching match history:', error);
			return [];
		}
	};

	// Function to display match history
	const displayMatches = (matches) => {
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
	};
	// FRIENDS FUNCTIONS
	function markOnline() {
		const csrfToken = getCookie('csrftoken');
		fetch('https://localhost/api/mark-online/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
			}
		}).catch(error => console.error('Error marking user online:', error));
	}

	// Call markOnline every 4 minutes (less than the backend timeout)
	setInterval(markOnline, 30 * 1000);

	// Call markOnline on page load to set initial status
	markOnline();

	function online_status(userId) {
		if (!userId) {
			console.error('User ID not found');
			return;
		}

		socket = new WebSocket(`wss://${window.location.host}/ws/online-status/${userId}/`);

		socket.onopen = function () {
			console.log('WebSocket connection opened.');
		};
		socket.onmessage = function (event) {
			const data = JSON.parse(event.data);
			const statusElement = document.getElementById(`user-status-${data.user_id}`);

			if (data.online) {
				statusElement.textContent = `${data.username} ${getTranslation('online')}`;
				statusElement.style.color = 'green';
			} else {
				statusElement.textContent = `${data.username} ${getTranslation('offline')}`;
				statusElement.style.color = 'red';
			}
		};

		socket.onclose = function () {
			console.log('WebSocket connection closed.');
		};
	}

	window.addEventListener('beforeunload', function () {
		if (socket) {
			socket.close();
		}
	});

	function fetchFriends() {
		const csrfToken = getCookie('csrftoken');
		fetch('https://localhost/api/friends/list_friends/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken,
			}
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error status: ${response.status}`);
				}
				return response.json();
			})
			.then(data => {
				displayFriends(data); // Pass the data to a function to display it
			})
			.catch(error => console.error('Error fetching friends:', error));
	}

	function displayFriends(friends) {
		const friendsList = document.getElementById('friends-list'); // Assume this is your container

		// Clear previous friends
		friendsList.innerHTML = '';

		friends.forEach(friend => {
			// Create a new list item or card for each friend
			const friendItem = document.createElement('div');
			friendItem.classList.add('friend-item');
			friendItem.id = `friend-${friend.id}`;

			// Set up the content for each friend
			friendItem.innerHTML = `
				<div class="friend-info">
					<span class="friend-name">${friend.username}</span>
					<span class="friend-status" id="user-status-${friend.id}" style="color: ${friend.is_online ? 'green' : 'red'};">
						${friend.is_online ? getTranslation('online') : getTranslation('offline')}
					</span>
				</div>
            `;

			// Append the new friend item to the list
			friendsList.appendChild(friendItem);
		});
	}

	function showPopup() {
		const popup = document.getElementById('friendsPopUp');
		fetchFriends(); // Fetch and display the friends list
	}

	// Set up event listeners
	document.getElementById('show-friends-button').addEventListener('click', showPopup);

	// NEXT:
});
