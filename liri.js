require("dotenv").config();
const keys = require("./keys");

// parts for spotify
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);



// parts for OMDB
const omdbAPIkey = 'ee5d6008';
const request = require("request");

// parts for twitter
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

// fs
const fs = require("fs");

// Get command-line arguments, if any

if (process.argv.length > 2) {
    var [, , ...myArgs] = process.argv;
    var argAction = myArgs.shift();
    myArgs = myArgs.join(' ');
    console.log(`action is ${argAction} and target is ${myArgs}`);
} else {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // We will then print the contents of data
        console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        console.log(dataArr);
        [argAction, myArgs] = dataArr;
        console.log(`action is ${argAction} and target is ${myArgs}`);

    });
}

function doTwitter() {
    client.get('search/tweets', { q: '@thehill' }, function (error, tweets, response) {
        console.log(tweets);
    });
} // end doTwitter

function doSpotify(searchString) {
    spotify.search({ type: 'track', query: searchString }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log(data);
    });
} // end doSpotify

function doOMDB(searchString) {
    var reqURL = `http://www.omdbapi.com/?apikey=${omdbAPIkey}&t=${searchString}`
    console.log(reqURL);

    request(reqURL, function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log(JSON.parse(body));
        }
    });

} // end doOMDB

// doTwitter();
// doSpotify('Delicate');
// doOMDB('Wonder Woman');