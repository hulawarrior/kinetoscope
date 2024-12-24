const apiKey = "YOUR_API_KEY"; // Replace with your Veezi API key
const sessionsUrl = "https://api.uswest.veezi.com/v1/session";
const filmsUrl = "https://api.uswest.veezi.com/v4/film";

// Fetch Films and Sessions
async function fetchNowShowing() {
  try {
    // Fetch sessions
    const sessionsResponse = await fetch(sessionsUrl, {
      headers: { VeeziAccessToken: apiKey },
    });
    const sessions = await sessionsResponse.json();

    // Filter sessions with upcoming FeatureStartTime
    const upcomingSessions = sessions.filter((session) => {
      const featureStartTime = new Date(session.FeatureStartTime);
      return featureStartTime > new Date();
    });

    // Fetch films
    const filmsResponse = await fetch(filmsUrl, {
      headers: { VeeziAccessToken: apiKey },
    });
    const films = await filmsResponse.json();

    // Match films to sessions
    const filmsWithShowtimes = upcomingSessions.map((session) => {
      const film = films.find((film) => film.Id === session.FilmId);
      return {
        ...film,
        FeatureStartTime: session.FeatureStartTime,
        FilmFormat: session.FilmFormat,
      };
    });

    displayFilms(filmsWithShowtimes);
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("filmList").innerHTML =
      "<p>Error loading films. Please try again later.</p>";
  }
}

// Display Films
function displayFilms(films) {
  const filmList = document.getElementById("filmList");
  filmList.innerHTML = ""; // Clear existing content

  films.forEach((film) => {
    const filmItem = document.createElement("div");
    filmItem.className = "filmItem";

    filmItem.innerHTML = `
      <img src="${film.FilmPosterUrl || 'default-poster.png'}" alt="${film.Title}" />
      <div class="filmDetails">
        <h2>${film.Title}</h2>
        <p>Genre: ${film.Genre}</p>
        <p class="showtime">Showtime: ${new Date(film.FeatureStartTime).toLocaleString()}</p>
        <p>Format: ${film.FilmFormat}</p>
      </div>
    `;

    filmList.appendChild(filmItem);
  });
}

// Initialize
fetchNowShowing();