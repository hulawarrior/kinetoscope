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

// Fetch details of a single film using its ID
async function fetchFilmDetails(filmId) {
    try {
        const film = await fetchData(`${filmApiUrl}/${filmId}`, { "VeeziAccessToken": apiKey });
        return film;
    } catch (error) {
        console.error("Error fetching film details:", error.message);
        throw error;
    }
}

const itemHtml = `
    <li class="showtime-item">
        <a onclick="playTrailer('${film.Id}')">
            <img class="poster" src="${posterUrl}" alt="${film.Title}">
        </a>
        <div class="showtime-text">
            <p>
                <a onclick="playTrailer('${film.Id}')" class="movie-title-link">${film.Title}</a>
            </p>
            <p>${date}</p>
            <div class="showtimes-horizontal">${timesHtml}</div>
        </div>
    </li>
`;

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