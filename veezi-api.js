const apiKey = "n06hg935gmg68bdv2526wkyjg4"; // Replace with your actual API key
const sessionApiUrl = "https://api.uswest.veezi.com/v1/session";
const filmApiUrl = "https://api.uswest.veezi.com/v4/film";

// Utility function to format a date string into "Thu Dec. 26" format
function formatDate(dateString) {
    const date = new Date(dateString);

    // Extract parts of the date
    const weekday = date.toLocaleDateString(undefined, { weekday: "short" });
    const month = date.toLocaleDateString(undefined, { month: "short" });
    const day = date.toLocaleDateString(undefined, { day: "2-digit" });

    // Add a period only after the month
    return `${weekday} ${month}. ${day}`;
}

// Utility function to format a time string into a 12-hour clock with lowercase am/pm
function formatTime(dateString) {
    const date = new Date(dateString);
    return date
        .toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })
        .toLowerCase(); // Convert AM/PM to am/pm
}

async function fetchData(url, headers) {
    try {
        const response = await fetch(url, { method: "GET", headers });
        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        console.log(`Data from ${url}:`, data); // Log the data
        return data;
    } catch (error) {
        console.error("Fetch data error:", error.message);
        throw error;
    }
}

function renderShowtimes(showtimes, films) {
    const list = document.getElementById("showtimes-list");
    list.innerHTML = ""; // Clear old items

    if (!showtimes.length) {
        list.innerHTML = "<li>No showtimes available.</li>";
        return;
    }

    // Get the current time
    const now = new Date();

    // Filter out showtimes that have already passed
    const upcomingShowtimes = showtimes.filter(showtime => {
        const showtimeDate = new Date(showtime.PreShowStartTime);
        return showtimeDate >= now; // Keep only upcoming showtimes
    });

    if (!upcomingShowtimes.length) {
        list.innerHTML = "<li>No upcoming showtimes available.</li>";
        return;
    }

    // Sort the remaining showtimes by PreShowStartTime
    const sortedShowtimes = upcomingShowtimes.sort((a, b) => {
        const dateA = new Date(a.PreShowStartTime);
        const dateB = new Date(b.PreShowStartTime);
        return dateA - dateB; // Ascending order
    });

    sortedShowtimes.forEach(showtime => {
        const film = films[showtime.FilmId];
        // Use FilmPosterUrl for high resolution; fallback to FilmPosterThumbnailUrl
        const posterUrl = film?.FilmPosterUrl || film?.FilmPosterThumbnailUrl || "https://via.placeholder.com/300x400?text=Poster+Not+Available";

        const itemHtml = `
            <li class="showtime-item">
                <!-- Poster with link to movie details -->
                <a href="movie.html?filmId=${showtime.FilmId}">
                    <img class="poster" src="${posterUrl}" alt="${film?.Title || 'Poster Not Available'}">
                </a>
                <div class="showtime-text">
                    <!-- Title with link to movie details -->
                    <p>
                        <a href="movie.html?filmId=${showtime.FilmId}" class="movie-title-link">
                            ${film?.Title || "Unknown Title"}
                        </a>
                    </p>
                    <p>${formatDate(showtime.PreShowStartTime)}</p> <!-- Date -->
                    <p>
                        <a href="purchase.html?sessionId=${showtime.Id}" class="time-link">${formatTime(showtime.PreShowStartTime)}</a>
                    </p>
                </div>
            </li>
        `;
        list.insertAdjacentHTML('beforeend', itemHtml);
    });
}

async function init() {
    try {
        const films = await fetchData(filmApiUrl, { "VeeziAccessToken": apiKey });
        const filmsMap = films.reduce((map, film) => {
            map[film.Id] = film;
            return map;
        }, {});

        const showtimes = await fetchData(sessionApiUrl, { "VeeziAccessToken": apiKey });
        renderShowtimes(showtimes, filmsMap);
    } catch (error) {
        console.error("Failed to fetch data:", error.message);
        document.getElementById("showtimes-list").innerHTML =
            "<li style='color: red;'>Error loading showtimes. Please try again later.</li>";
    }
}

document.addEventListener("DOMContentLoaded", init);