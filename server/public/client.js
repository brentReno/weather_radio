////////////Globals\\\\\\\\\\\\\\\\

//response containers
var weather_data = {};
var artist_data =[];

//city data
var user_zip =55401;
var user_city;
var user_state;

// music genres
var chill_genres= ["acoustic","ambient","chill","singer-songwriter","songwriter"];
var rock_genres= ["alt-rock", "alternative", "emo", "garage", "grunge", "indie", "indie-pop", "psych-rock", "punk", "punk-rock", "rock", "rock-n-roll", "rockabilly"];
var metal_genres= ["black-metal","death-metal","goth", "grindcore", "hard-rock","hardcore", "heavy-metal", "metal", "metal-misc", "metalcore"];
var country_folk_genres= ["bluegrass","country", "folk", "honky-tonk", "singer-songwriter", "songwriter"];
var hiphop_rnb_genres= ["breakbeat", "hip-hop", "funk", "groove", "r-n-b", "soul"];
var electronic_genres= ["chicago-house", "club", "dance", "deep-house", "detroit-techno", "drum-and-bass", "dubstep", "edm", "electro", "electronic", "house", "post-dubstep", "progressive-house", "techno" , "trance", "trip-hop"];
var world_genres= ["bossanova", "brazil", "dancehall", "latin", "reggae", "reggaeton", "salsa", "samba", "world-music", "afrobeat" ];
//weather groups
var observableWeather= [{name:"Funnel Cloud",valence: 0.01}, {name:"Heavy Thunderstorms with Hail",valence: 0.02},{name:"Light Thunderstorms with Hail", valence: 0.03},{name: "Light Hail", valence: 0.04},{name: "Heavy Hail", valence: 0.05},{name:"Heavy Thunderstorms and Ice Pellets",valence: 0.06},
{name: "Heavy Thunderstorms and Rain", valence: 0.08},{name: "Light Thunderstorms and Rain", valence: 0.09},{name: "Heavy Thunderstorm", valence: 0.1},{name: "Light Thunderstorms with Small Hail", valence: 0.11},{name: "Heavy Thunderstorms with Small Hail", valence: 0.12},{name: "Light Thunderstorms and Snow", valence: 0.13},
{name: "Heavy Thunderstorms and Snow", valence: 0.14},{name: "Heavy Freezing Rain", valence: 0.15},{name: "Light Freezing Rain", valence: 0.16},{name: "Light Ice Crystals", valence: 0.17},{name: "Heavy Ice Crystals", valence: 0.18},{name: "Light  Ice Pellets", valence: 0.19},
{name: "Heavy Ice Pellets", valence: 0.20},{name: "Heavy Freezing Drizzle", valence: 0.21},{name: "Light Snow Blowing Snow Mist", valence: 0.22},{name: "Heavy Snow Blowing Snow Mist", valence: 0.23},{name: "Light Ice Pellet Showers", valence: 0.24},{name: "Heavy Ice Pellet Showers", valence: 0.25},
{name: "Light Hail Showers", valence: 0.26},{name: "Heavy Hail Showers", valence: 0.27},{name: "Light Small Hail Showers", valence: 0.28},{name: "Heavy Small Hail Showers", valence: 0.29},{name: "Heavy Freezing Fog", valence: 0.30},{name: "Light Thunderstorm", valence: 0.31},
{name: "Small Hail", valence: 0.32},{name: "Light Freezing Drizzle", valence: 0.33},{name: "Light Freezing Fog", valence: 0.34},{name: "Light Blowing Snow", valence: 0.35},{name: "Heavy Rain", valence: 0.375},{name: "Heavy Rain Showers", valence: 0.39},
{name: "Heavy Rain Mist", valence: 0.405},{name: "Heavy Mist", valence: 0.42}, {name: "Heavy Fog", valence: 0.435},{name: "Heavy Fog Patches", valence: 0.45},{name: "Heavy Drizzle", valence: 0.465},{name: "Light Rain", valence: 0.48},
{name: "Light Drizzle", valence: 0.495},{name: "Heavy Snow", valence: 0.51},{name: "Heavy Snow Showers", valence: 0.525},{name: "Light Rain Mist", valence: 0.54},{name: "Light Rain Showers", valence: 0.555},{name: "Light Snow Showers", valence: 0.57},
{name: "Light Fog", valence: 0.585},{name: "Shallow Fog", valence: 0.60},{name: "Patches of Fog", valence: 0.63},{name: "Light Fog Patches", valence: 0.645},{name: "Light Mist", valence: 0.66},
{ name:"Overcast", valence: 0.67},{ name:"Light Snow", valence: 0.73},{ name:"Mostly Cloudy", valence: 0.79},{ name:"Partly Cloudy", valence: 0.85},{ name:"Scattered Clouds", valence: 0.91},{ name:"Clear", valence: 0.99}
];
// playlist generation data
var seed_valence;
var seed_artists=[];
var seed_genres = [];
var track_dance;
var track_energy;
var user_id;
var playlist_id;
var playlist_tracks = '';

(function() {

  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  var params = getHashParams();

  var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {
      $.ajax({
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            // userProfilePlaceholder.innerHTML = userProfileTemplate(response);
            user_id =  response.id;

            $('#login').hide();
            $('#loggedin').show();
          }
      });
    } else {
        // render initial screen
        $('#login').show();
        $('#loggedin').hide();
    }
  }

    document.getElementById("obtain-playlist").addEventListener('click', function(){
      obtainWeather();

    });
    var obtainCityState = function(){
      $.ajax({
        type: "GET",
        dataType: "json",
        url: 'http://maps.googleapis.com/maps/api/geocode/json?address='+user_zip,
        success: function(location){
          user_city = location.results[0].address_components[1].short_name;
          user_state = location.results[0].address_components[3].short_name;
          console.log(user_city);
          console.log(user_state);

        }
      });
    };
    obtainCityState();

    var obtainArtists= function() {
      console.log("access", access_token);
      $.ajax({
        type: "GET",
        url: "https://api.spotify.com/v1/me/top/artists",
        dataType: "json",
        headers: {"Authorization": "Bearer " + access_token},
        success: function(artists){
          console.log("back from spotify with: ", artists);
          for (var i = 0; i < artists.items.length; i++) {
            //package top artist data in to an object
            var user_artist ={
              //artist's name
              name: artists.items[i].name,
              // artist's genres
              genres: artists.items[i].genres,
              // artist's uri
              artist_uri: artists.items[i].uri
            };
            //push each artis to array
            artist_data.push(user_artist);
          }
          console.log(artist_data);
          findGenres();
          createPlaylist();
      },
         error: function(err) {
          console.log("Error retrieving spotify API ", err);
        }
      });
    };

    var obtainWeather =  function(){

      $.ajax({
        type: "GET",
        url: "http://api.wunderground.com/api/b67101dd22166f78/conditions/q/"+ user_state+"/"+user_city+".json",
        dataType: "json",
        success: function(weather){
          console.log("back with", weather);
          // get the current temp
          var current_temp = weather.current_observation.feelslike_f;
          //get the current weater conditions
          var current_conditions = weather.current_observation.weather;
          // get the current wind speed
          var current_wind= weather.current_observation.wind_mph;
          // push current data into weather_data
          weather_data.current_temp = current_temp;
          weather_data.current_conditions= current_conditions;
          weather_data.current_wind= current_wind;
          console.log(current_temp, current_conditions, current_wind);
          console.log(weather_data);
          tempToEnergy();
          windToDance();
          observationToValence();
          obtainArtists();
        }
      });
    };

    var findGenres = function(){
      var artistSeedId;
        for (var h = 0; h < artist_data.length; h++){
          // console.log(artist_data[h].genres);
          for(var i = 0; i < artist_data[h].genres.length; i++){
            //use electronic genres because it's the longest genre array
            for (var j =0; j < electronic_genres.length; j++){
              // console.log(electronic_genres[j]);
              // console.log(artist_data[h].genres[j]);
              if (electronic_genres[j] == artist_data[h].genres[i] ) {
                console.log("it's a match: " + electronic_genres[j]+ " & " + artist_data[h].genres[i] + " Artist: " + artist_data[h].name );
                createSeedData(h, i);
              }
              if( chill_genres[j]== artist_data[h].genres[i]){
                console.log("it's a match: " + chill_genres[j]+ " & " + artist_data[h].genres[i] + " Artist: " + artist_data[h].name );
                createSeedData(h, i);
              }
              if( rock_genres[j]== artist_data[h].genres[i]){
                console.log("it's a match: " + rock_genres[j]+ " & " + artist_data[h].genres[i] + " Artist: " + artist_data[h].name );
                createSeedData(h, i);
              }
              if( metal_genres[j]== artist_data[h].genres[i]){
                console.log("it's a match: " + metal_genres[j]+ " & " + artist_data[h].genres[i] + " Artist: " + artist_data[h].name );
                createSeedData(h, i);
              }
              if( country_folk_genres[j]== artist_data[h].genres[i]){
                console.log("it's a match: " + country_folk_genres[j]+ " & " + artist_data[h].genres[i] + " Artist: " + artist_data[h].name );
                createSeedData(h, i);
              }
              if( hiphop_rnb_genres[j]== artist_data[h].genres[i]){
                console.log("it's a match: " + hiphop_rnb_genres[j]+ " & " + artist_data[h].genres[i] + " Artist: " + artist_data[h].name );
                createSeedData(h, i);
              }
              if( world_genres[j]== artist_data[h].genres[i]){
                console.log("it's a match: " + world_genres[j]+ " & " + artist_data[h].genres[i] + " Artist: " + artist_data[h].name );
                createSeedData(h, i);
              }
            }
          }
        }
        console.log(seed_artists, seed_genres);
        jQuery.unique(seed_genres);
        console.log(seed_genres);
      };

    var observationToValence = function(){
      for (var k = 0; k < observableWeather.length; k++) {
        if(observableWeather[k].name == weather_data.current_conditions){
          console.log("in the if");
          seed_valence = observableWeather[k].valence;
          console.log(seed_valence);

        }
      }
    };

    var tempToEnergy = function(){

      var current_temp = weather_data.current_temp;
      if (current_temp > -50 && current_temp <= 0){
        track_energy = 0;
      }
      else if ((current_temp > 0 && current_temp <= 10)||(current_temp > 50 && current_temp <= 60)) {
        track_energy = 0.2;
      }
      else if ((current_temp > 10 && current_temp<=20) || (current_temp > 60 && current_temp <= 70)) {
        track_energy = 0.4;
      }
      else if ((current_temp > 20 && current_temp<=30) || (current_temp > 70 && current_temp <= 80)) {
        track_energy = 0.6;
      }
      else if ((current_temp> 30 && current_temp <= 40) || (current_temp > 80 && current_temp <= 90)) {
        track_energy = 0.8;
      }
      else if ((current_temp > 40 && current_temp <= 50) || (current_temp > 90 && current_temp <= 120)) {
        track_energy = 1;
      }
      console.log(track_energy);
      return track_energy;
    }; //end tempToEnergy

    var windToDance = function (){

      var wind_speed = weather_data.current_wind;

      if(wind_speed >= 0 && wind_speed<=5){
        track_dance = 0;
      }
      else if (wind_speed >5 && wind_speed <= 10) {
        track_dance = 0.2;
      }
      else if (wind_speed > 10 &&  wind_speed <= 15) {
        track_dance = 0.4;
      }

      else if (wind_speed > 15 && wind_speed <= 20) {
        track_dance = 0.6;
      }
      else if (wind_speed > 20 && wind_speed <= 30){
        track_dance = 0.8;
      }

      else if (wind_speed > 30) {
        track_dance = 1.0;
      }
      console.log(track_dance);
      return track_dance;
    };//end windToDance

    var createSeedData = function (h, i){
      artistSeedId = artist_data[h].artist_uri.substring(15);
      //push artist uri to seed_artists array
      seed_artists.push(artistSeedId );
      //push genre to seed_genres array
      seed_genres.push(artist_data[h].genres[i]);
    };

    var createPlaylist = function(){

      //create search url var
      var searchURL = "https://api.spotify.com/v1/recommendations/?seed_artists=";
      /////// add music data \\\\\\\\\\\\\\\\\
      //add seed artists to search URL
      for (var i = 0; i < 3; i++) {
        searchURL += seed_artists[i];
        if (i < 2){
            searchURL += ",";
        }
      }
        searchURL+= "&seed_genres=";
      for (var j = 0; j < 2; j++) {
        searchURL += seed_genres[j];
        if ( j < 1){
          searchURL += ",";
        }
      }
      ////// addd weather data \\\\\\\\\\
      searchURL += "&target_energy=";
      searchURL += track_energy;
      searchURL += "&target_danceability=";
      searchURL += track_dance;
      searchURL +="&target_valence=";
      searchURL += seed_valence;
      searchURL += "&limit=50";
      console.log(searchURL);
      $.ajax({
        type: "GET",
        url: searchURL,
        dataType: "json",
        headers: {"Authorization": "Bearer " + access_token},
        success: function(playlist){
          console.log(playlist);
          console.log(playlist.tracks);
          for (var i = 0; i < playlist.tracks.length; i++) {
            console.log(playlist.tracks[i].artists[0].name + " " + playlist.tracks[i].name);
            console.log(playlist.tracks[i].uri);
            if(i == (playlist.tracks.length -1) ){
              playlist_tracks += playlist.tracks[i].uri;
            }
            else{
            playlist_tracks += playlist.tracks[i].uri +",";
            }
          }
          console.log(playlist_tracks);
          $.ajax({
            type:"POST",
            url: "https://api.spotify.com/v1/users/" + user_id + "/playlists",
            dataType: "json",
            data: "{\"name\":\"A Weather Radio Playlist\", \"public\":true}",
            headers: {"Authorization": "Bearer " + access_token, "Content-Type": "application/json"},
            success:
              function(response){
                console.log("Great Success", response);
                playlist_id = response.id;
                $.ajax({
                  type: "POST",
                  url: "https://api.spotify.com/v1/users/" + user_id +"/playlists/" + playlist_id +"/tracks?uris=" + playlist_tracks,
                  dataType: "json",
                  headers: {"Authorization": "Bearer " + access_token, "Content-Type": "application/json"},
                  success: function(createdPlaylist){
                    console.log("Success:", createdPlaylist);
                  },
                  error:
                  function(error){
                    console.log("err: ", error );
                  }
                });
              },
            error:
              function(error){
                console.log("err: ", error );
              }
          });
        },
        error: function(error){
          console.log("err: ", error );
        }
      });
    };
})();
