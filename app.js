require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const request = require('superagent');

// cors is something that every app needs 
// cors is a good example of middleware / it's an opportunity to add things to the request object
app.use(cors());
app.get('/', (req, res) => { res.send('Hey there');});

// state
let lat;
let lon;

app.get('/location', async(req, res, next) => {
    try {

        const location = req.query.search;
    // will use location with the api
    // TODO: HIDE KEY
        const URL = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${location}&format=json`;

        const cityData = await request.get(URL);
        const firstResult = cityData.body[0];
    // where the state changes over time 
        lat = firstResult.lat;
        lon = firstResult.lon;

        res.json({
            formatted_query: firstResult.display_name,
            latitude: lat,
            longitude: lon,
        });
    } catch (err) {
        next(err);
    }
});

const getWeatherData = async(lat, lon) => {
    const weather = await request.get(`https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${lat},${lon}`);
    
    return weather.body.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            time: new Date(forecast.time * 1000),
        };
    });
};

// latitude = 45.5234211;
// longitude = -122.6809008;

app.get('/weather', async(req, res, next) => {
    try { // use the lat and long from earlier to get weather data

        const skyWeather = await getWeatherData(lat, lon);

        res.json(skyWeather);

    } catch (err) {
        next(err);
    }
});

app.get('/yelp', async(req, res, next) => {
    try {
        const yelpStuff = await request
            .get(`https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${lat}&longitude=${lon}`)
            .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`);

        const restaurant = yelpStuff.body.businesses.map(business => {
            return {
                name: business.name,
                image_url: business.image_url,
                price: business.price,
                rating: business.rating,
                url: business.url,
            };
        });   

        res.json(restaurant);

    } catch (err) {
        next(err);
    }
});

app.get('/events', async(req, res, next) => {
    try { // use the lat and long from earlier to get event data

        const URL = (`http://api.eventful.com/json/events/search?app_key=${process.env.EVENTFUL_API_KEY}&where=${lat},${lon}&within=25&page_size=20&page_number=1`);
        const data = await request.get(URL);
        //where's the body...?
        //console.log(data) 
        //JSON.parse(data.text) instead of data.body
        const eventfulStuff = JSON.parse(data.text);

        const events = eventfulStuff.events.event.map(event => {
            return {
                link: event.url,
                name: event.title,
                // play around with the date to get better format
                event_date: event.start_time,
                summary: event.description === null ? 'N/A' : event.description,
            };
        });   

        res.json(events);

    } catch (err) {
        next(err);
    }
});

app.get('/trails', async(req, res, next) => {
    try {

        const URL = (`https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=${process.env.TRAILS_API_KEY}`);

        const trailData = await request.get(URL);
        
        const trailStuff = trailData.body.trails.map(trails => {
            return {
                name: trails.name,
                location: trails.location,
                length: trails['length'],
                stars: trails.stars,
                star_votes: trails.starVotes,
                summary: trails.summary,
                trail_url: trails.url,
                conditions: trails.conditionStatus,
                condition_date_time: trails.conditionDate,
            };
        });

        res.json({ trailStuff });

    } catch (err) {
        next(err);
    }
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