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

/*
  pull data from darren's schedule table and package into nice format
  "schedule": ["monday; 9:00am-10:00am", "monday; 11:00am-1:00pm"] ["wednesday; 9:00am-11:00am"]
  loop thru all 15 min increments; check to see if each  block is highlighted
*/
function packageSchedule(eventID) { // eventData: ['Sunday-11-0', ... 'Tuesday-16-2']
    // var hour = document.getElementById("");
    // const folderPath = path.join(__dirname, 'events', eventID, `${eventID}.json`);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeIntervals = ['00', '15', '30', '45'];

    // practice example while darren still grinds
    let mockExample = ['Sunday-11-0', 'Sunday-11-1', 'Sunday-11-3', 'Tuesday-16-2'];

    const packagedSchedule = [];

    // [i]: iterate thru days (Sunday -> Saturday)
    for (let i = 0; i < days.length; i++) {
        const currentDay = days[i];
        let dayPortion = [];
        // [j]: iterate through hours (11 -> 12)
        for (let j = 0; j < 24; j++) {
            let currentBlock = '';
            // [k]: iterates thru 15-min increments
            // 0 = :00-15; 1 = :15-30; 2 = :30-45; 3 = :45-00 
            for (let k = 0; k < 3; k++) {
                const correctLayout = `${currentDay}-${j}-${k}`; // right format
                if (mockExample.includes(correctLayout)) {
                    const formattedTime = `${j}:${timeIntervals[k].padStart(2, '0')}am`; // add 0 at the end
                    if (!currentBlock) {
                        currentBlock = formattedTime;
                    }
                } else if (currentBlock) {
                    const endtime = `${j}:${timeIntervals[k].padStart(2, '0')}am`;
                    dayPortion.push(`${currentBlock}-${endtime}`);
                    currentBlock = '';
                }
            }
            // pushes multiple days
            if (currentBlock) {
                // completes 15-min interval block
                const endtime = `${j + 1}:00am`; // change to regex am/pm
                dayPortion.push(`${currentBlock}-${endtime}`); 
            }
        }
        if (dayPortion.length > 0) {
            packagedSchedule.push(`${currentDay}; ${dayPortion.join(', ')}`);
        }
    }
    return packagedSchedule;
}

// split by ;
// convert string input times ("4:45pm") -> int military times (1645)
function numerizeSchedule(time) {
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
console.log(packageSchedule(eventID));
// const people = generateEvent(eventID); // [{name: 'angel', schedule: [ [Array] ] }, ...]
// console.log(people);
