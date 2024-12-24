const apiKey = "n06hg935gmg68bdv2526wkyjg4"; // Your Veezi API key
const apiUrl = "https://api.uswest.veezi.com/v4/film"; // Simplest endpoint

async function testVeeziConnection() {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`, // Only essential header
      },
    });

    console.log("Response status:", response.status); // Log status code
    const data = await response.json(); // Parse the response as JSON
    console.log("Response data:", data); // Log the data
    document.getElementById("testResult").textContent = `Success: ${JSON.stringify(data)}`;
  } catch (error) {
    console.error("Failed to connect to Veezi API:", error);
    document.getElementById("testResult").textContent = `Error: ${error.message}`;
  }
}

// Run the test when the page loads
document.addEventListener("DOMContentLoaded", testVeeziConnection);