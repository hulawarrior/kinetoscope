const apiKey = "n06hg935gmg68bdv2526wkyjg4"; // Replace with your actual API key
const apiUrl = "https://api.uswest.veezi.com/v4/film"; // Films endpoint

// Function to fetch films
async function fetchFilms() {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const films = await response.json();
    displayFilms(films);
  } catch (error) {
    console.error("Failed to fetch films:", error);
  }
}

// Function to display films
function displayFilms(films) {
  const filmList = document.getElementById("filmList");
  filmList.innerHTML = ""; // Clear existing content

  if (!films || films.length === 0) {
    filmList.innerHTML = "<li>No films available.</li>";
    return;
  }

  films.forEach((film) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <h3>${film.Title}</h3>
      <img src="${film.FilmPosterThumbnailUrl || ''}" alt="${film.Title}" style="width: 100px; height: auto;">
      <p><strong>Genre:</strong> ${film.Genre}</p>
      <p><strong>Synopsis:</strong> ${film.Synopsis}</p>
    `;
    filmList.appendChild(listItem);
  });
}

// Fetch and display films on page load
document.addEventListener("DOMContentLoaded", fetchFilms);