/*
http://localhost:8080/event.html?eventID=EMZADlYxV242q



*/

// josh note: we should definitely move away from doing things by name
// and instead generate nameIDs just so that we don't trust users too much

// we need another helper function that finds the minutes between milit time
function minutesBtwMilit(startTime, endTime) {
    minutes = 60; // temp

    return minutes;
}

// helper function barb made to add minutes to military time
function addToMiliTime(miliTime, numInMins){
    //convert military time to hours and mins
    let hours = Math.floor(miliTime / 100);
    let minutes = miliTime % 100;
     
    //add numInMins to mins
    minutes += numInMins;

  //add the total mins to the hours if its over 60 and takes remainder
   hours += Math.floor(minutes / 60);
   minutes = minutes % 60;
 
   //doesnt allow hours to go pass 24hours
   hours = hours % 24;

 // returns the new military time
   return (hours * 100) + minutes;
}

function schedulePeople(people, schedules, m, meetTime) {
    // josh: modified function to return overlapping time slots
    function findOverlap(scheduleA, scheduleB) {
        //the total overlapping times between Schedule A and B
        let overlap = [];
        
        //calculate the overlapping time in minutes
        for (let i = 0; i < scheduleA.length; i++) {
            for (let j = 0; j < scheduleB.length; j++) {
                if(scheduleA[i][0] != scheduleB[j][0]) {
                    continue;
                }
                //start and end times
                const start = Math.max(scheduleA[i][1], scheduleB[j][1]);
                const end = Math.min(scheduleA[i][2], scheduleB[j][2]);
                if (start < end) {
                    // only add if it satifies the meetTime
                    // note: fix later, this finds general overlap not nitty gritty
                    // temp fix will just be find 1 hour increment, in the future
                    // make a helper function that converts minutes to milit with add
                    // and subtract method
                    if(minutesBtwMilit(start, end) >= meetTime) {
                        var tempStart = start;
                        while(tempStart < end) {
                            var tempEnd = addToMiliTime(tempStart, meetTime);
                            overlap.push([scheduleA[i][0], tempStart, tempEnd]);
                            tempStart = addToMiliTime(tempStart, meetTime);
                        }
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
  const unevenP = n%m!=0;
  console.log("n: %d\nm: %d\np: %d\nunevenP:%d\n", n, m, p, unevenP);
  
  console.log(schedules);
  //console.log(findOverlap(schedules[people[1]], schedules[people[2]]));
  const graph = findCompatibleTimesGraph(people, schedules, meetTime, findOverlap);
  
  //console.log(schedules);

  console.log(graph);

  const sets = [];

  
  
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
  function hasDuplicate(sets, element) {
    for(let i = 0; i < sets.length; i++) {
        if(areIdentical(sets[i].set, element)) {
            return true;
        }
    }
    return false;
  }

  // josh modified: this shouldn't make pairs, should generate sets of size p
  // and p+1 if n%m != 0
  // josh approach
  // if there's a closed loop of size p then add that pair
  // credit: https://www.geeksforgeeks.org/cycles-of-length-n-in-an-undirected-and-connected-graph/
  const keys = Object.keys(graph);
  var V = keys.length;
  var count = 0; // this is not needed, just for debug ig
  console.log("V:"+V);
  //console.log(keys.indexOf(graph['Barbara'][2]));
  // go through every person in the graph
  var setBuilder = [];
  function dfs(graph, marked, n, vert, start) {
    //console.log("vert:"+keys[vert]+ " n:"+n);
    setBuilder.push(keys[vert]);
    marked[vert] = true;
    //console.log("marking true:"+keys[vert]);
    if(n==0) {
        marked[vert] = false;
        //console.log("marking false:"+keys[vert]);
        // if vertex vert end with vertex start
        //console.log("start:"+keys[start]+" end:"+keys[vert]);
        //console.log(setBuilder);
        var validSet = true;
        for(let i = 0; i < setBuilder.length; i++) {
            for(let j = 0; j < setBuilder.length; j++) {
                if(i == j) {
                    continue;
                }
                //console.log("does "+keys[i]+":"+graph[keys[i]]+" contain "+ keys[j]+"?");
                if(!graph[setBuilder[i]].includes(setBuilder[j])) {
                    //console.log("this fails");
                    validSet = false;
                    i = setBuilder.length;
                    j = setBuilder.length;
                }
            }
        }
        
        if(validSet) {
            //console.log("its included!");
            var rawSet = structuredClone(setBuilder);
            rawSet.sort();
            if(!hasDuplicate(sets, rawSet)) {
                var masterOverlap = [];
                var anchorSched = schedules[rawSet[0]];
                anchorSched.forEach(element => {
                    masterOverlap.push(JSON.parse(JSON.stringify(element)));
                });
                //var tempOverlap = structuredClone(keys.indexOf(rawSet[0]));
                for(let i = 1; i < rawSet.length; i++) {
                    let newOverlap = findOverlap(masterOverlap, schedules[rawSet[i]]);
                    var tempOverlap = [];
                    newOverlap.forEach(element => {
                        tempOverlap.push(JSON.parse(JSON.stringify(element)));
                    });
                    masterOverlap = tempOverlap;
                }
                var overlap = masterOverlap; // remember to set this appropiately
                var setToPush = { set: rawSet, overlap: overlap};
                if(overlap.length != 0) {
                    sets.push(setToPush);
                }
            }
            setBuilder.pop();
            count++;
            return;
        } else {
            setBuilder.pop();
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
    setBuilder.pop();
    //console.log("marking false:"+keys[vert]);
  }
  function cycles(graph, n) {
    count = 0;
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
  
  cycles(graph, p);
  if(unevenP) {
    cycles(graph, p+1);
  }

  
  
  // Sort sets by size in descending order
  sets.sort((a, b) => b.set.length - a.set.length);

  sets.forEach(element => {
    console.log(element);
  });

  //////////////////////////////////////////
  //    EVERYTHING ABOVE THIS IS FIXED    //
  //////////////////////////////////////////

  return;
  //creates empty events/m  array
  const events = Array.from({ length: m }, () => []); 
  //keeps track of people who have already been scheduled into events
  const usedPeople = new Set();
  
  // Scheduling the pairs into events
  for (let i = 0; i < sets.length; i++) {
      const [personA, personB] = sets[i].pair;
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
  Alex: [[0, 1300, 1400]],   
  Barbara: [[0, 1300, 1500], [0, 1700, 1800]],
  Chris: [[0, 1300, 1500]],
  Diego: [[0, 1600, 1800]],
  Emily: [[0, 1300, 1400], [0, 1500, 1600]],
  Fran: [[0, 1400, 1800]],
  Greg: [[0, 1500,1600]]
};  
//
const meetTime = 60; // the length of meet up in minutes
const m = 3; // Number of events  

// Run the scheduling function
schedulePeople(people, schedules, m, meetTime);



/////////////////////













