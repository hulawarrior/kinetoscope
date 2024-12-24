const accessToken = "n06hg935gmg68bdv2526wkyjg4"; // Your Veezi access token
const apiUrl = "https://api.uswest.veezi.com/v4/film"; // The API endpoint

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

    films.forEach((film) => {
      const listItem = document.createElement("div");
      listItem.style.marginBottom = "20px";

      listItem.innerHTML = `
        <h3>${film.Title}</h3>
        <p><strong>Genre:</strong> ${film.Genre}</p>
        <p><strong>Synopsis:</strong> ${film.Synopsis}</p>
        <img src="${film.FilmPosterThumbnailUrl}" alt="${film.Title}" style="max-width: 200px; height: auto;">
        <hr>
      `;

      filmList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching films:", error);
    document.getElementById("filmList").innerText = `Error: ${error.message}`;
  }
}

// Fetch and display films on page load
document.addEventListener("DOMContentLoaded", fetchAndDisplayFilms);