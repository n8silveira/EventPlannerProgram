
function create_random_url(string_length) {
    var random_string = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    for (var i = 0; i < string_length; i++) {
        random_string += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return random_string;
}

document.getElementById('create-event').addEventListener('click', (e) => {
    e.preventDefault();

    const idTest = create_random_url(13);
    const selectedDays = Array.from(document.querySelectorAll('button[data-selected="true"]')).map(button => button.value);

    const jsonData = { // format data as JSON
        eventID: idTest,
        eventName: document.getElementById('event-name').value,
        days: selectedDays,
        // plannerUsername:, "your name" from event.html (login page)
        // plannerPassword:, "password" from event.html (login page)
        earliestTime: document.getElementById('earliest-times').value,
        latestTime: document.getElementById('latest-times').value,
        // schedules, collecting all users schedules
        timestamp: new Date().toISOString(),
    };

    // send JSON to backend
    fetch('http://localhost:8080/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data saved:', data);
    })
    .catch(error => {
        console.error('Error saving data:', error);
    });
})