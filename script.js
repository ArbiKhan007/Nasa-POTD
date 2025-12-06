const apiKey = "PnFsAhbrhGLmDXgHXcpmBuhYKY8kYgAeI0IpkVaI";
const currentImageContainer = document.getElementById(
  "current-image-container"
);
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchHistoryList = document.getElementById("search-history");

// -------- Load Current Image on Page Start -------- //
window.onload = () => {
  getCurrentImageOfTheDay();
  addSearchToHistory();
};

// -------- Fetch Today's NASA Image -------- //
async function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  await fetchImage(currentDate);
}

// -------- Fetch Image for Form Input -------- //
async function getImageOfTheDay(date) {
  await fetchImage(date);
  saveSearch(date);
  addSearchToHistory();
}

// -------- Core Fetch Function -------- //
async function fetchImage(date) {
  try {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Could not fetch data");
    }

    const data = await res.json();
    displayImage(data);
  } catch (err) {
    currentImageContainer.innerHTML = `<p>Error fetching NASA data. Try another date.</p>`;
  }
}

// -------- Display Data in UI -------- //
function displayImage(data) {
  currentImageContainer.innerHTML = `
        <h2>${data.title}</h2>
        ${
          data.media_type === "image"
            ? `<img src="${data.url}" alt="${data.title}" />`
            : `<iframe width="100%" height="400" src="${data.url}"></iframe>`
        }
        <p><strong>Date:</strong> ${data.date}</p>
        <p>${data.explanation}</p>
    `;
}

// -------- Save Search to Local Storage -------- //
function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];

  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
  }
}

// -------- Load and Display Search History -------- //
function addSearchToHistory() {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  searchHistoryList.innerHTML = "";

  searches.forEach((date) => {
    const li = document.createElement("li");
    li.textContent = date;
    li.addEventListener("click", () => fetchImage(date));
    searchHistoryList.appendChild(li);
  });
}

// -------- Handle Form Submit -------- //
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const selectedDate = searchInput.value;

  if (selectedDate) {
    getImageOfTheDay(selectedDate);
  }
});
