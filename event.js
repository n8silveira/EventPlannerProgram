function loadAndGenerateSchedule(eventID) {
    const eventData = {
        eventID
    };
    fetch('http://localhost:8080/event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    })
    .then(async (response) => {
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(errorData.message);
        }
        const days = responseData.days; // parameter 1: "days": [] from events/eventID.json
        const earliestTime = responseData.earliestTime; // parameter 2: "earliestTime": "" from events/eventID.json
        const latestTime = responseData.latestTime; // parameter 3: "latestTime": "" from events/eventID.json
        generateScheduleTables(days, earliestTime, latestTime); // call generateScheduleTables() with desired data taken from eventID.json
    })
    .catch(error => {
        console.error('Error grabbing event data:', error);
    });
}



document.addEventListener('DOMContentLoaded', () => {
    const eventID = new URLSearchParams(window.location.search).get('eventID');
    console.log('Event ID:', eventID);
    if (!eventID) {
        alert('EVENT ID MISSING!');
        return;
    }
    
    document.getElementById('save-button').addEventListener('click', (e) => {
        // test with http://localhost:8080/event.html?eventID=R55lD20cbTibW
        const formattedSchedule = packageSchedule();
        console.log(formattedSchedule);
    });
    
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
        .then(async (response) => {
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(errorData.message);
            }
            alert(responseData.message);
            if (responseData.isPlanner) {
                activateEventPlanner(username);
            } else {
                activateNormalUser(username);
            }

            loadAndGenerateSchedule(eventID);
        })
        .catch(error => {
            console.error('Error logging in:', error);
            alert('Incorrect password...');
        });
    });
    // const scheduleIDs = document.querySelectorAll('button[id^="b"]');
    // make string formatted correctly:

});

function activateEventPlanner(username) {
    // take id tags from event.html
    const successfulLoginField = document.getElementById('successfulLogin_field');
    successfulLoginField.hidden = false;
    successfulLoginField.textContent = `Welcome back, ${username}! You're the event planner`;

    const eventPlannerOptions = document.getElementById('eventplanneroptions');
    eventPlannerOptions.hidden = false;

    const loginField = document.getElementById('login_field');
    loginField.hidden = true;
}
// next step: first person to log into event is "eventplanner"
// if someone is eventplanner and they log in is only when "how many events do u want?" shows up 
function activateNormalUser(username) {
    const successfulLoginField = document.getElementById('successfulLogin_field');
    successfulLoginField.hidden = false;
    successfulLoginField.textContent = `Welcome back, ${username}!`;

    const loginField = document.getElementById('login_field');
    loginField.hidden = true;
}

/*
  pull data from darren's schedule table and package into nice format
  "schedule": ["monday; 9:00am-10:00am", "monday; 11:00am-1:00pm"] ["wednesday; 9:00am-11:00am"]
  loop thru all 15 min increments; check to see if each  block is highlighted
*/
// input: ['Sunday-11-0', ... 'Tuesday-16-2']
// output: ['Sunday; 11:00am-11:15am', 'Tuesday; 4:30pm-4:45pm']
function packageSchedule() { // eventData: ['Sunday-11-0', ... 'Tuesday-16-2']
    // pull "schedule:" from eventData
    const scheduleArray = Array.from(document.querySelectorAll('td[data-selected="true"]')).map(table => table.getAttribute('id'));
    const packagedSchedule = {};

    for (let i = 0; i < scheduleArray.length; i++) {
        // separate each index as a "time block"
        const timeBlock = scheduleArray[i];
        const splitTimeBlock = timeBlock.split('-'); // divide it into three parts: [i]-[j]-[k]

        // [i]: iterate thru days (Sunday -> Saturday)
        const day = splitTimeBlock[0].toLowerCase();
        // [j]: iterate through hours (11 -> 12)
        const hour = splitTimeBlock[1];
        // [k]: iterates thru 15-min increments
        const quarter = splitTimeBlock[2]; // 0 = :00-15; 1 = :15-30; 2 = :30-45; 3 = :45-00

        // turn hour and quarter from strings to ints
        const startOfHour = parseInt(hour, 10);
        const startOfMinute = parseInt(quarter, 10) * 15; // 0*15 = 0(mins), 1*15=15; 2*15=30, 3*15=45

        // create the new formatted time: hour:minute,meridian
        const filledMinute = startOfMinute.toString().padStart(2, '0');
        const formattedTime = `${startOfHour % 12 || 12}:${filledMinute}${startOfHour >= 12 ? 'pm' : 'am'}`; // '12:00pm'
        
        if (!packagedSchedule[day]) {
            packagedSchedule[day] = [];
        }
        // push all that correctly formatted data into day
        packagedSchedule[day].push({hour: startOfHour, minute: startOfMinute, formatted: formattedTime});        
    }
    console.log(packagedSchedule);

    const newSchedule = []; // blank slate
    // grab specifically the key attributes (Sunday, Tuesday etc)
    const formattedKeys = Object.keys(packagedSchedule);
    
    for (let i = 0; i < formattedKeys.length; i++) {
        const day = formattedKeys[i]; // iterate thru 
        const times = packagedSchedule[day];
        
        // function to sort times array in chronological order
        times.sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));

        const ranges = [];
        var startTime = null;

        for (let j = 0; j < times.length; j++) {
            const time = times[j];
            const nextTime = times[j + 1]; // check following block of time (to see if selected)
            if (startTime == null) {
                startTime = time;
            }
            if (nextTime && ((nextTime.hour * 60 + nextTime.minute) - (time.hour * 60 + time.minute)) == 15) {
                continue;
            } else {
                time.minute += 15;
                if (time.minute >= 60) {
                    time.hour += 1;
                    time.minute = 0;
                    if (time.hour >= 24) {
                        time.hour = 0;
                    }
                }
                const startOfHour = time.hour;
                const startOfMinute = time.minute;
                const filledMinute = startOfMinute.toString().padStart(2, '0');
                const formattedTime = `${startOfHour % 12 || 12}:${filledMinute}${startOfHour >= 12 ? 'pm' : 'am'}`; // '12:00pm'
        
                ranges.push(`${startTime.formatted}-${formattedTime}`);
                startTime = null;
            }
        }
        ranges.forEach(range => {
            newSchedule.push(`${day};${range}`);
        });
        // newSchedule.push(`${day};${ranges.join(', ')}`);
    }
    return newSchedule;
}
