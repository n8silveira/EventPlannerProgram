document.addEventListener("DOMContentLoaded", function() {
  // Get the container where the team cards will be displayed
  const teamContainer = document.getElementById("teamContainer");

  // Fetch the aboutMe.json file
  fetch("aboutMe.json")
    .then(response => response.json()) // Convert response to JSON
    .then(data => {
      // Loop through each team member and create a card
      data.forEach(member => {
        // Create the card container
        const card = document.createElement("div");
        card.classList.add("team-card", "col-md-4", "text-center", "p-3");
        
        // Member photo
        const img = document.createElement("img");
        img.src = member.photo;
        img.alt = `${member.name}'s photo`;
        img.classList.add("rounded-circle", "img-fluid", "mb-3");
        img.style.width = "150px";
        img.style.height = "150px";
        card.appendChild(img);

        // Member name
        const nameElm = document.createElement("h3");
        nameElm.textContent = member.name;
        nameElm.classList.add("text-dark-blue");
        card.appendChild(nameElm);

        // Member role
        const roleElm = document.createElement("p");
        roleElm.textContent = `Role: ${member.role}`;
        roleElm.classList.add("text-muted");
        card.appendChild(roleElm);

        // Member about text
        const aboutElm = document.createElement("p");
        aboutElm.textContent = member.about;
        aboutElm.classList.add("text-dark");
        card.appendChild(aboutElm);

        // Social links container
        const socialLinks = document.createElement("div");
        socialLinks.classList.add("d-flex", "justify-content-center", "gap-3");

        // LinkedIn link
        const linkedinLink = document.createElement("a");
        linkedinLink.href = member.linkedin;
        linkedinLink.target = "_blank";
        linkedinLink.classList.add("btn", "btn-linkedin");
        linkedinLink.textContent = "LinkedIn";
        socialLinks.appendChild(linkedinLink);

        // GitHub link
        const githubLink = document.createElement("a");
        githubLink.href = member.github;
        githubLink.target = "_blank";
        githubLink.classList.add("btn", "btn-github");
        githubLink.textContent = "GitHub";
        socialLinks.appendChild(githubLink);

        // Add social links to card, then card to container
        card.appendChild(socialLinks);
        teamContainer.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Error fetching the JSON data:", error);
    });

  // Initialize Bootstrap tooltips on elements with data-bs-toggle="tooltip"
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
});
