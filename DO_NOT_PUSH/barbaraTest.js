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

   console.log(addToMiliTime(1130, 95));