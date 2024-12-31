document.addEventListener('DOMContentLoaded', () => {
    function changeColor(id) {
        const button = document.getElementById(id);
        if (button.style.backgroundColor === "gainsboro") {
            button.style.backgroundColor = "lightgreen";
            button.dataset.selected = "true";
        } else {
            button.style.backgroundColor = "gainsboro";
            button.dataset.selected = "false";
        }
    }

    function create_random_url(string_length) {
        var random_string = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
            plannerUsername: "", // from event.html (login page)
            plannerPassword: "",// from event.html (login page)
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
    });
    const dayButtons = document.querySelectorAll('button[id^="b"]');
    dayButtons.forEach(button => {
        button.addEventListener('click', () => changeColor(button.id));
    });
});