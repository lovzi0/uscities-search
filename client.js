const BASE_URL = "https://lovzi-uscities-microservices2-fwcke9cagvasb0a5.centralus-01.azurewebsites.net";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const responses = document.getElementById("responses");
const message = document.getElementById("message");

async function search() {
  const query = searchInput.value.trim();

  if (!query) {
    responses.innerHTML = "";
    message.textContent = "Please enter a city or ZIP code.";
    return;
  }

  try {
    message.textContent = "Searching...";

    const response = await fetch(
      `${BASE_URL}/uscities-search/${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();

    displaySearch(data);
    message.textContent = "";
  } catch (error) {
    console.error(error);
    responses.innerHTML = "";
    message.textContent = "Error: could not load results.";
  }
}

function displaySearch(data) {
  if (!Array.isArray(data) || data.length === 0) {
    responses.innerHTML = "<p>No cities found.</p>";
    return;
  }

  const rows = data.map(city => `
    <tr>
      <td>${DOMPurify.sanitize(city.city || "")}</td>
      <td>${DOMPurify.sanitize(city.state_name || "")}</td>
      <td>${DOMPurify.sanitize(city.zips || "")}</td>
    </tr>
  `).join("");

  responses.innerHTML = `
    <table>
      <tr>
        <th>City</th>
        <th>State</th>
        <th>ZIP Codes</th>
      </tr>
      ${rows}
    </table>
  `;
}

searchButton.addEventListener("click", search);

searchInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    search();
  }
});
