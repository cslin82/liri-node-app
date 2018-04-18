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

function doTwitter(searchString) {
    client.get('statuses/user_timeline', { screen_name: searchString }, function (error, tweets, response) {
        console.log(JSON.stringify(tweets, null, 4));
    });
} // end doTwitter

function doSpotify(searchString) {
    spotify.search({ type: 'track', query: searchString }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        // console.log(JSON.stringify(data, null, 4));
        console.log(JSON.stringify(data.tracks.items[0], null, 4));

    });
} // end doSpotify

function doOMDB(searchString) {
    var reqURL = `http://www.omdbapi.com/?apikey=${omdbAPIkey}&t=${searchString}`
    console.log(reqURL);

    request(reqURL, function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            console.log(JSON.parse(body));
        }
    });

} // end doOMDB

const commandMap = {
    "my-tweets": {
        "handler": doTwitter,
        "default": "twitter"
        },
    "spotify-this-song": {
        "handler": doSpotify,
        "default": "The Sign"
    },
    "movie-this": {
        "handler": doOMDB,
        "default": "Mr. Nobody"
    }
}

console.log(Object.keys(commandMap));


// Get command-line arguments, if any

if (process.argv.length > 2) {
    var [, , ...myArgs] = process.argv;
    var argAction = myArgs.shift();
    myArgs = myArgs.join(' ');
    console.log(`action is ${argAction} and target is ${myArgs}`);

    if ( Object.keys(commandMap).indexOf(argAction) === -1 ) {
        return console.log("valid commands are " + Object.keys(commandMap).join(', '));
        
    }

    if (myArgs === '') { 
        console.log('no selection');
        myArgs = commandMap[argAction].default;
        console.log('now searching by default', myArgs);
    } 

    console.log(commandMap[argAction].handler(myArgs));

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
        console.log(commandMap[argAction].handler(myArgs));

    });
}



// doTwitter('theHill');
// doSpotify('The Sign');
// doOMDB('Wonder Woman');