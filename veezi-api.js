const apiKey = "n06hg935gmg68bdv2526wkyjg4"; // Replace with your actual API key
const apiUrl = "https://api.uswest.veezi.com/v1/session"; // Showtimes endpoint

async function fetchShowtimes() {
    try {
        const response = await fetch(apiUrl, {
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
        displayShowtimes(showtimes);
    } catch (error) {
        console.error("Failed to fetch showtimes:", error);
        document.getElementById("showtimes-list").innerHTML = `<li>Error loading showtimes. Please try again later.</li>`;
    }
}

function displayShowtimes(showtimes) {
    const list = document.getElementById("showtimes-list");

    showtimes.forEach((session) => {
        const showtimeItem = document.createElement("li");

        // Format showtime details
        const filmTitle = `<strong>${session.Title}</strong>`;
        const startTime = new Date(session.FeatureStartTime).toLocaleString();
        const formattedShowtime = `<p>${filmTitle} - ${startTime}</p>`;

        showtimeItem.innerHTML = formattedShowtime;
        list.appendChild(showtimeItem);
    });
}

// Fetch showtimes on page load
fetchShowtimes();