document.addEventListener('DOMContentLoaded', async function () {
	const htmlElement = document.documentElement;
	const loginPopup = document.getElementById('loginPopup');
	const registrationPopup = document.getElementById('registrationPopup');
	const switchElement = document.getElementById('darkModeSwitch');
	document.querySelectorAll('.mainContent').forEach(function (element) {
		element.style.background = 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)'; // Reset to default or set a specific color
	});
	document.querySelectorAll('h1, .card, .bi').forEach(function (element) {
		element.style.color = 'blueviolet';
		element.style.borderColor = 'blueviolet';
	});
	// Check the tokens in session storage

	if (sessionStorage.getItem('access_token') && sessionStorage.getItem('refresh_token')) {
        localStorage.setItem('isLoggedIn', 'true'); // Set login flag in localStorage
        toggleBlur(false); // Unblur content
    } else {
        localStorage.setItem('isLoggedIn', 'false');
	}

	window.onload = initTokenRefresh;
	// Set the default theme to dark if no setting is found in local storage
	const currentTheme = localStorage.getItem('bsTheme') || 'dark';
	htmlElement.setAttribute('data-bs-theme', currentTheme);
	switchElement.checked = currentTheme === 'dark';

	switchElement.addEventListener('change', function () {
		if (this.checked) {
			htmlElement.setAttribute('data-bs-theme', 'dark');
			document.querySelectorAll('.mainContent').forEach(function (element) {
				element.style.background = 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)'; // Reset to default or set a specific color
			});
			document.querySelectorAll('h1, .card, .bi').forEach(function (element) {
				element.style.color = 'blueviolet';
				element.style.borderColor = 'blueviolet';
			});
			localStorage.setItem('bsTheme', 'dark');
		} else {
			htmlElement.setAttribute('data-bs-theme', 'light');
			//set .mainContent class background-color to #1a1a1a
			document.querySelectorAll('.mainContent').forEach(function (element) {
				element.style.background = 'radial-gradient(ellipse at bottom, #b0cbe9 0%, #b7bfe4 100%)';
			});
			document.querySelectorAll('h1, .card, .bi').forEach(function (element) {
				element.style.color = 'rgb(111, 5, 97)';
				element.style.borderColor = 'rgb(111, 5, 97)';
			});
			localStorage.setItem('bsTheme', 'light');
		}
	});

	// Check if the user is already logged in
	if (localStorage.getItem('isLoggedIn') === 'true') {
		document.getElementById('registrationPopup').style.display = 'none';
		document.getElementById('loginPopup').style.display = 'none'; // Hide login popup
		toggleBlur(false); // Unblur content
	} else {

		// Set initial visibility of popups
			loginPopup.style.display = 'block';// Show login popup
			registrationPopup.style.display = 'none'; // Hide registration popup
		

		// Handle login form submission
		const loginForm = document.getElementById('loginForm');
		loginForm.addEventListener('submit', function (event) {
			event.preventDefault(); // Prevent the form from submitting the traditional way
			login();
		});

		const signupButton = document.getElementById('signupButton');
		if (signupButton) {
			signupButton.addEventListener('click', function (event) {
				event.preventDefault(); // Prevent the default link action
				redirectToRegistrationPopup(); // Call the function to show the registration popup
			});
		}

		const registerButton = document.getElementById('registerButton');
		if (registerButton) {
			registerButton.addEventListener('click', function (event) {
				event.preventDefault(); // Prevent the default link action
				registration();
			});
		}

		// Intra sign-in button
		const signInWithIntraButton = document.getElementById('signInWithIntra');
		if (signInWithIntraButton) {
			signInWithIntraButton.addEventListener('click', function (event) {
				event.preventDefault(); // Prevent the default form submission
				signInWithIntra();
			});
		}

		// Initially blur the main content
		toggleBlur(true);
	}
});

let refreshIntervalId = null;

async function login() {
    const loginError = document.getElementById('LoginError');
    loginError.style.display = 'none';
    const loginForm = document.getElementById('loginForm');
    const formData = new FormData(loginForm);
    const loginData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        otp_code: document.getElementById('otpCode') ? document.getElementById('otpCode').value : null,
    };

    const csrfToken = getCookie('csrftoken'); // Get CSRF token from cookies

    try {
        const response = await fetch('https://localhost/api/user_login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Include CSRF token in the request headers
            },
            body: JSON.stringify(loginData),
            credentials: 'include', // Ensure credentials are included for cookies to be sent
        });
        const data = await response.json();

        if (response.ok) {
            if (data.status === 'tfa_enabled') {
                document.getElementById('usernameField').style.display = 'none';
                document.getElementById('passwordField').style.display = 'none';
                document.getElementById('otpField').style.display = 'block';
            } else if (data.status === 'success') {
                sessionStorage.setItem('access_token', data.access_token);
                sessionStorage.setItem('refresh_token', data.refresh_token);
                document.getElementById('loginPopup').style.display = 'none';
                localStorage.setItem('isLoggedIn', 'true'); // Set login flag in localStorage
                toggleBlur(false);

                if (refreshIntervalId) {
                    clearInterval(refreshIntervalId);
                }
                // Set up token refresh interval
                refreshIntervalId = setInterval(refreshToken, 2 * 1000); // Refresh token every 55 seconds
                window.location.reload();
            } else if (data.status === 'error') {
                // Add error message to div LoginError
                loginError.innerHTML = "Invalid credentials";
                loginError.style.display = 'block';
                resetPopup();
            }
        } else {
            loginError.innerHTML = "Invalid credentials";
            loginError.style.display = 'block';
            resetPopup();
        }
    } catch (error) {
        loginError.innerHTML = "Error during login";
        loginError.style.display = 'block';
        resetPopup();
    }
}

function resetPopup() {
    document.getElementById('usernameField').style.display = 'block';
    document.getElementById('passwordField').style.display = 'block';
    document.getElementById('otpField').style.display = 'none';
    document.getElementById('otpCode').value = '';
}

function initTokenRefresh() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        if (!refreshIntervalId) {
            refreshIntervalId = setInterval(refreshToken, 2 * 1000);
        }
    }
}

async function refreshToken() {
    const refreshToken = sessionStorage.getItem('refresh_token');
    if (!refreshToken) {
        redirectToLogin();
        return;
    }

    try {
        const response = await fetch('https://localhost/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ refresh: refreshToken }),
        });
        const data = await response.json();

        if (response.ok) {
            sessionStorage.setItem('access_token', data.access);
        } else {
            redirectToLogin();
        }
    } catch (error) {
        redirectToLogin();
    }
}

function redirectToLogin() {
    const csrfToken = getCookie('csrftoken');
    fetch('https://localhost/api/user_logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        credentials: 'include'
    })
        .then(response => {
            if (response.ok) {
                localStorage.removeItem('isLoggedIn');
                sessionStorage.removeItem('access_token');
    			sessionStorage.removeItem('refresh_token');
				window.location.href = '/login.html';
            } else {
				alert("Logout failed");
            }
        })
        .catch(error => {
            console.error('Network error:', error);
        });
}

async function checkLoginStatus() {
    try {
        const response = await fetch('https://localhost/api/user/data/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            	'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
            },
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            return data.Login_flag === 'true';
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
}

function toggleBlur(shouldBlur) {
	const mainContent = document.getElementById('mainContent');
	if (shouldBlur) {
		mainContent.classList.add('blurred');
	} else {
		mainContent.classList.remove('blurred');
	}
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
}


async function signInWithIntra() {
	window.location.href = 'https://localhost/api/accounts/42/login/';
}

async function getClientInfo() {
    const response = await fetch('https://localhost/api/accounts/42/get_oauth_client_info/');
    const data = await response.json();
    return data;
}

window.addEventListener('popstate', () => {
	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get('code');
	const state = urlParams.get('state');
  
  
	const storedState = localStorage.getItem('oauth_state');
  
	if (code && state && state === storedState) {
	  console.log('OAuth callback received:', code);
	} else {
	  console.error('Invalid OAuth callback');
	}
  });
