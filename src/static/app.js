document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  function renderActivities(activities) {
    activitiesList.innerHTML = "";
    activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';

    Object.entries(activities).forEach(([name, details]) => {
      const activityCard = document.createElement("div");
      activityCard.className = "activity-card";

      const spotsLeft = details.max_participants - details.participants.length;

      const title = document.createElement("h4");
      title.textContent = name;

      const description = document.createElement("p");
      description.innerHTML = `<strong>Description:</strong> ${details.description}`;

      const schedule = document.createElement("p");
      schedule.innerHTML = `<strong>Schedule:</strong> ${details.schedule}`;

      const availability = document.createElement("p");
      availability.className = "availability";
      availability.innerHTML = `<strong>Availability:</strong> ${spotsLeft} spots left`;

      const participantsSection = document.createElement("div");
      participantsSection.className = "participants-section";

      const participantsTitle = document.createElement("h5");
      participantsTitle.textContent = "Participants";

      const participantsList = document.createElement("ul");
      participantsList.className = "participants-list";

      if (details.participants.length > 0) {
        details.participants.forEach((participant) => {
          const participantItem = document.createElement("li");
          participantItem.className = "participant-item";
          participantItem.textContent = participant;
          participantsList.appendChild(participantItem);
        });
      } else {
        const emptyState = document.createElement("li");
        emptyState.className = "participant-item empty";
        emptyState.textContent = "No participants yet.";
        participantsList.appendChild(emptyState);
      }

      participantsSection.appendChild(participantsTitle);
      participantsSection.appendChild(participantsList);

      activityCard.appendChild(title);
      activityCard.appendChild(description);
      activityCard.appendChild(schedule);
      activityCard.appendChild(availability);
      activityCard.appendChild(participantsSection);

      activitiesList.appendChild(activityCard);

      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      activitySelect.appendChild(option);
    });
  }

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();
      renderActivities(activities);
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
        await fetchActivities();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
