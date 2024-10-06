async function registration() {
    if (!validateForm()) {
        return; // Stop the registration process if the form is not valid
    }
    document.getElementById('otpField').style.display = 'none';
    document.getElementById('otpCode').value = '';
    const registrationForm = document.getElementById('registrationForm');
    const formData = new FormData(registrationForm);
    const registrationData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const csrfToken = getCookie('csrftoken'); // Assuming getCookie function is available

    try {
        const response = await fetch('https://localhost/api/user_registration/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(registrationData),
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('registrationPopup').style.display = 'none';
            // Show the login popup after successful registration
            document.getElementById('loginPopup').style.display = 'block';
            toggleBlur(true); // Ensure the main content is blurred when showing the login popup
            // Optionally, redirect the user or show a success message
            const success = document.getElementById('success');
            success.style.display = 'block';
        } else {
            // Handle specific error messages
            if (data.username) {
                //display error message on div usernameError
				document.getElementById('usernameError').innerHTML = "Username already exists";
                document.getElementById('usernameError').style.display = 'block';
            }
            if (data.email) {
                document.getElementById('emailError').innerHTML = "Email already exists";
                document.getElementById('emailError').style.display = 'block';
            }
            console.error('Registration failed', data);
            // Handle other errors or show feedback to the user
        }
    } catch (error) {
        console.error('Error during registration:', error);
        // Handle or display the error
    }
}

function validateForm() {
    let isValid = true;
    const fields = ['username', 'email', 'password'];

    fields.forEach(field => {
        const input = document.getElementById(field);
        const error = document.getElementById(field + 'Error');

        if (!input.value.trim()) {
            error.innerHTML = 'This field is required';
            error.style.display = 'block';
            isValid = false;
            return;
        } else {
            error.style.display = 'none';
        }
    });

    // Additional password format validation
    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');
    const passwordValue = passwordInput.value.trim();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

    if (!passwordRegex.test(passwordValue)) {
        passwordError.innerHTML = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        passwordError.style.display = 'block';
        isValid = false;
    } else {
        passwordError.style.display = 'none';
    }

    return isValid; // Return the validation status
}

function redirectToRegistrationPopup() {
    // Hide the login popup if it's visible
    const loginPopup = document.getElementById('loginPopup');

    if (loginPopup) {
        loginPopup.style.display = 'none';
    }

    // Show the registration popup
    const registrationPopup = document.getElementById('registrationPopup');
    if (registrationPopup) {
        registrationPopup.style.display = 'block';
    }

    // Blur the main content
    toggleBlur(true);
}

function backToLogin(event) {
    event.preventDefault(); // Prevent the default action (page refresh)
    // Hide the registration popup
    const registrationPopup = document.getElementById('registrationPopup');
    if (registrationPopup) {
        registrationPopup.style.display = 'none';
    }

    // Show the login popup
    const loginPopup = document.getElementById('loginPopup');
    if (loginPopup) {
        loginPopup.style.display = 'block';
    }

    // Remove blur from the main content
    toggleBlur(false);
}
