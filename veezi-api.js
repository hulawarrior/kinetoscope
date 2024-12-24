// Your API key from Veezi
const apiKey = "n06hg935gmg68bdv2526wkyjg4";

// Veezi API endpoint for showtimes (replace with the actual endpoint)
const apiUrl = "https://api.uswest.veezi.com/showtimes";

async function fetchShowtimes() {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`, // Add the API key here
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    displayShowtimes(data); // Call a function to display the fetched data
  } catch (error) {
    console.error("Failed to fetch showtimes:", error);
  }
}

function displayShowtimes(showtimes) {
  const showtimesList = document.getElementById("showtimesList");
  showtimesList.innerHTML = ""; // Clear any existing data

  if (!showtimes || showtimes.length === 0) {
    showtimesList.innerHTML = "<li>No showtimes available.</li>";
    return;
  }

  showtimes.forEach((showtime) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${showtime.movieTitle} - ${showtime.showDateTime}`;
    showtimesList.appendChild(listItem);
  });
}

// Fetch showtimes when the page loads
document.addEventListener("DOMContentLoaded", fetchShowtimes);