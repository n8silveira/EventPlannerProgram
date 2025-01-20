let raw_people = []
let people = [] // name, schedule (dict)

function grabPeople(eventId) { }
function convertToMilit(time) { }

function generateEvent(eventId) {
    // grab all the people from events/eventId/people/*
    people = grabPeople(eventId);
    /* at this point:
    name: "Josh"
    schedule: ["9:00am-10:30am","11:30am-12:00pm","2:00pm-5:00pm"]
    */
    
    //convert all times into 24-hour time
    raw_people.forEach(person => {
        timeSlots = []
        // unpack their schedule and then use convertToMilit(time)
        schedule.forEach(timeSlot => {
            let[startTime, endTime] = timeSlot.split("-");
            militStartTime = convertToMilit(startTime);
            militEndTime = convertToMilit(endTime);
            timeSlots.push([startTime, endTime]);
        });
        people.push({name, timeSlots});
    });
    /* at this point:
    name: "Josh"
    schedule: [[900,1030],[1130,1200],[1300,1700]]
    */
   
    // do algo
}