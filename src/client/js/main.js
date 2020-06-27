const geoNamesURL = 'http://api.geonames.org/searchJSON?q=';
const username = 'bhargavadivs';
const weatherbitForecastURL = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=';
const weatherbitHistoryURL = 'https://api.weatherbit.io/v2.0/history/daily?lat=';
const weatherbitKey = '95220e73918540ada9c313f2516dc119';
const pixabayAPIURL = 'https://pixabay.com/api/?key=';
const pixabayAPIkey = '17232678-2dfed839b9a8fa9e06e37263e';

const addTripList = addTripButton.addEventListener('click', function (e) {
    e.preventDefault();
    planner.scrollIntoView({ behavior: 'smooth' });
})

form.addEventListener('submit', tripDetails);

// printButton.addEventListener('click', function (e) {
//     window.print();
//     location.reload();
// });

// deleteButton.addEventListener('click', function (e) {
//     form.reset();
//     result.classList.add("invisible");
//     location.reload();
// })

export function tripDetails(event) {
    event.preventDefault();
    const whereFrom = document.querySelector('input[name="from"]');
    const whereTo = document.querySelector('input[name="to"]');
    const journeyDate = document.querySelector('input[name="date"]');
    const timestamp = (new Date(journeyDate).getTime()) / 1000;

    //Validating w jest
    Client.checkInput(whereFrom, whereTo);

    getGeoInfo(geoNamesURL, whereTo, whereFrom)
        .then((toCityData) => {
            const toCityLat = toCityData.geonames[0].lat;
            const toCityLong = toCityData.geonames[0].lng;
            const toCityCountry = toCityData.geonames[0].countryName;
            const weatherData = getWeatherData(toCityLat, toCityLong, toCityCountry, timestamp)
            return weatherData;
        })
        .then((weatherData) => {
            const daysLeft = Math.round((timestamp - timestampNow) / 86400);
            const userData = postData('http://localhost:8081/voila', { whereFrom, whereTo, journeyDate, weather: weatherData['data'][0]['temp'], summary: weatherData['data']['0']['weather']['description'], daysLeft });
            return userData;
        }).then((userData) => {
            updateUI(userData);
        })
};

// export const getGeoInfo = async (geoNamesURL, whereTo, username) => {
//     const res = await fetch(geoNamesURL + goingToText + '&maxRows=10&' + 'username=' + username);
//     try {
//       const cityData = await res.json();
//       return cityData;
//     } catch (error) {
//       console.log("error", error);
//     }
// };

async function getGeoInfo(whereTo) {
    const response = await fetch(geoNamesURL + whereTo + '&maxRows=10&username=' + username);
    try {
        return await response.json();
    } catch (error) {
        console.log('error', error);
    }
}

async function getWeatherData(toCityLat, toCityLong, journeyDate) {

    const timestampTripDate = Math.floor(new Date(journeyDate).getTime() / 1000);
    const todayDate = new Date();
    const timestampToday = Math.floor(new Date(todayDate.getFullYear() + '-' + todayDate.getMonth() + '-' + todayDate.getDate()).getTime() / 1000);

    let response;
    // Check if the date is gone and call the appropriate endpoint.
    if (timestampTripDate < timestampToday) {
        let next_date = new Date(date);
        next_date.setDate(next_date.getDate() + 1);
        response = await fetch(weatherbitHistoryURL + toCityLat + '&lon=' + toCityLong + '&start_date=' + journeyDate + '&end_date=' + next_date + '&key=' + weatherbitKey);
    } else {
        response = await fetch(weatherbitForecastURL + toCityLat + '&lon=' + toCityLong + '&key=' + weatherbitKey);
    }
    try {
        return await response.json();
    } catch (error) {
        console.log('error', error)
    }
}

// Function postData to POST data to our local server
export const postData = async (url = '', data = {}) => {
    const req = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({
            depCity: data.whereFrom,
            arrCity: data.whereTo,
            depDate: data.journeyDate,
            weather: data.weather,
            summary: data.summary,
            daysLeft: data.daysLeft
        })
    })
    try {
        const userData = await req.json();
        return userData;
    } catch (error) {
        console.log("error", error);
    }
}

export const updateUI = async (userData) => {
    result.classList.remove("invisible");
    result.scrollIntoView({ behavior: "smooth" });

    const res = await fetch(pixabayAPIURL + pixabayAPIkey + "&q=" + userData.arrCity + "+city&image_type=photo");

    try {
        const imageLink = await res.json();
        const dateSplit = userData.depDate.split("-").reverse().join(" / ");
        document.querySelector("#city").innerHTML = userData.arrCity;
        document.querySelector("#date").innerHTML = dateSplit;
        document.querySelector("#days").innerHTML = userData.daysLeft;
        document.querySelector("#summary").innerHTML = userData.summary;
        document.querySelector("#temp").innerHTML = userData.weather;
        document.querySelector("#fromPixabay").setAttribute('src', imageLink.hits[0].webformatURL);
    }
    catch (error) {
        console.log("error", error);
    }
}

export { addTripList }