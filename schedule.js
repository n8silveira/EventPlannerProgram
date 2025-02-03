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
            // add better check later
            if (!personData.schedule) {
                throw new Error("theres no schedule bro");
            }
            const person = {
                name: personData.username,
                schedule: personData.schedule
            };
            people.push(person);
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

// lists people AND takes in array as schedule: [ [Array] ]
function generateEvent(eventID) {
    // grab all the people from events/eventID/people/*
    raw_people = grabPeople(eventID);
    // console.log(raw_people); // [{name: 'angel', schedule: [ ' 10:00am-11:00am' ]}, ...]
    const people = [];

    //convert all times into 24-hour time
    raw_people.forEach(person => {
        const {name, schedule} = person;
        const timeSlots = [];

        // unpack their schedule and then use convertToMilit(time)
        // "sunday;11:00am-2:00pm" -> [0, 1100, 1400]
        schedule.forEach(timeSlot => {
            const [dayAndStartTime, endTime] = timeSlot.split("-"); // "sunday;11:00am", "2:00pm"
            
            const [day, startTime] = dayAndStartTime.split(";"); // "sunday", "11:00am"
            const dayID = getDayID(day.trim().toLowerCase());

            const militStartTime = convertToMilit(startTime.trim()); // update start time
            const militEndTime = convertToMilit(endTime.trim()); // update end time

            timeSlots.push([dayID, militStartTime, militEndTime]);
        });
        people.push({name, schedule: timeSlots});
    });
    return people;
}

// helper function uses switch case to turn sunday=0, monday=1, ...
function getDayID(day) {
    switch (day) {
        case 'sunday':
            return 0;
        case 'monday':
            return 1;
        case 'tuesday':
            return 2;
        case 'wednesday':
            return 3;
        case 'thursday':
            return 4;
        case 'friday':
            return 5;
        case 'saturday':
            return 6;
        default:
            return -1;
    }
}

// const eventID = "EMZADlYxV242q";
// // practice mock example while darren still grinds
// const eventData = {schedule: ['Sunday-11-0', 
//                                 'Friday-20-3', 
//                                 'Sunday-11-1',
//                                 'Tuesday-16-0', 
//                                 'Sunday-11-3',
//                                 'Sunday-11-2',
//                                 'Wednesday-23-3'
//                             ]};
// console.log(packageSchedule(eventID, eventData));
// const people = generateEvent(eventID); // [{name: 'angel', schedule: [ [Array] ] }, ...]
// console.log(people);

