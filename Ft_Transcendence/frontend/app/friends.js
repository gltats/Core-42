function addFriend() {
    // Get the friend ID from the input field
    const username = document.getElementById('friendUsernameInput').value;
    const csrfToken = getCookie('csrftoken');
    if (username) { // Check if the Username is not empty
      // Modify the endpoint to include the friend_Username in the URL path
      const endpoint = `https://localhost/api/friends/${username}/add_friend/`;
  
      // Use Fetch API to make the POST request
      fetch(endpoint, {
        method: 'POST', // Specify the method
        headers: {
          'Content-Type': 'application/json', // Specify the content type
          'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
        },
        credentials: 'include', // Ensure credentials are included for cookies to be sent
        // No need to send a body for this request since the Username is in the URL
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON in the response
      })
      .then(data => {
        console.log('Success:', data); // Handle the success case
        // Optionally clear the input field after successful operation
        document.getElementById('friendUsernameInput').value = '';
      })
      .catch((error) => {
        console.error('Error:', error); // Handle errors
      });
    } else {
      console.log('Friend Username is required');
      // Optionally, alert the user or handle the empty input case
    }
  }

function removeFriend() {
    // Get the friend's username from the input field
    const username = document.getElementById('friendUsernameInput').value;
    const csrfToken = getCookie('csrftoken');
    if (username) { // Check if the username is not empty
      // Modify the endpoint to include the friend's username in the URL path
      const endpoint = `https://localhost/api/friends/${username}/remove_friend/`;
  
      // Use Fetch API to make the DELETE request
      fetch(endpoint, {
        method: 'DELETE', // Specify the method
        headers: {
          'Content-Type': 'application/json', // Specify the content type
          'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
        },
        credentials: 'include', // Ensure credentials are included for cookies to be sent
        // No need to send a body for this request since the username is in the URL
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON in the response
      })
      .then(data => {
        console.log('Success:', data); // Handle the success case
        // Optionally clear the input field after successful operation
        document.getElementById('friendUsernameInput').value = '';
      })
      .catch((error) => {
        console.error('Error:', error); // Handle errors
      });
    } else {
      console.log('Friend username is required');
      // Optionally, alert the user or handle the empty input case
    }
  }
