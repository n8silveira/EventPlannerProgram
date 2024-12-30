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
            card.classList.add("tream-card")

            // creating an img for the member's photo

            // creating a header for the member's name

            // creating  member's role section

            //creating a about text

            //create a link to their GitHub
        });
    })