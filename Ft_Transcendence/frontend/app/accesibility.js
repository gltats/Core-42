function accesibilityPopUp() {
	var popup = document.getElementById("accesibilityPopUp");
	if (popup.style.display === "none" || popup.style.display === "") {
		popup.style.display = "block";
	} else {
		popup.style.display = "none";
	}
}

function accesibilityPopUpClose() {
	var popup = document.getElementById("accesibilityPopUp"); // Corrected ID to match the element's ID
	if (popup.style.display === "none") {
		popup.style.display = "none"; // This line is redundant and can be removed
	} else {
		popup.style.display = "none"; // This hides the popup
	}
}

//flag to check if the reader is on or off
var readerFlag = false;

document.addEventListener('DOMContentLoaded', function () {
	//language
	const translations = {
        english: {
			alert: 'Please note that the reader is only available in English.',
        },
        spanish: {
			alert: 'Tenga en cuenta que el lector solo está disponible en inglés.',
        },
        french: {
			alert: 'Veuillez noter que le lecteur n\'est disponible qu\'en anglais.',
        },
        german: {
			alert: 'Bitte beachten Sie, dass der Reader nur auf Englisch verfügbar ist.',
        },
        dutch: {
			alert: 'Houd er rekening mee dat de lezer alleen beschikbaar is in het Engels.',
        },
        russian: {
			alert: 'Обратите внимание, что ридер доступен только на английском языке.',
        },
    };

    // Function to get the translation for the current language
    function getTranslation(key) {
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'english';
        return translations[savedLanguage][key];
    }

	// Font size control
	var fontSizeControl = document.getElementById('fontSizeControl');
	fontSizeControl.addEventListener('input', function () {
		var value = this.value;
		// Example mapping: value of 0 to 3 maps to font sizes 12px to 18px
		var fontSizeMap = {
			'0': '12px',
			'0.5': '14px',
			'1': '16px',
			'1.5': '18px',
			'2': '20px',
			'2.5': '22px',
			'3': '24px'
		};
		var fontSize = fontSizeMap[value];
		document.body.style.fontSize = fontSize;
	});

	//Speaker
	var readerCheckbox = document.getElementById('readerForm');

	// Function to speak text using the Web Speech API
	function speak(text) {
		//if language is set to a non english language, set the language to the selected language
		const savedLanguage = localStorage.getItem('selectedLanguage');
		if (savedLanguage !== 'english') {
			alert(getTranslation('alert'));
			document.getElementById('readerForm').checked = false;
			stopSpeaking();
			readerFlag = false;
			return;
		}
		var utterance = new SpeechSynthesisUtterance(text);
		speechSynthesis.speak(utterance);
		readerFlag = true;
	}

	// Function to stop speaking
	function stopSpeaking() {
		speechSynthesis.cancel();
		readerFlag = false;
	}


	// Function to get text for different types of elements
	function getTextForElement(element) {
		if (element.tagName === 'INPUT' && element.type === 'color') {
			var label = document.querySelector(`label[for="${element.id}"]`);
			if (label) {
				return `Color for ${label.textContent}`;
			} else {
				return 'Select color';
			}
		} else if (element.tagName === 'INPUT' && element.type === 'button') {
			return element.value;
		} else if (element.tagName === 'INPUT' && element.type === 'checkbox') {
			var checkboxLabel = document.querySelector(`label[for="${element.id}"]`);
			var status = element.checked ? "on" : "off";
			// Check if the checkbox is the dark mode switch
			if (element.id === 'darkModeSwitch' || element.value === 'dark mode switch') {
				return `dark mode switch ${status}`;
			} else if (element.id === 'readerForm' || element.value === 'reader') {
				return `reader ${status}`;
			} else if (checkboxLabel) {
				return `${checkboxLabel.textContent} is ${status}`;
			} else {
				return `Checkbox is ${status}`;
			}
		}else if (element.tagName === 'INPUT' && element.type === 'range') {
			var label = document.querySelector(`label[for="${element.id}"]`);
			var atMinimum = element.value == element.min;
			var atMaximum = element.value == element.max;
			
			if (atMinimum) {
				return `Font size reduced to the minimum`;
			} else if (atMaximum) {
				return `Font size incremented to the maximum`;
			} else {
				return `Font size changed to ${element.value}`;
			}
		} else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
			return element.placeholder || element.value || 'Text input';
		} else if (element.tagName === 'SELECT') {
			return element.options[element.selectedIndex].text;
		} else if (element.tagName === 'IMG') {
			return element.alt || 'Image';
		} else if (element.hasAttribute('aria-label')) {
			return element.getAttribute('aria-label');
		} else if (element.id && document.querySelector(`label[for="${element.id}"]`)) {
			return document.querySelector(`label[for="${element.id}"]`).textContent;
		} else {
			return element.textContent || 'No text found';
		}
	}

	// Add a focus event listener to all focusable elements
	var focusableElements = document.querySelectorAll('a, h1, h2, h3, h4, h5, h6, p, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])');
	focusableElements.forEach(function (element) {
		if (element.tagName === 'INPUT' && element.type === 'range' 
			|| element.tagName === 'INPUT' && element.type === 'checkbox'
		) {
			// Add an input event listener specifically for range inputs
			element.addEventListener('input', function () {
				var textToSpeak = getTextForElement(this);
				if (readerCheckbox.checked) {
					speak(textToSpeak);
				} else if(readerCheckbox.checked == false) {
					stopSpeaking();
				}
			});
		} else {
			// Existing focus event listener for other focusable elements
			element.addEventListener('focus', function () {
				var textToSpeak = getTextForElement(this);
				if (readerCheckbox.checked) {
					speak(textToSpeak);
				} else if(readerCheckbox.checked == false) {
					stopSpeaking();
				}
			});
		}
	});

});