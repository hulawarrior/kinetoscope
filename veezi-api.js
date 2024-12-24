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

        let showtimes = await response.json();

        // Sort the showtimes by playtime (soonest first)
        showtimes.sort((a, b) => new Date(a.FeatureStartTime) - new Date(b.FeatureStartTime));

        // Display sorted showtimes
        displayShowtimes(showtimes);
    } catch (error) {
        console.error("Failed to fetch showtimes:", error);
        document.getElementById("showtimes-list").innerHTML = `<li>Error loading showtimes. Please try again later.</li>`;
    }
}