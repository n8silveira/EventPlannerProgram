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
// input: ['Sunday-11-0', ... 'Tuesday-16-2']
// output: ['Sunday; 11:00am-11:15am', 'Tuesday; 4:30pm-4:45pm']
function packageSchedule(eventID, eventData) { // eventData: ['Sunday-11-0', ... 'Tuesday-16-2']
    // pull "schedule:" from eventData
    const scheduleArray = eventData.schedule;
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
        newSchedule.push(`${day};${ranges.join(', ')}`);
    }
    return newSchedule;
}


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
// practice mock example while darren still grinds
const eventData = {schedule: ['Sunday-11-0', 
                                'Friday-20-3', 
                                'Sunday-11-1',
                                'Tuesday-16-0', 
                                'Sunday-11-3',
                                'Sunday-11-2',
                                'Wednesday-23-3'
                            ]};
console.log(packageSchedule(eventID, eventData));
// const people = generateEvent(eventID); // [{name: 'angel', schedule: [ [Array] ] }, ...]
// console.log(people);
