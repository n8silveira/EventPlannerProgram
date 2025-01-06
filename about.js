// get the div in "aboutMe.json page" that the team card will be in
const teamContainer = document.getElementById("teamContainer");

// fetch aboutMe.json file
fetch("aboutMe.json")

    //convert the response so json can understand it
    .then(response => response.json())

    //now data is the array of the team members from aboutMe.json//
    .then(data => {
        // making the loop that cover each member
        data.forEach(element => {
            const card = document.createElement("div");
            card.classList.add("team-card")

            // creating an img for the member's photo
            const img = document.createElement("img");
            img.src = element.photo;
            card.appendChild(img);

            // creating a header for the member's name
            const nameElm = document.createElement("h3");
            nameElm.textContent = element.name;
            card.appendChild(nameElm);

            // creating  member's role section
            const roleElm = document.createElement("p")
            roleElm.textContent = `Role: ${element.role}`;
            card.appendChild(roleElm);
            
            //creating a about text
            const aboutElm = document.createElement("p");
            aboutElm.textContent = element.about;
            card.appendChild(aboutElm);

            //create a link to their GitHub
            //const githublink=document.createElement("a");
            //githublink.href = element.github;
            //githublink.textContent = "Github";
            //card.appendChild(githublink)

            //append the card tot the team container
            teamContainer.appendChild(card)
        });
    })
     // If something goes wrong, log the error
  .catch(error => {
    console.error("Error fetching the JSON data:", error);
  });