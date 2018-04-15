// require("dotenv").config();
// const keys = require("./keys");

const omdbAPIkey = 'ee5d6008';

const request = require("request");

const movieTitle = "Nerve"

var reqURL = `http://www.omdbapi.com/?apikey=${omdbAPIkey}&t=${movieTitle}`
console.log(reqURL);



request(reqURL, function(error, response, body) {

  // If the request is successful (i.e. if the response status code is 200)
  if (!error && response.statusCode === 200) {

    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
    console.log(JSON.parse(body));
  }
});
