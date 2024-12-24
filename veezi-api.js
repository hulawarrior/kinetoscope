const accessToken = "n06hg935gmg68bdv2526wkyjg4"; // Your Veezi access token
const apiUrl = "https://api.uswest.veezi.com/v4/film"; // API endpoint

async function fetchAndDisplayFilms() {
  try {
    console.log("Fetching films from Veezi API...");
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "VeeziAccessToken": accessToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const films = await response.json(); // Parse JSON response
    console.log("Films retrieved:", films);

    const filmList = document.getElementById("filmList");
    filmList.innerHTML = ""; // Clear any previous content

    // Loop through each film and format its display
    films.forEach((film) => {
      const filmItem = document.createElement("div");
      filmItem.style.border = "1px solid #ccc";
      filmItem.style.margin = "20px";
      filmItem.style.padding = "10px";
      filmItem.style.borderRadius = "5px";
      filmItem.style.backgroundColor = "#f9f9f9";

      // Add content to the film item
      filmItem.innerHTML = `
        <h2 style="color: #333;">${film.Title}</h2>
        <img src="${film.FilmPosterThumbnailUrl}" alt="${film.Title}" style="width: 150px; height: auto; float: left; margin-right: 15px;">
        <p><strong>Genre:</strong> ${film.Genre || "Unknown"}</p>
        <p><strong>Synopsis:</strong> ${film.Synopsis || "No synopsis available."}</p>
        <p><strong>Duration:</strong> ${film.Duration || "N/A"} minutes</p>
        <p><strong>Rating:</strong> ${film.Rating || "Unrated"}</p>
        <p><strong>Distributor:</strong> ${film.Distributor || "Unknown"}</p>
        <div style="clear: both;"></div>
      `;

      filmList.appendChild(filmItem);
    });
  } catch (error) {
    console.error("Error fetching films:", error);
    document.getElementById("filmList").textContent = `Error: ${error.message}`;
  }
}

// Fetch and display films on page load
document.addEventListener("DOMContentLoaded", fetchAndDisplayFilms);