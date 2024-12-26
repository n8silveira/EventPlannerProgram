/*  
    back-end: function of the code
    making data representations for an event

    when someone clicks "create event", back end generates a unique key that
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
    "eventId":"fnewjmfkow",
    "eventName":"Bible Talks",
    "days":["Monday", "Tuesday", "Wednesday"],
    "plannerUsername": "josh",
    "plannerPassword": "123",
    "startTime": "9:00",
    "endTime": "17:00"
    "people/schedules": [{"josh":{schedule}},{"nate":{schedule}}]
}


*/
// data scrture "person":
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

function 



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
        this.schedule = [/*boolean*/]; // list of times
        for (int i = 0; i < 96; i++) {
            this.schedule[i] = false;
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

// let e = {
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