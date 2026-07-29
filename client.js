const BASE_URL = "https://lovzi-uscities-microservices2-fwcke9cagvasb0a5.centralus-01.azurewebsites.net";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const responses = document.getElementById("responses");
const message = document.getElementById("message");

let debounceTimer;
let inputVersion = 0;

async function search(query = searchInput.value.trim(), version = ++inputVersion) {
  if (!query) {
    responses.innerHTML = "";
    message.textContent = "Please enter a city or ZIP code.";
    return;
  }

  console.log(`Debug>query: ${query}`);

  try {
    message.textContent = "Searching...";

    const response = await fetch(
      `${BASE_URL}/uscities-search/${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();

    // Ignore results from an older search
    if (version !== inputVersion) return;

    displaySearch(data);
    message.textContent = "";

  } catch (error) {
    if (version !== inputVersion) return;

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

searchButton.addEventListener("click", function() {
  clearTimeout(debounceTimer);
  search();
});

searchInput.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    clearTimeout(debounceTimer);
    search();
    return;
  }

  clearTimeout(debounceTimer);

  inputVersion++;
  const version = inputVersion;
  const query = searchInput.value.trim();

  if (query.length < 2) {
    responses.innerHTML = "";
    message.textContent =
      query.length === 0 ? "" : "Type at least 2 characters.";
    return;
  }

  debounceTimer = setTimeout(function() {
    search(query, version);
  }, 300);
});
