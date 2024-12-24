const accessToken = "n06hg935gmg68bdv2526wkyjg4"; // Replace with your Veezi Access Token
const apiUrl = "https://api.uswest.veezi.com/v4/film"; // Replace with the correct API endpoint

async function testVeeziConnection() {
  try {
    console.log("Sending request to Veezi API...");
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "VeeziAccessToken": accessToken, // Correct authentication header
        "Content-Type": "application/json", // Specify JSON as the data format
      },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      // Capture the full response in case of an error
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${response.statusText}. Response: ${errorText}`);
    }

    const data = await response.json(); // Parse the response as JSON
    console.log("Response data:", data);
    document.getElementById("testResult").textContent = `Success: ${JSON.stringify(data)}`;
  } catch (error) {
    console.error("Failed to connect to Veezi API:", error);
    document.getElementById("testResult").textContent = `Error: ${error.message}`;
  }
}

// Trigger the API call when the page loads
document.addEventListener("DOMContentLoaded", testVeeziConnection);