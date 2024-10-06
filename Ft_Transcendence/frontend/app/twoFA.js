
document.addEventListener('DOMContentLoaded', function () {
	const confirmTwoFaBtn = document.getElementById('confirmTwoFaBtn');
	const cancelTwoFaBtn = document.getElementById('cancelTwoFaBtn');

	if (confirmTwoFaBtn) {
		confirmTwoFaBtn.addEventListener('click', async function () {
			try {
				const csrfToken = getCookie('csrftoken');
				const response = await fetch('https://localhost/api/tfa/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': csrfToken // Ensure CSRF token is included
					},
					credentials: 'include' // Include credentials if needed
				});

				if (response.ok) {
					const data = await response.json();
					const qrCodeImage = document.getElementById('qrCodeImage');

					if (data.qr_code_url) {
						// Display QR code if enabling 2FA
						qrCodeImage.src = data.qr_code_url;
						QRPopUp();
					} else {
						// Hide QR code container if disabling 2FA
						QRPopUpClose();
						showNotification('2FA has been successfully disabled.');
					}
					TwoFaPopUpClose(); // Close the modal
				} else {
					console.error('Failed to change 2FA status.');
				}
			} catch (error) {
				console.error('Error changing 2FA status:', error);
			}
		});
	}
	if (cancelTwoFaBtn)
	{
		cancelTwoFaBtn.addEventListener('click', TwoFaPopUpClose);
		//showNotification('2FA has been successfully disabled.');
	}

		

	function showNotification(message) {
		const notification = document.getElementById('notification');
		notification.textContent = message;
		notification.style.display = 'block';
		// Hide the notification after a few seconds
		setTimeout(() => {
			notification.style.display = 'none';
		}, 2000); // Adjust time as needed
	}

});

function twoFaPopUp() {
	var popup = document.getElementById("twoFaPopUp");
	if (popup.style.display === "none" || popup.style.display === "") {
		popup.style.display = "block";
	} else {
		popup.style.display = "none";
	}
}

function TwoFaPopUpClose() {
	var popup = document.getElementById("twoFaPopUp");
	popup.style.display = "none";
}

function QRPopUp() {
	var popup = document.getElementById("QRPopUp");
	if (popup.style.display === "none" || popup.style.display === "") {
		popup.style.display = "block";
	} else {
		popup.style.display = "none";
	}
}

function QRPopUpClose() {
	var popup = document.getElementById("QRPopUp");
	popup.style.display = "none";
}

