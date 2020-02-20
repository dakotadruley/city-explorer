const { app } = require('./app.js');
const request = require('supertest');

describe('/location', () => {
    test('It should respond with an object of the correct shape',
        async(done) => {
            // feed our express app to the supertest request
            const response = await request(app)
                // and hit out express app's about route with a /GET
                .get('/location');
            // check to see if the response is what we expect
            expect(response.body).toEqual({
                formatted_query: expect.any(String),
                latitude: expect.any(String),
                longitude: expect.any(String),
            });
            
            expect(response.statusCode).toBe(200);
           
            done();
        });
});

describe('/weather', () => {
    test('It should respond with an object of the correct shape',
        async(done) => {
            
            const response = await request(app)
                .get('/weather');
            
            expect(response.body).toEqual({
                forecast: expect.any(String),
                time: expect.any(String),
            });
            
            expect(response.statusCode).toBe(200);
           
            done();
        });
});