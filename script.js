const express = require('express');
const path = require('path');
const port = 8080

const app = express();

// get endpoint listens on home route
app.get('/api/user', (req, res) => { // callback: request, response
    const users = [{
        id: '123',
        name: 'jawsh',
    }, {
        id: '765',
        name: 'keyshawn',
    }, {
        id: '429',
        name: 'that boy darren',
    }];
    res.json(users);
});

app.post('/', (req, res) => {
    const {parcel} = req.body;
    if (!parcel) {
        return res.status(400).send({status: 'failed...'});
    }
    res.status(200).send({status: 'received!'});
});

app.listen(port, () => {
    console.log(`server stay listening on port: ${port} lol`);
});

/*  
    back-end: function of the code (making data representations for an event)

    when someone clicks "create event", back-end generates a unique key that
    creates an event object and send to a page "event.html" that feeds from the
    event object I created.

    save data with json:
    script sends to database (file: "events.json") that has all of the events

    EVENT INFO:
    - name (string)
    - amount of days (array: 10110)
    - earliest time
    - latest time

    script.js generate random code that come up with a random list of numbers/letters
    v
{
    "eventId": "n21fjwo9c41mwl2na",
    "eventName": "Bible Talks",
    "days":["Monday", "Tuesday", "Wednesday"],
    "plannerUsername": "josh",
    "plannerPassword": "123",
    "startTime": "9:00",
    "endTime": "17:00"
    "people/schedules": [{"josh":{schedule}},{"nate":{schedule}}]
}
let e = {
//     eventId: 0, // name (0 as placeholder)
//     eventName: null,
//     days: [],
//     plannerUsername: "", // placeholder
//     plannerPassword: "", // no one signed in yet
//     startTime: "0:00",
//     endTime: "0:00",
//     schedules: [],
//     setUsername:function(username) {
//         this.plannerUsername = username;
//     },
//     setPassword:function(password) {
//         this.plannerPassword = password;
//     },
//     setStartTime:function(startTime) {
//         this.startTime = startTime;
//     }
// }
// console.log(e.plannerUsername);
// e.setUsername("josh");
// console.log(e.plannerUsername);

// data structure "person":
// name = "string"
// password = "string"
// schedule 

// darren makes event
// - eventID: abc ("script.js") -> abc.json ("events.json") which is a list of ppl
// - 

schedule:
// each one an array of booleans
    monday:
    tuesday:
    wednesday:
    thursday:
    friday:
    saturday:
    sunday:
*/

function createEvent() {
    
}

class person {
    constructor() {
        this.name = name;
        this.schedule = schedule;
    }
}

// class for schedules
// is an array of booleans where true = available, false = unavailable
class Schedule {
    constructor(starttime, endtime) {
        let monday = new Array(96).fill(false); // list of times
        if (monday[i] == available) {
            monday[i] = true;
        }
    }
}

class EventPlan {
    constructor(eventId) {
        this.eventId = eventId;
        this.eventName = eventName;
        this.days = [];
        this.plannerUsername = "";
        this.plannerPassword = "";
    }
    sayYourEventId() {
        console.log(this.eventName+": "+this.eventId);
    }
}

function generateNewEventId() {
    var id = "nfrwonfof3";
    return id; // a new one that doesn't already exist
}

const newEvent = new EventPlan(generateNewEventId(), "YourMom");
newEvent.sayYourEventId();

// go into backend and check for password and username. if not, its eventplanner.
function login() {

}