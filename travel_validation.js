document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault(); // prevent form submission

  // Collect user input values
  const tripType = document.querySelector('input[name="trip_type"]:checked')?.value;
  const place = document.querySelector('select[name="place"]')?.value.trim();
  const budget = document.querySelector('input[name="budget"]:checked')?.value;
  const time = document.querySelector('input[name="time"]:checked')?.value;
  const climate = document.querySelector('input[name="prefer_climate"]:checked')?.value;
  const activity = document.querySelector('input[name="activities"]:checked')?.value;

  // Reset errors
  const showError = (id, msg) => {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  };

  showError("tripTypeError", "");
  showError("placeError", "");
  showError("budgetError", "");
  showError("timeError", "");

  // Validation check
  let missingFields = [];

  if (!tripType) {
    showError("tripTypeError", "Please select a trip type.");
    missingFields.push("Trip Type");
  }
  if (!budget) {
    showError("budgetError", "Please select a budget.");
    missingFields.push("Budget");
  }
  if (!time) {
    showError("timeError", "Please select a travel time.");
    missingFields.push("Travel Time");
  }
  if (!climate) {
    showError("climateError", "Please select a climate preference.");
    missingFields.push("Climate");
  }
  
  if (missingFields.length > 0) {
    alert(`⚠️ Please fill the following field(s):\n• ${missingFields.join("\n• ")}`);
    return; // stop further logic
  }

  // All good, generate suggestion
  generateSuggestion(tripType, place, budget, time, climate, activity);
});

function generateSuggestion(tripVal, placeVal, budgetVal, timeVal, climateVal, activityVal) {
  let suggestion = "";

  if (tripVal === "Adventure" && climateVal === "Cold" && budgetVal !== "Luxury") {
    suggestion = "🥾 You might love trekking in Himachal Pradesh!";
  } else if (tripVal === "Relaxation" && climateVal === "Warm") {
    suggestion = "🏖️ Goa's beaches and chill vibes are perfect for relaxing!";
  } else if (tripVal === "Familyvacation" && budgetVal === "Midrange") {
    suggestion = "👨‍👩‍👧‍👦 Jaipur is a family-friendly destination filled with culture!";
  } else if (tripVal === "Business") {
    suggestion = "💼 Bengaluru or Mumbai would suit a business trip with comfort.";
  } else if (activityVal === "LocalCulture") {
    suggestion = "🎭 Try Varanasi or Udaipur for a rich cultural experience!";
  } else if (budgetVal === "Luxury" && climateVal === "Mild") {
    suggestion = "🚤 Enjoy a luxury houseboat stay in the backwaters of Kerala!";
  } else if (tripVal === "Adventure" && climateVal === "Warm") {
    suggestion = "🏜️ Try desert camping in Jaisalmer!";
  } else if (tripVal === "Relaxation" && climateVal === "Cold") {
    suggestion = "🧘‍♀️ Try a cozy hill retreat in Manali!";
  }

  if (!suggestion) {
    suggestion = "🌍 We couldn't find a specific match, but the world is full of surprises! Let us help you discover something unique.";
  }

  alert("🤖 TripSavvy Suggests:\n" + suggestion);
}
