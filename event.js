document.addEventListener('DOMContentLoaded', () => {
    const eventID = new URLSearchParams(window.location.search).get('eventID');
    console.log('Event ID:', eventID);
    if (!eventID) {
        alert('EVENT ID MISSING!');
        return;
    }

    document.getElementById('login').addEventListener('click', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            alert('Username and password are required foo');
            return;
        }
        console.log('User data:', {username, password, eventID});

        const userData = {
            username,
            password,
            eventID,
        };

        fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Successfully logged in:', data);
            alert('You have successfully logged in.');
        })
        .catch(error => {
            console.error('Error saving data:', error);
            alert('ERROR.');
        });
    });
});