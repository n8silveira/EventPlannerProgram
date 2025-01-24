document.addEventListener('DOMContentLoaded', () => {
    function changeColor(id) {
        const button = document.getElementById(id);
        if (button.dataset.selected === "true") {
            button.style.backgroundColor = "white";
            button.style.color = "black";
            button.dataset.selected = "false";
        } else {
            button.style.backgroundColor = "lightgreen";
            button.style.color = "black"; 
            button.dataset.selected = "true";
        }
    }
    const dayButtons = document.querySelectorAll('button[id^="b"]');
    dayButtons.forEach(button => {
        button.addEventListener('click', () => changeColor(button.id));
    });
    document.getElementById('create-event').addEventListener('click', (e) => {
        e.preventDefault();

        const eventName = document.getElementById('event-name').value;
        const selectedDays = Array.from(document.querySelectorAll('button[data-selected="true"]')).map(button => button.value);
        
        if (!eventName || selectedDays.length === 0) {
            const errorMessage = document.getElementById('error-message');
            errorMessage.style.display = 'block';
            return;
        }
        document.getElementById('error-message').style.display = 'none';

        const jsonData = { // format data as JSON
            eventName: eventName,
            days: selectedDays,
            earliestTime: document.getElementById('earliest-times').value || '9am',
            latestTime: document.getElementById('latest-times').value || '5pm',
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
            const eventID = data.eventID;
            // window.location.href = 'event.html'; // move to next page
            window.location.href = `event.html?eventID=${eventID}`;
        })
        .catch(error => {
            console.error('Error saving data:', error);
        });
    });
});