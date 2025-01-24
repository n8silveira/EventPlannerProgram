// Get the div in the " aboutMe.json " page where the team cards will go
const teamContainer = document.getElementById("teamContainer");

// Fetch the aboutMe.json file
fetch("aboutMe.json")
  .then(response => response.json()) // Convert response to JSON
  .then(data => {
    // Loop through each team member and create a card
    data.forEach(element => {
      const card = document.createElement("div");
      card.classList.add("team-card", "col-md-4", "text-center", "p-3");

      // Create an img for the member's photo
      const img = document.createElement("img");
      img.src = element.photo;
      img.alt = `${element.name}'s photo`;
      img.classList.add("rounded-circle", "img-fluid", "mb-3");
      img.style.width = "150px";
      img.style.height = "150px";
      card.appendChild(img);

      // Create a header for the member's name
      const nameElm = document.createElement("h3");
      nameElm.textContent = element.name;
      nameElm.classList.add("text-dark-blue");
      card.appendChild(nameElm);

      // Create a paragraph for the member's role
      const roleElm = document.createElement("p");
      roleElm.textContent = `Role: ${element.role}`;
      roleElm.classList.add("text-muted");
      card.appendChild(roleElm);

      // Create a paragraph for the member's about text
      const aboutElm = document.createElement("p");
      aboutElm.textContent = element.about;
      aboutElm.classList.add("text-dark");
      card.appendChild(aboutElm);

      // Create a div for the social links
      const socialLinks = document.createElement("div");
      socialLinks.classList.add("d-flex", "justify-content-center", "gap-3");

      // LinkedIn link
      const linkedinLink = document.createElement("a");
      linkedinLink.href = element.linkedin;
      linkedinLink.target = "_blank";
      linkedinLink.classList.add("btn", "btn-linkedin");
      linkedinLink.textContent = "LinkedIn";
      socialLinks.appendChild(linkedinLink);

      // GitHub link
      const githubLink = document.createElement("a");
      githubLink.href = element.github;
      githubLink.target = "_blank";
      githubLink.classList.add("btn", "btn-github");
      githubLink.textContent = "GitHub";
      socialLinks.appendChild(githubLink);

      // Append the social links div to the card
      card.appendChild(socialLinks);

      // Append the card to the team container
      teamContainer.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Error fetching the JSON data:", error);
  });
