const fs = require('fs');
const path = require('path');

function grabPeople(eventID) {
    // events/eventId/people/*
    const folderPath = path.join(__dirname, 'events', eventID, 'people');
    const people = [];
   
    if (!fs.existsSync(folderPath)) {
        console.error('The "people" folder does not exist.');
        return [];
    }
    // for every file in events/eventId/people/, add their name and push it to people
    const files = fs.readdirSync(folderPath);
   
    // find out how to open a file in 
    files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        const data = fs.readFileSync(filePath, 'utf8'); 

        try {
            const personData = JSON.parse(data); 
            if (personData.username) {
                people.push(personData.username);
            }
        } catch (err) {
            console.error(`Error parsing file ${file}:`, err);
        }
    });
    return people;
}

// convert string input times ("4:45pm") -> int military times (1645)
function convertToMilit(time) {
    // format input into proper convention: 1) hour, 2) mins, 3) am/pm
    const pattern = /^(\d{1,2}):(\d{2})([ap]m)$/i;
    const parts = time.match(pattern); // turns format into array of strings

    let hour = parseInt(parts[1], 10); // hour -> (int)
    const minutes = parseInt(parts[2], 10); // minutes -> (int)
    const meridiem = parts[3].toLowerCase(); // capture "am" or "pm"

    if (meridiem == "pm" && hour != 12) {
        hour += 12; // military hours
    } else if (meridiem == "am" && hour == 12) {
        hour = 0; // checks if midnight
    }
    let militTime = hour * 100 + minutes; // 12 * 100 = 1200
    return militTime;
};

let raw_people = []

function generateEvent(eventId) {
    // grab all the people from events/eventId/people/*
    raw_people = grabPeople(eventId);
    console.log(raw_people);
    const people = [];

    //convert all times into 24-hour time
    raw_people.forEach(person => {
        const {name, schedule} = person;

        const timeSlots = [];

        

        // unpack their schedule and then use convertToMilit(time)
        schedule.forEach(timeSlot => {
            const [startTime, endTime] = timeSlot.split("-"); // take out hyphen
            const militStartTime = convertToMilit(startTime); // update start time
            const militEndTime = convertToMilit(endTime); // update end time
            timeSlots.push([militStartTime, militEndTime]);
        });
        people.push({name, schedule: timeSlots});
    });
    return people;
}
const eventID = "EMZADlYxV242q";
const people = generateEvent(eventID);
console.log(people);