let people = [];

function convertToBlockTime(startTime,endTime){
   const blockTime = (time) => {
      //01:30 
      let[hours, minutes] = time.split(":").map(Number);
      return (hours * 2) + Math.floor(minutes /30);
   };
   
   let startBlock = blockTime(startTime);
   let endBlock = blockTime(endTime);

   let blocks = [];
   for(let i = startBlock; i < endBlock; i++){
      blocks.push(i);
   }

return blocks;

}

function addPeople(name, availabilty){
   availabilty.forEach(time => {
      let[startTime, endTime] = time.split("-");
      let blocks = convertToBlockTime(startTime, endTime);
      people.push({name, availabilty: blocks});
      
   });
}

function grabPeople(eventId) {
   // events/eventId/people/*
   // ...
   // for every file in events/eventId/people/, add their name and push it to people
   // ...
}

/*function findCompatibleTimesGraph(people,m):
   const graph = new Map();

    people.forEach(pair =>{
      const{pairA, pairB} = 
       

    }

    )
*/
 
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