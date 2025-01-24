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
const grab = grabPeople("EMZADlYxV242q"); // after calling this...
console.log(grab); // desired output -> ["barb","josh","nate"]



//Josh logic
/*
Input: List of people with schedules, number of events(m)
convert each person's schedule into integer intervals
bulid a digraph:
for each pair of people:
if their schedules overlap, draw an edge between A and B.
4. Group people:
   Use an algorithm to form groups of compatible people.
5. Distribute groups into m Bible Talks:
   Ensure groups are evenly distributed across BTs.
   Avoid assigning the same time slot to multiple BTs.
6. Output the list of Bible Talks with assigned people and time slots.
*/
function schedulePeople(people, schedules, m, meetTime) {
    function findOverlap(scheduleA, scheduleB) {
        let overlap = 0;
        
        for (let i = 0; i < scheduleA.length; i++) {
            for (let j = 0; j < scheduleB.length; j++) {
                const start = Math.max(scheduleA[i][0], scheduleB[j][0]);
                const end = Math.min(scheduleA[i][1], scheduleB[j][1]);
                if (start < end) {
                    overlap += end - start; // Add the overlapping times
                }
            }
        }
        
        return overlap;
    }
    
  const n = people.length;
  const p = Math.floor(n / m);  // Number of people per event
  const graph = findCompatibleTimesGraph(people, schedules, meetTime);

  const pairs = [];
  
  // Create pairs based the graph 
  for (let personA in graph) {
      for (let i = 0; i < graph[personA].length; i++) {
          const personB = graph[personA][i];
          if (personA < personB) {
            //calculate overlap
            const overlap = findOverlap(schedules[personA], schedules[personB]);
            //add pair with overlap
              pairs.push({ pair: [personA, personB], overlap });
          }
      }
  }
  
  // Sort pairs by overlap in descending order
  pairs.sort((a, b) => b.overlap - a.overlap);

  //creates empty events array
  const events = Array.from({ length: m }, () => []); 
  const usedPeople = new Set();
  
  // Scheduling the pairs into events
  for (let i = 0; i < pairs.length; i++) {
      const [personA, personB] = pairs[i].pair;
      let isAvailable = true;

      if (usedPeople.has(personA) || usedPeople.has(personB)) {
          isAvailable = false; // Skip if either person has already been scheduled
      }

      if (isAvailable) {
          for (let j = 0; j < events.length; j++) {
              const event = events[j];
              
              // Check if both persons can join the event
              if (event.length < p) {  // If there is space in the event
                  let canJoin = true;
                  for (let member of event) {
                      if (!graph[member]?.includes(personA) || !graph[member]?.includes(personB)) {
                          canJoin = false;
                          break;
                      }
                  }
                  
                  if (canJoin) {
                      event.push(personA, personB);
                      usedPeople.add(personA);
                      usedPeople.add(personB);
                      break;  // Once added to an event, move to the next pair
                  }
              }
          }
      }
  }

  console.log("Scheduled Events:", events);
}

function findOverlap(scheduleA, scheduleB) {
    let overlap = 0;
    
    for (let i = 0; i < scheduleA.length; i++) {
        for (let j = 0; j < scheduleB.length; j++) {
            const start = Math.max(scheduleA[i][0], scheduleB[j][0]);
            const end = Math.min(scheduleA[i][1], scheduleB[j][1]);
            if (start < end) {
                overlap += end - start; // Add the overlapping times
            }
        }
    }
    
    return overlap;
}


function findCompatibleTimesGraph(people, schedules, meetTime) {
  const graph = {};
  
  // Build the graph based on the overlap
  for (let i = 0; i < people.length; i++) {
      const personA = people[i];
      for (let j = i + 1; j < people.length; j++) {
          const personB = people[j];

          // Check if they have enough overlap to meet
          if (findOverlap(schedules[personA], schedules[personB]) >= meetTime) {
              if (!graph[personA]) graph[personA] = [];
              if (!graph[personB]) graph[personB] = [];

              // Add the connection between personA and personB
              graph[personA].push(personB);
              graph[personB].push(personA);
          }
      }
  }

  return graph;
}

// Example data
const people = ["Alex", "Barbara", "Chris", "Diego", "Emily", "Fran"];
const schedules = {
  Alex: [[1300, 1400]],      
  Barbara: [[1300, 1500], [1700, 1800]],
  Chris: [[1300, 1500]],
  Diego: [[1600, 1800]],
  Emily: [[1300, 1400], [1500, 1600]],
  Fran: [[1400, 1800]]
};
const meetTime = 60;
const m = 3; // Number of events  

// Run the scheduling function
schedulePeople(people, schedules, m, meetTime);
