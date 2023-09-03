const currentImageContainer = document.getElementById(
    "current-image-container"
);
const searchFormContainer = document.getElementById("search-form-container");
const searchHistoryContainer = document.getElementById(
    "search-history-container"
);

const API_KEY = "AoiDjPvRItjNdz6C3Ta0hVr8NEBwq94mIBc5CDwZ";
const headMain = document.getElementById("heading-text");
const podImage = document.getElementById("pod-image");
const podTitle = document.getElementById("pod-title");
const podDescription = document.getElementById("pod-description");
const inputDate = document.getElementById("search-input");
const searchHistoryUl = document.getElementById("search-history");
const searchForm = document.getElementById("search-form");

var coll = document.getElementsByClassName("collapsible");

let searchHistory = [];

// Set Image, Title, etc
function setContents(apodResponse) {
    podImage.src = apodResponse.url;
    podImage.classList.remove("loading");
    headMain.textContent = `Picture on ${apodResponse.date}`;
    podImage.alt = `NASA Picture of the Day ${apodResponse.date}`;
    podTitle.textContent = apodResponse.title;
    podDescription.textContent = apodResponse.explanation;
}

function startLoader() {
    podImage.src = "";
    podImage.alt = "";
    podImage.classList.add("loading");
}

async function getCurrentImageOfTheDay() {
    const currentImageOfTheDayUrl = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
    startLoader();
    try {
        const response = await fetch(currentImageOfTheDayUrl);
        const apodResponse = await response.json();

        setContents(apodResponse);
    } catch (error) {
        console.log(error);
    }
}

async function getImageOfTheDay(date) {
    const today = new Date();
    const dateFormatted = new Date(date);

    if (date == "") {
        alert("Kindly prodive a date to fetch the Picture of that Day.");
    } else if (dateFormatted > today) {
        alert(
            "Its in future. Kindly choose a date in past. If you chose Today's date its already available or not yet available."
        );
    } else {
        startLoader();
        const currentImageOfTheDayUrl = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${API_KEY}`;

        try {
            const response = await fetch(currentImageOfTheDayUrl);
            const apodResponse = await response.json();
            console.log(apodResponse);
            setContents(apodResponse);
            saveSearch();
        } catch (error) {
            console.log(error);
        }
    }
}

function saveSearch() {
    // Save input date to local storage
    searchHistory.push(inputDate.value);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    addSearchToHistory();
}

// Read store data and push to array
function fetchStoredData() {
    searchHistory = [];
    // Save input date to local storage
    const data = JSON.parse(localStorage.getItem("searchHistory"));
    if (data == null) {
        return;
    }
    searchHistory = data;
    console.log(searchHistory);
    addSearchToHistory();
}

function addSearchToHistory() {
    searchHistoryUl.innerHTML = "";
    searchHistory.forEach((search) => {
        const li = document.createElement("li");
        li.textContent = search;
        searchHistoryUl.appendChild(li);
    });
}

// Check if Local Storage is available and enabled
function testLS() {
    if (typeof localStorage !== "undefined") {
        try {
            localStorage.setItem("ls_test", "yes");
            if (localStorage.getItem("ls_test") === "yes") {
                localStorage.removeItem("ls_test");
                console.log("localStorage is good to go!");
            } else {
                console.log("localStorage is not good to go! enable it.");
            }
        } catch (e) {
            alert(
                `Local Storage is probably Disabled. History wont be saved. Please enable it. ${e}`
            );
        }
    } else {
        alert(
            `Local Storage is unavailable. History wont be saved. Use a different(latest) browser.`
        );
    }
}

document.addEventListener("DOMContentLoaded", () => {
    testLS();
    fetchStoredData();
    getCurrentImageOfTheDay();

    // Floating Menu
    for (let colCounter = 0; colCounter < coll.length; colCounter++) {
        coll[colCounter].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }
});

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    getImageOfTheDay(inputDate.value);
});

searchHistoryUl.addEventListener("click", (event) => {
    const li = event.target;
    getImageOfTheDay(li.textContent);
});
