const express = require('express');
const data = require('./data/geo.json');
const app = express();
// const request = require('superagent');


app.get('/location', (request, respond) => {
    const cityData = data.results[0];

    respond.json({
        name: request.querey.name,
        formatted_query: cityData.formatted_address,
        latitude: cityData.geometry.location.lat,
        longitude: cityData.geometry.location.lng,
    });
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