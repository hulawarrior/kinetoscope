const filmsApiUrl = "https://api.uswest.veezi.com/v4/film";
const sessionsApiUrl = "https://api.uswest.veezi.com/v1/session";
const accessToken = "your-access-token";

async function fetchData() {
  const filmResponse = await fetch(filmsApiUrl, {
    headers: { "VeeziAccessToken": accessToken },
  });
  const sessionResponse = await fetch(sessionsApiUrl, {
    headers: { "VeeziAccessToken": accessToken },
  });

  if (!filmResponse.ok || !sessionResponse.ok) {
    throw new Error("Failed to load data");
  }

  const films = await filmResponse.json();
  const sessions = await sessionResponse.json();

  return { films, sessions };
}

function renderFilms(films, sessions) {
  const filmList = document.getElementById("film-list");
  filmList.innerHTML = "";

  // Match sessions with films
  films.forEach((film) => {
    const filmSessions = sessions.filter(
      (session) =>
        session.FilmId === film.Id && new Date(session.FeatureStartTime) > new Date()
    );

    if (filmSessions.length > 0) {
      // Create a card for each session
      filmSessions.forEach((session) => {
        const filmCard = document.createElement("div");
        filmCard.className = "film-card";
        const sessionDate = new Date(session.FeatureStartTime);
        const dateString = sessionDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        const timeString = session.TicketsSoldOut
          ? "Sold Out"
          : sessionDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            });

        filmCard.innerHTML = `
          <img src="${film.FilmPosterUrl}" alt="${film.Title} Poster" />
          <div class="film-info">
            <h2>${film.Title}</h2>
            <p>${dateString}</p>
            <span class="showtime">${timeString}</span>
          </div>
        `;

        filmList.appendChild(filmCard);
      });
    }
  });
}

async function init() {
  try {
    const { films, sessions } = await fetchData();
    renderFilms(films, sessions);
  } catch (error) {
    console.error(error);
    document.getElementById("film-list").innerHTML =
      "<p>Error loading films. Please try again later.</p>";
  }
}

init();