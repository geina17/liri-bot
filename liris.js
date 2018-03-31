require("dotenv").config();
//Grab data from keys.js
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var spotify = require('spotify');
//changed from new twitter(keys.twitterKeys)
var client = new twitter(keys.twitter);
var fs = require('fs');

//Stored argument's array
var nodeArgv = process.argv;
var command = process.argv[2];

//movie or song
var x = "";

//attaches multiple word arguments
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    x = x + "+" + nodeArgv[i];
  } else{
    x = x + nodeArgv[i];
  }
}

//switch case
switch(command){
  case "my-tweets":
    showTweets();
  break;

  case "spotify-this-song":
    if(x){
      spotifySong(x);
    } else{
      spotifySong("Fluorescent Adolescent");
    }
  break;

  case "movie-this":
    if(x){
      omdbData(x);
    } else{
      omdbData("Mr. Nobody");
    }
  break;

  case "do-what-it-says":
    doThing();
  break;

  default:
    console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  break;
}

function showTweets(){
  //Display last 20 Tweets
  var screenName = {screen_name: 'gna_zonaGUALA'};
  client.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(!error){
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("@gna_zonaGUALA: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        console.log("-----------------------");
        
        //adds text to log.txt file
        fs.appendFile('log.txt', "@gna_zonaGUALA: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        fs.appendFile('log.txt', "-----------------------");
      }
    }else{
      console.log('Error occurred');
      console.log(error);
    }
  });
}

function spotifySong(song){
  spotify.search({ type: 'track', query: song}, function(error, data){
    if(!error){
      for(var i = 0; i < data.tracks.items.length; i++){
        var songData = data.tracks.items[i];
        //artist
        console.log("Artist: " + songData.artists[0].name);
        //song name
        console.log("Song: " + songData.name);
        //spotify preview link
        console.log("Preview URL: " + songData.preview_url);
        //album name
        console.log("Album: " + songData.album.name);
        console.log("-----------------------");
        
        //adds text to log.txt
        fs.appendFile('log.txt', songData.artists[0].name);
        fs.appendFile('log.txt', songData.name);
        fs.appendFile('log.txt', songData.preview_url);
        fs.appendFile('log.txt', songData.album.name);
        fs.appendFile('log.txt', "-----------------------");
      }
    } else{
      console.log('Error occurred.');
    }
  });
}

function omdbData(movie){
  var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&tomatoes=true';

  request(omdbURL, function (error, response, body){
    if(!error && response.statusCode == 200){
      var torso = JSON.parse(body);

      console.log("Title: " + torso.Title);
      console.log("Release Year: " + torso.Year);
      console.log("IMdB Rating: " + torso.imdbRating);
      console.log("Country: " + torso.Country);
      console.log("Language: " + torso.Language);
      console.log("Plot: " + torso.Plot);
      console.log("Actors: " + torso.Actors);
      console.log("Rotten Tomatoes Rating: " + torso.tomatoRating);
      console.log("Rotten Tomatoes URL: " + torso.tomatoURL);

      //adds text to log.txt
      fs.appendFile('log.txt', "Title: " + torso.Title);
      fs.appendFile('log.txt', "Release Year: " + torso.Year);
      fs.appendFile('log.txt', "IMdB Rating: " + torso.imdbRating);
      fs.appendFile('log.txt', "Country: " + torso.Country);
      fs.appendFile('log.txt', "Language: " + torso.Language);
      fs.appendFile('log.txt', "Plot: " + torso.Plot);
      fs.appendFile('log.txt', "Actors: " + torso.Actors);
      fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + torso.tomatoRating);
      fs.appendFile('log.txt', "Rotten Tomatoes URL: " + torso.tomatoURL);

    } else{
      console.log('Error occurred.');
    }
    if(movie === "Mr. Nobody"){
      console.log("-----------------------");
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");

      //adds text to log.txt
      fs.appendFile('log.txt', "-----------------------");
      fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      fs.appendFile('log.txt', "It's on Netflix!");
    }
  });

}

function doThing(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    spotifySong(txt[1]);
    console.log(txt);
  });
}