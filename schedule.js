/*/function convertToBlockTime(startTime,endTime){
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
*/

const fs = require('fs');
const path = require('path');

function grabPeople(eventID){
   // events/eventId/people/*
  const folderPath = path.join(__dirname, 'events', eventID, 'people');
  const people = [];
   
   
   if (!fs.existsSync(folderPath)) {
      console.error('The "people" folder does not exist.');
      return [];
  }
   // for every file in events/eventId/people/, add their name and push it to people
   const files = fs.readdirSync(folderPath);
   
   //find out how to open a file in 
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

      return people;
  });
   
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