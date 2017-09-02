//Node package to read and write contents of a file
//This variable grabs the data from keys.js
var keys = require('./keys.js');
//Take the data from the twitter module and place it in a variable
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");



function getTweets() {
//This places the keys in a variable
var client = new Twitter(keys.twitterKeys);
//console.log(keys.twitterKeys); This works
var params = {screen_name: '07eyard', count: 20};
client.get('statuses/user_timeline', params, function(error, tweets, response){
        if (!error) {
        for (var i = 0; i < tweets.length; i++) { //loop through and return up to 20 tweets
          console.log(tweets[i].created_at); //writes when the tweet was created
                      console.log(tweets[i].text); //writes the tweet
          }
        }
      if(error){
          console.log(error);
        }
  });
};

function findSongs(action2) {
  var songSearch = process.argv[3] || action2;// will run action 2 if process.argv[3] doesn't exist
  var spotify = new Spotify(keys.spotifyKeys);
  spotify.search({ type: 'track', query: songSearch, limit: 3 }, function(err, data){
    if (!err) {
      var songs = data.tracks.items;
      for (var i = 0; i < songs.length; i++) { //loop through and return info for up to 3 songs

       console.log(songs[i].artists[0].name);
       console.log(songs[i].name);
       console.log(songs[i].album.name);
       console.log(songs[i].href);
      }
    }
  if (err) {
       console.log('error:', err);
       return;
    }
  else { //This doesn't display the correct artist.
      spotify.search({ type: 'track', query: "The Sign"}, function(err, data){
          var songs = data.tracks.items;
          console.log(songs[0].artists[0].name);
          console.log(songs[0].name);
          console.log(songs[0].album.name);
          console.log(songs[0].href);
    });
  };
});
};

function findMovies() {
  var movie = process.argv[3];
  if (!movie) { //default for when the user doesn't enter a movie title
    movie = 'Mr. Nobody'
    console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/ It's on Netflix!")
  }
    // Run a request to the OMDB API
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&plot=short&tomatoes=true&apikey=40e9cece";
    //console.log(queryUrl);

  request(queryUrl, function (error, response, body) {

    if (!error && response.statusCode === 200) {
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("IMDb Rating: " + JSON.parse(body).imdbRating);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);//Not working,looks correct
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
    }
    if (error) {
      console.log('error:', error); // Print the error if one occurred
    }
});
}

function doWhatItSays() { //this isn't working.

  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      console.log(err);
    }  else {
      var command = data.split(",");

      //findSongs(dataArr[1]);
      pick(command[0], command[1]);
      //switch(action)
      //runApp(dataArr[0]);
      //switch(dataArr);
    };
});
};

//select the correct block of code to be executed
function pick(action, action2) {//action 2 will run command[1] of doWhatItSays()

switch(action){ //I received instruction on the switch statement from one of the online tutors
  case 'my-tweets':
    getTweets();
    break;
  case 'spotify-this-song':
    findSongs(action2);
    break;
  case 'movie-this':
    findMovies();
    break;
  case 'do-what-it-says':
    doWhatItSays();
    break;t
  default://Run this if there is no case match
    console.log('song');
}
};

function runApp(tweets) {
  pick(tweets);
};
runApp (process.argv[2]);
