// get the div in "aboutme page" that the team card will be in//
const teamContainer = document.getElementById("teamContainer");

// fetch the aboutmedata .jason file
fetch("aboutMeData.json")

    //convert the response so json can understand it
    .then(response => response.json())

    //now data is the array of the team members from aboutmedat.json//
    .then(data => {
        // making the loop that cover each member
        data.array.forEach(element => {
            const card = document.createElement("div");

        });
    }