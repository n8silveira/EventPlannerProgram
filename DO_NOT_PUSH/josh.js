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
function addToMilitTime(miliTime, numInMins){
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
                // skip if not the same day
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
                            var tempEnd = addToMilitTime(tempStart, meetTime);
                            overlap.push([scheduleA[i][0], tempStart, tempEnd]);
                            tempStart = addToMilitTime(tempStart, meetTime);
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
  const graph = findCompatibleTimesGraph(people, schedules, findOverlap);
  
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
  /*
  sets.forEach(element => {
    console.log(element);
  });*/
  console.log(sets);
  //////////////////////////////////////////
  //    EVERYTHING ABOVE THIS IS FIXED    //
  //////////////////////////////////////////


  
  // helper function to see if the current set is in usedPeople
  function inUsedPeople(set, usedPeople) {
    for(let i = 0; i < set.set.length; i++) {
        if(usedPeople.includes(set.set[i])) {
            return true;
        }
    }
    return false;
  }
  // helper function that checks if event is in usedEvents
  // for now just checks if they are exact...
  function inUsedEvents(event, usedEvents) {
    for(let i = 0; i < usedEvents.length; i++) {
        if(event[0] == usedEvents[i][0] && event[1] == usedEvents[i][1] && event[2] == usedEvents[i][2]) {
            return true;
        }
    }
    return false;
  }
  //return;

  //keeps track of people who have already been scheduled into events
  var usedPeople = [];
  var usedEventTimes = [];
  var usedEvents = [];
  var triedEvent = Array(sets.length).fill(0);
  
  // initialize desiredLength to appropiate (p or p+1);
  var desiredSetLength = unevenP ? p+1 : p;
  var anchorIndex = 0;
  var i = 0;

  while(i <= sets.length) {
    // final check to see if we succeeded
    if(i == sets.length) {
        var fail = false;
        console.log("final check");
        if(usedPeople.length != keys.length) {
            console.log("fail condition: not everyone used");
            fail = true;
            anchorIndex++;
        }
        // iterate appropiately and continue or success
        if(fail) {
            // reset appropiately
            usedPeople = [];
            usedEventTimes = [];
            usedEvents = [];
            triedEvent = Array(sets.length).fill(0);
            desiredSetLength = p+1;
            i = anchorIndex;
            continue;
        } else {
            console.log("success");
            i = sets.length+1;
            continue;
        }
    }
    var skip = false;

    // if this set length is not the desired, skip it
    if(sets[i].set.length != desiredSetLength) {
        console.log("skipping because desiredSetLength="+desiredSetLength);
        skip = true;
    }

    // as long as its not in used people
    if(!skip && inUsedPeople(sets[i], usedPeople)) {
        console.log("skipping because "+sets[i].set + " is in usedPeople:"+usedPeople);
        skip = true;
    }
    // as long as its not an already made bible talk
    if(!skip && inUsedEvents(sets[i].overlap[triedEvent[i]], usedEventTimes)) {
        // check event times until we've exhausted all options
        if(triedEvent[i] >= sets[i].overlap.length) {
            skip = true;
        } else {
            // check this i again with differring triedEvent index
            triedEvent[i]++;
            continue;
        }
        
    }

    if(skip) {
        // iterate i and continue(redundant) 
        i++;
        continue;
    } else {
        // if we're not skipping...
        // add this configuration to usedEvents/usedPeople
        console.log("adding "+sets[i].set+" with time: "+sets[i].overlap[triedEvent[i]]);
        usedEventTimes.push(sets[i].overlap[triedEvent[i]]);
        sets[i].set.forEach(person => {
            usedPeople.push(person);
        });
        usedEvents.push(sets[i].set);
        // if desiredSetLength was p+1, set it back to p
        if(desiredSetLength == p+1) {
            console.log("found p+1, setting to p now");
            desiredSetLength = p;
        }
        // finally iterate i
        i++;
    }
  }

  console.log("=====final results=====");
  for(let i = 0; i < usedEvents.length; i++) {
    console.log(usedEvents[i]+" meeting at "+usedEventTimes[i]);
  }

  return;
  // 0. going through all the events...
  // 1. make sure event is valid (not in usedPeople/usedEvents/etc.)
  // 2. if so, choose that event (add it to usedPeople/usedEvents/etc.)
  // 3. repeat steps 1&2 until we the end or 
  

  
  console.log("Scheduled Events:", events);


}

function findCompatibleTimesGraph(people, schedules,findOverlap) {
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













