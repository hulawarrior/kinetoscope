const apiKey = "your-veezi-access-token"; // Replace with your Veezi API token
const apiUrlSessions = "https://api.uswest.veezi.com/v1/session"; // Veezi sessions endpoint
const apiUrlFilms = "https://api.uswest.veezi.com/v4/film"; // Veezi films endpoint

async function fetchUpcomingShowtimes() {
    try {
        // Fetch all sessions
        const response = await fetch(apiUrlSessions, {
            method: "GET",
            headers: {
                "VeeziAccessToken": apiKey,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch sessions: ${response.statusText}`);
        }

        let sessions = await response.json();

        // Filter sessions with valid CleanupEndTime
        const now = new Date();
        sessions = sessions.filter(session => new Date(session.CleanupEndTime) > now);

        // Sort sessions by FeatureStartTime
        sessions.sort((a, b) => new Date(a.FeatureStartTime) - new Date(b.FeatureStartTime));

        // Fetch film details and render showtimes
        const filmsResponse = await fetch(apiUrlFilms, {
            method: "GET",
            headers: {
                "VeeziAccessToken": apiKey,
                "Content-Type": "application/json",
            },
        });

        if (!filmsResponse.ok) {
            throw new Error(`Failed to fetch films: ${filmsResponse.statusText}`);
        }

        const films = await filmsResponse.json();
        const filmsMap = new Map(films.map(film => [film.Id, film]));

        renderShowtimes(sessions, filmsMap);
    } catch (error) {
        console.error(error);
        document.getElementById("showtimes").innerHTML = `<p>Error loading showtimes. Please try again later.</p>`;
    }
}

function renderShowtimes(sessions, filmsMap) {
    const showtimesContainer = document.getElementById("showtimes");
    showtimesContainer.innerHTML = ""; // Clear previous content

    sessions.forEach(session => {
        const film = filmsMap.get(session.FilmId);

        // Create showtime item
        const showtimeItem = document.createElement("div");
        showtimeItem.classList.add("showtime");

        // Add film poster
        if (film?.FilmPosterThumbnailUrl) {
            const poster = document.createElement("img");
            poster.src = film.FilmPosterThumbnailUrl;
            poster.alt = film.Title;
            poster.classList.add("poster");
            showtimeItem.appendChild(poster);
        }

        // Add film details
        const details = document.createElement("div");
        details.classList.add("details");

        const title = document.createElement("h3");
        title.textContent = film?.Title || "Unknown Title";
        details.appendChild(title);

        const time = document.createElement("p");
        time.textContent = new Date(session.FeatureStartTime).toLocaleString();
        details.appendChild(time);

        showtimeItem.appendChild(details);
        showtimesContainer.appendChild(showtimeItem);
    });
}

// Initialize fetch
fetchUpcomingShowtimes();