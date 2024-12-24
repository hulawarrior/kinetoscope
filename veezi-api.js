const apiKey = "n06hg935gmg68bdv2526wkyjg4"; // Replace with your actual API key
const sessionApiUrl = "https://api.uswest.veezi.com/v1/session"; // Showtimes endpoint
const filmApiUrl = "https://api.uswest.veezi.com/v4/film"; // Films endpoint

async function fetchFilms() {
    try {
        const response = await fetch(filmApiUrl, {
            method: "GET",
            headers: {
                "VeeziAccessToken": apiKey,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const films = await response.json();
        return films.reduce((map, film) => {
            map[film.Id] = film; // Create a mapping of FilmId to film data
            return map;
        }, {});
    } catch (error) {
        console.error("Failed to fetch films:", error);
        return {};
    }
}

async function fetchShowtimes() {
    try {
        const filmsMap = await fetchFilms();

        const response = await fetch(sessionApiUrl, {
            method: "GET",
            headers: {
                "VeeziAccessToken": apiKey,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const showtimes = await response.json();

        // Sort the showtimes by PreShowStartTime
        const sortedShowtimes = showtimes.sort(
            (a, b) => new Date(a.PreShowStartTime) - new Date(b.PreShowStartTime)
        );

        displayShowtimes(sortedShowtimes, filmsMap);
    } catch (error) {
        console.error("Failed to fetch showtimes:", error);
        document.getElementById("showtimes-list").innerHTML =
            "<li>Error loading showtimes. Please try again later.</li>";
    }
}

function formatTime(dateString) {
    const options = { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true // Use 12-hour format (change to false for 24-hour format)
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
}

function displayShowtimes(showtimes, filmsMap) {
    const list = document.getElementById("showtimes-list");
    list.innerHTML = ""; // Clear existing items

    showtimes.forEach((session) => {
        const showtimeItem = document.createElement("li");

        // Get film details
        const film = filmsMap[session.FilmId];
        const posterUrl = film?.FilmPosterThumbnailUrl || "https://via.placeholder.com/100x150?text=Poster";
        const filmTitle = `<strong>${session.Title}</strong>`;
        const startTime = formatTime(session.PreShowStartTime); // Use PreShowStartTime and formatted time

        // Format showtime details with poster
        const formattedShowtime = `
            <div>
                <img src="${posterUrl}" alt="${session.Title} poster" style="width:100px;height:auto;">
                <p>${filmTitle} - ${startTime}</p>
            </div>
        `;

        showtimeItem.innerHTML = formattedShowtime;
        list.appendChild(showtimeItem);
    });
}

// Fetch showtimes on page load
fetchShowtimes();