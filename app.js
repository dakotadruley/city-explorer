const express = require('express');
const data = require('./data/geo.js');
const weather = require('./data/darksky.js');
const app = express();
const cors = require('cors');
// const request = require('superagent');

// cors is something that every app needs 
app.get(cors());
app.get('/', (reg, res) => { res.send('Hey there');});

// state
let lat;
let lng;

app.get('/location', (req, res) => {
    const location = req.query.search;
    // will use location with the api
    console.log(data);
    console.log('using location', location);
    const cityData = data.results[0];

    // where the state changes over time 
    lat = cityData.geometry.location.lat;
    lng = cityData.geometry.location.lng;

    res.json({
        formatted_query: cityData.formatted_address,
        latitude: cityData.geometry.location.lat,
        longitude: cityData.geometry.location.lng,
    });
});

const getWeatherData = (lat, lng) => {
    return weather.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            time: new Date(forecast.time * 1000),
        };
    });
};

app.get('/weather', (req, res) => {
    // use the lat and long from earlier to get weather data
    const portlandWeather = getWeatherData(lat, lng);

    res.json(portlandWeather);
});

app.get('*', (reg, res) => { res.json({ ohNo: '404', });});

module.exports = {
    app: app,
};
// needs to move out so that it won't break all tests
// app.listen(3000, () => { console.log
// ('running.....')});


// go to trello for the lab instructions. only 6. 

// https://trello.com/b/z7gfAN0M/city-explorer-api

// https://github.com/alchemycodelab/alchemy-bootcamp-ii-february-2019/tree/full-curriculum/curriculum/class-07/location-api/data

// https://github.com/dpcairns/first-node-project

// deploy:
// heroku login
// heroku create // will tell you the sick name of your app
// heroku git:remote -a name-of-app-in-heroku-sick-random-name
// git add .
// git commit -m 'initial commit'
// git push heroku master
// make sure your npm start script and npm test script work
// const port = process.env.PORT || 3000
// npm i supertest express jest

// location and weather

// Go to the lab instructions on GitHub and click on the front end 
// click on network in console 
// Instead of long and lat, we need query params (make an enpoint for location that can read query params) / don't need a : for queryparams 
// mySpecialResponse: request.query, + ?search=city
// once you type in portland, then it needs to find that lat and long
// compare the search querey with the hard coded data
// cityData.geometry.location.lng

// use moment instead of date