/*
http://localhost:8080/event.html?eventID=EMZADlYxV242q



*/

/*const fs = require('fs');
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
/*


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
    // josh: modified function to return overlapping time slots
     let hours = Math.floor(miliTime / 100);
    let minutes = miliTime % 100;
    let[hours, minutes] = time.split(":");
     
    minutes += numInMins;

   hours += Math.floor(minutes / 60);
   minutes = minutes % 60;

   hours = hours % 24;

   return (hours * 100) + minutes;
}
    function findOverlap(scheduleA, scheduleB) {
        //the total overlapping times between Schedule A and B
        let overlap = [];
        
        //calculate the overlapping time in minutes
        for (let i = 0; i < scheduleA.length; i++) {
            for (let j = 0; j < scheduleB.length; j++) {
                //start and end times
                const start = Math.max(scheduleA[i][0], scheduleB[j][0]);
                const end = Math.min(scheduleA[i][1], scheduleB[j][1]);
                if (start < end) {
                    // only add if it satifies the meetTime
                    // note: fix later, this finds general overlap not nitty gritty
                    // temp fix will just be find 1 hour increment, in the future
                    // make a helper function that converts minutes to milit with add
                    // and subtract method
                    if(end-start >= 100) {
                        var tempStart = start;
                        while(tempStart < end) {
                            var tempEnd = tempStart+100;
                            overlap.push([tempStart, tempEnd]);
                            tempStart += 100;
                        }
                        //overlap.push([start,end]); // Add the overlapping times
                    }
                }
            }
        }
        // return overlapping time slots
        return overlap;
    }
  //const days = ["Sunday" , "Monday", "Tuesday","Wednesday","Thursday","Friday","Saturday",]; 
  const n = people.length;
  const p = Math.floor(n / m);  // number of people per event= amount of people/Number of events 
  console.log("n: %d\nm: %d\np: %d\n", n, m, p);
  
  //console.log(findOverlap(schedules[people[1]], schedules[people[2]]));
  const graph = findCompatibleTimesGraph(people, schedules, meetTime, findOverlap);
  
  //console.log(schedules);

  console.log(graph);

  const pairs = [];

  
  
  // helper function for lists
  function areIdentical(list1, list2) {
    // Check if the lengths are the same
    if (list1.length !== list2.length) {
      return false;
    }
    // Check each element for equality
    for (let i = 0; i < list1.length; i++) {
      if (list1[i] !== list2[i]) {
        return false;
      }
    }
    // If all elements are equal, the lists are identical
    return true;
  }
  function hasDuplicate(list, element) {
    for(let i = 0; i < list.length; i++) {
        if(areIdentical(list[i], element)) {
            return true;
        }
    }
    return false;
  }

  // josh modified: this shouldn't make pairs, should generate sets of size p
  // and p+1 if n%m != 0
  
  // josh approach
  // if there's a closed loop of size p then add that pair
  // maybe: https://www.geeksforgeeks.org/cycles-of-length-n-in-an-undirected-and-connected-graph/
  const keys = Object.keys(graph);
  var V = keys.length;
  var count = 0;
  console.log("V:"+V);
  //console.log(keys.indexOf(graph['Barbara'][2]));
  // go through every person in the graph
  var pairBuilder = [];
  function dfs(graph, marked, n, vert, start) {
    //console.log("vert:"+keys[vert]+ " n:"+n);
    pairBuilder.push(keys[vert]);
    marked[vert] = true;
    //console.log("marking true:"+keys[vert]);
    if(n==0) {
        marked[vert] = false;
        //console.log("marking false:"+keys[vert]);
        // if vertex vert end with vertex start
        //console.log("start:"+keys[start]+" end:"+keys[vert]);
        //console.log(pairBuilder);
        //console.log("includes?:"+graph[keys[start]].includes(keys[vert]));
        // this condition needs to check everyone in the set
        // instead of graph[keys[start]].includes(keys[vert])
        var validPair = true;
        for(let i = 0; i < pairBuilder.length; i++) {
            for(let j = 0; j < pairBuilder.length; j++) {
                if(i == j) {
                    continue;
                }
                //console.log("does "+keys[i]+":"+graph[keys[i]]+" contain "+ keys[j]+"?");
                if(!graph[pairBuilder[i]].includes(pairBuilder[j])) {
                    //console.log("this fails");
                    validPair = false;
                    i = pairBuilder.length;
                    j = pairBuilder.length;
                }
            }
        }
        
        if(validPair) {
            //console.log("its included!");
            var pairToPush = structuredClone(pairBuilder);
            // pairs.sort((a, b) => b.overlap - a.overlap);
            pairToPush.sort();
            if(!hasDuplicate(pairs, pairToPush)) {
                pairs.push(pairToPush);
            }
            pairBuilder.pop();
            count++;
            return;
        } else {
            pairBuilder.pop();
            return;
        }
    }
    // search every possible path of length (n-1)
    var children = graph[keys[vert]];
    //console.log("searching it's children["+children.length+"]:"+children);
    for(var i = 0; i < children.length; i++) {
        if(!marked[keys.indexOf(children[i])]) {
            dfs(graph, marked, n-1, keys.indexOf(children[i]), start);
        }
    }
    marked[vert] = false;
    pairBuilder.pop();
    //console.log("marking false:"+keys[vert]);
  }
  function cycles(graph, n) {
    var marked = Array(V).fill(false);
    for(var i = 0; i < V - (n-1); i++) {
        dfs(graph, marked, n-1,i,i);
        marked[i] = true;
        //console.log("marking true:"+keys[i]);
    }
    //return Math.floor(count/2);
    if(n == 2) {
        return count;
    }
    return Math.floor(count/2);
  }
  
  console.log(cycles(graph, 3));
  

  console.log(pairs);
  return;
  
  //////////////////////////////////////////
  //    EVERYTHING ABOVE THIS IS FIXED    //
  //////////////////////////////////////////
  
  // Sort pairs by overlap in descending order
  //pairs.sort((a, b) => b.overlap.length - a.overlap.length);

  console.log(pairs);
  return;
  //creates empty events/m  array
  const events = Array.from({ length: m }, () => []); 
  //keeps track of people who have already been scheduled into events
  const usedPeople = new Set();
  
  // Scheduling the pairs into events
  for (let i = 0; i < pairs.length; i++) {
      const [personA, personB] = pairs[i].pair;
      let isAvailable = true;
      

      //check if either person is already scheduled into an events
      if (usedPeople.has(personA) || usedPeople.has(personB)) {
          isAvailable = false; // Skip if either person has already been scheduled
      }

      if (isAvailable) {
        // try to put the pairs in an event
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

                  // if they can join, add them to an event
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

function findCompatibleTimesGraph(people, schedules, meetTime,findOverlap) {
  const graph = {};
  
  // Build the graph based on the overlap
  for (let i = 0; i < people.length; i++) {
      const personA = people[i];
      for (let j = i + 1; j < people.length; j++) {
          const personB = people[j];

          // Check if they have enough overlap to meet
          if (findOverlap(schedules[personA], schedules[personB]).length != 0) {
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
const people = ["Alex", "Barbara", "Chris", "Diego", "Emily", "Fran", "Greg"];
const schedules = {
  Alex: [[1300, 1400]],      
  Barbara: [[1300, 1500], [1700, 1800]],
  Chris: [[1300, 1500]],
  Diego: [[1600, 1800]],
  Emily: [[1300, 1400], [1500, 1600]],
  Fran: [[1400, 1800]],
  Greg: [[1500,1600]]
};  
//
const meetTime = 30; // the length of meet up in minutes
const m = 3; // Number of events  

// Run the scheduling function
schedulePeople(people, schedules, m, meetTime);



/////////////////////













