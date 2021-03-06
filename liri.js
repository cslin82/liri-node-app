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

// moment
var moment = require('moment');

function doTwitter(searchString) {
    client.get('statuses/user_timeline', { screen_name: searchString }, function (error, tweets, response) {
        // console.log(JSON.stringify(tweets, null, 4));


        tweets.forEach(thisTweet => {
            var tweetTime = moment(thisTweet.created_at, "ddd MMM D HH:mm:ss ZZ YYYY");
            console.log(`${thisTweet.user.name} (@${thisTweet.user.screen_name}) ${tweetTime.calendar()}`);
            console.log(thisTweet.text);
            console.log('----------------------------------------------------------------------');

        });
        // var tweetTime = moment('Wed May 28 05:51:51 +0000 2014', "ddd MMM D HH:mm:ss ZZ YYYY");

        // fs.writeFile('twitter.json', JSON.stringify(tweets, null, 4), (err) => {
        //     if (err) throw err;
        //     console.log('Twitter JSON dump has been saved!');
        // });

    }); // end client.get()
} // end doTwitter

function doSpotify(searchString) {
    spotify.search({ type: 'track', query: searchString }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        data.tracks.items.forEach(element => {
            // console.log(objSpotify.tracks.items[0]);
            console.log('(' + element.popularity + ') "' + element.name + '" from album ' + element.album.name + " by:");
            element.artists.forEach(artist => {
                console.log(artist.name);
            });
            if (element.preview_url !== null) {
                console.log('preview link: ' + element.preview_url);
            }
            console.log('-----');
        });

        // console.log(JSON.stringify(data, null, 4));
        // console.log(JSON.stringify(data.tracks.items[0], null, 4));
        // fs.writeFile('spotify.json', JSON.stringify(data, null, 4), (err) => {
        //     if (err) throw err;
        //     console.log('Spotify JSON dump has been saved!');
        // });
    });
} // end doSpotify

function doOMDB(searchString) {
    var reqURL = `http://www.omdbapi.com/?apikey=${omdbAPIkey}&t=${searchString}`
    // console.log(reqURL);
    console.log('----------------------------------------------------------------------');


    request(reqURL, function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            // console.log(JSON.parse(body));

            var objOMDB = JSON.parse(body);

            ["Title", "Year", "Country", "Language", "Plot", "Actors"].forEach(element => {
                console.log(element + ': ' + objOMDB[element]);
            });
            console.log(objOMDB.Ratings[0].Source + ' rating: ' + objOMDB.Ratings[0].Value);
            console.log(objOMDB.Ratings[1].Source + ' rating: ' + objOMDB.Ratings[1].Value);

            // fs.writeFile('omdb.json', JSON.stringify((JSON.parse(body)), null, 4), (err) => {
            //     if (err) throw err;
            //     console.log('OMDB JSON dump has been saved!');
            // });
            console.log('----------------------------------------------------------------------');
        }
    }); /// end request()

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

// console.log(Object.keys(commandMap));


// Get command-line arguments, if any

if (process.argv.length > 2) {
    var [, , ...myArgs] = process.argv;
    var argAction = myArgs.shift();
    myArgs = myArgs.join(' ');
    console.log(`action is ${argAction} and target is ${myArgs}`);


    if (Object.keys(commandMap).indexOf(argAction) === -1) {
        return console.log("valid commands are " + Object.keys(commandMap).join(', '));
    }

    if (myArgs === '') {
        console.log('no selection');
        myArgs = commandMap[argAction].default;
        console.log('now searching by default', myArgs);
    }

    commandMap[argAction].handler(myArgs);

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
