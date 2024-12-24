function displaySessions(sessions) {
    const container = document.getElementById("now-playing");
    container.innerHTML = ""; // Clear previous content
  
    // Sort sessions by FeatureStartTime
    sessions.sort((a, b) => new Date(a.FeatureStartTime) - new Date(b.FeatureStartTime));
  
    sessions.forEach((session) => {
      const sessionElement = document.createElement("div");
      sessionElement.className = "session";
  
      const formattedTime = new Date(session.FeatureStartTime).toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
  
      sessionElement.innerHTML = `
        <div class="session-content">
          <img class="poster" src="${getFilmPoster(session.FilmId)}" alt="${session.Title} Poster" />
          <div>
            <h2>${session.Title}</h2>
            <p>${formattedTime}</p>
          </div>
        </div>
      `;
  
      container.appendChild(sessionElement);
    });
  }
  
  // Helper function to get the film poster URL (replace with real mapping)
  function getFilmPoster(filmId) {
    const filmPosters = {
      "ST00000001": "https://example.com/poster1.jpg", // Replace with real poster URLs
      "ST00000002": "https://example.com/poster2.jpg",
    };
    return filmPosters[filmId] || "https://via.placeholder.com/150";
  }