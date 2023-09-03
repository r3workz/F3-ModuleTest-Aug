const currentImageContainer = document.getElementById('current-image-container')
const searchFormContainer = document.getElementById('search-form-container')
const searchHistoryContainer = document.getElementById('search-history-container')
const searchHistoryUl = document.getElementById('search-history')

// const API_KEY = "HPF2qmeIhUpKLt6W3ReBnO0Pe1oDty";
const API_KEY = "bDTBPF53scHPF2qmeIhUpKLt6W3ReBnO0Pe1oDty";
const headMain = document.getElementById('heading-text')
const podImage = document.getElementById('pod-image')
const podTitle = document.getElementById('pod-title')
const podDescription = document.getElementById('pod-description')
const inputDate = document.getElementById('search-input')
const searchForm = document.getElementById('search-form')

let searchHistory = []


// Set Image, Title, etc
function setContents(apodResponse){
    podImage.src = apodResponse.url
    headMain.textContent = `Picture on ${apodResponse.date}`
    podImage.alt= `NASA Picture of the Day ${apodResponse.date}`
    podTitle.textContent = apodResponse.title
    podDescription.textContent = apodResponse.explanation
}

async function getCurrentImageOfTheDay(){
    const currentImageOfTheDayUrl = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`
    try {
        const response = await fetch(currentImageOfTheDayUrl)
        const apodResponse = await response.json()

        setContents(apodResponse)
      } catch (error) {
        console.log(error)
      }
}

async function getImageOfTheDay(date){
    // TODO date validate. // this is extra basic requirements are dont btw
    // const today = new Date()
    // console.log(Date(date))

    // if (Date(date) < today){
    //     alert("The date you entered is in future.")
    // } else {
        const currentImageOfTheDayUrl = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${API_KEY}`

        try {
            const response = await fetch(currentImageOfTheDayUrl)
            const apodResponse = await response.json()

            setContents(apodResponse)
            saveSearch()
        } catch (error) {
            console.log(error)
        }
    // }
}

function saveSearch(){
    // Save input date to local storage
    searchHistory.push(inputDate.value)
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
    addSearchToHistory()
}

// Read store data and push to array
function fetchStoredData(){
    searchHistory = []
    // Save input date to local storage
    const data = JSON.parse(localStorage.getItem('searchHistory'))
    if(data==null){
        return
    }
    searchHistory = data
    console.log(searchHistory);
    addSearchToHistory()
}

function addSearchToHistory(){
    searchHistoryUl.innerHTML = ''
    searchHistory.forEach(search => {
        const li = document.createElement('li')
        li.textContent = search
        searchHistoryUl.appendChild(li)
    })

}

// Check is Local Storage is available and enabled
function testLS() {
    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem('ls_test', 'yes');
            if (localStorage.getItem('ls_test') === 'yes') {
                localStorage.removeItem('ls_test');
                console.log('localStorage is good to go!');
            } else {
                console.log('localStorage is not good to go! enable it.');
            }
        } catch(e) {
            alert(`Local Storage is probably Disabled. History wont be saved. Please enable it. ${e}`);
        }
    } else {
        alert(`Local Storage is unavailable. History wont be saved. Use a different(latest) browser.`);
    }
}

document.addEventListener("DOMContentLoaded",()=>{
    testLS()
    fetchStoredData()
    getCurrentImageOfTheDay()

    
})

searchForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    getImageOfTheDay(inputDate.value)
})


searchHistoryUl.addEventListener('click', event => {
    const li = event.target
    getImageOfTheDay(li.textContent)
})