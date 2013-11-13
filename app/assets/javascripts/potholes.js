$(function(){

  var map;
  var markers = [];
  var currentLat;
  var currentLng;
  var infobox = new google.maps.InfoWindow({
     content: "Hello!",
     maxWidth: 500,
     maxHeight: 500
  });
  var isWindowOpen = false;
  var newMarkerExists = false;
  var blueDot = "/assets/blueDot.png";

/////////////////////////////////////////////////////////////////////////////


  ////////////////////////
  // Setting up the Map //
  ////////////////////////

  // This doesn't (yet) include the 'drop all markers at start' function
  // That's further down the file

  function initialize() {

    // Step 1: Set up variable with custom map options
    var mapOptions = {
        center: new google.maps.LatLng(37.7833, -122.4167),         //set default center to be SF
        zoom: 13,                                                   //set default zoom to show entire extent of SF
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDoubleClickZoom: true,                               //disabled double click zoom
    };


    // Step 2: Create map (with that options variable) and throw it into a div
    map = new google.maps.Map($("#map-canvas")[0],mapOptions);

    //conditional to check for geolocation capabilities.
     if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
      //assigns current position to pos variable
      var currentPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      //creates blue dot and locates it using pos
      var userMarker = new google.maps.Marker({
          position: currentPosition,
          map: map,
          icon: blueDot
        });
          map.setCenter(currentPosition); //centers the map on pos
        }, function() {
          handleNoGeolocation(true);
        });
      }

    // Step 3: Allow for new markers to be created upon double clicking
    // This executes the createMarker function (defined below)
    google.maps.event.addListener(map,'dblclick',function(event){
      if (newMarkerExists == false) {
        infobox.close();
        newMarkerExists = true;
        createMarker(event.latLng);
      }
    });
  }


////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////



  // This is a big complicated mess
  // Creates pothole marker on map (but doesn't touch the database)
  function createMarker(location, content, potholeID) {


    // Step 1: Create the marker

    // (First, though, we use a special variable to make old ones non-draggable)
    var drag = (content === undefined) ? true : false

    // Now we actually do step 1
    var marker = new google.maps.Marker({
      position: location,
      map: map,
      draggable: drag,
      animation: google.maps.Animation.DROP,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 3
      },
      pothole_id: potholeID
    });

    // Step 2: Add newly created marker to a marker array

    markers.push(marker);


    // Step 3: Set up HTML for infobox

    var contentString;
    var markerLocation = {latitude:marker.position.ob, longitude:marker.position.pb}

    // If a new marker, creates a form
    // If an existing marker, uses content data passed into createMarker function
    if (content === undefined) {
      contentString = [
      "<h2>New Pothole</h2>",

      "<form id='potholeForm'>",
        "<input id='name' type='text'name='name'placeholder='name'><br>",
        "<input type='text' id='description' name='description'placeholder='description'>",
        "<input type='hidden' id='latitude' name='latitude' value='" + markerLocation.latitude + "'>",
        "<input type='hidden' id ='longitude' name='longitude' value='" + markerLocation.longitude + "'><br>",
        "<button id='ajax'>Submit Pothole!</button>",
      "</form>"

      ].join("")
    } else {
      contentString = content;
    }

    // Step 4: Put content into infobox
    infobox.setContent(contentString);


    // Step 5: If it's a new marker, open the infobox
    if (newMarkerExists === true) {
      infobox.open(map, marker);
      isWindowOpen = true;
    };

    // Bug fix: current lat/lng variables hold last dragged position
    currentLat = markerLocation.latitude
    currentLng = markerLocation.longitude

    google.maps.event.addListener(marker, 'dragend', function(){
      currentLat = this.getPosition().lat()
      currentLng = this.getPosition().lng()
    })




    // On clicking marker, centers and opens/closes info window

    google.maps.event.addListener(marker, 'click', function(){

      map.panTo(marker.getPosition());

      if (isWindowOpen == false) {
        infobox.setContent(contentString);
        infobox.open(map,marker);
        isWindowOpen = true;
      } else if (infobox.content === contentString) {
        infobox.close();
        isWindowOpen = false;
      } else {
        infobox.close();
        infobox.setContent(contentString);
        infobox.open(map,marker);
      }
    });
  } // end of potHole()


///////////////////////////////////////////////////////////////////////////////


  ////////////////////////////////////////////////////////
  // These four functions connect to buttons on top bar //
  ////////////////////////////////////////////////////////

  // If we delete those buttons, we can probably delete these functions, too

  // Main function
  function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  // Button #1
  function clearMarkers(){
    setAllMap(null);
  }

  // Button #2
  function showMarkers(){
    setAllMap(map);
  }

  // Button #3
  function deleteMarkers(){
    clearMarkers();
    markers =[];
  }


/////////////////////////////////////////////////////////////////////////////////////

  // This lets everything happen only AFTER rest of window loads
  google.maps.event.addDomListener(window, 'load', initialize);


/////////////////////////////////////////////////////////////////////////////////////


  //////////////////////////
  // Creating the pothole //
  //////////////////////////

  // Executes when submit button is clicked
  $('body').on('click', '#ajax', function(event){
    event.preventDefault();

    // There are four steps to this process

    // Step 1: Grab input values from form and shove them into jquery variables
    // Need to refactor 'user_id'
    var $name = $('#name').val();
    var $description = $('#description').val();
    var $latitude = currentLat
    var $longitude = currentLng
    var $vote_count = 1
    var $user_id = 1

    // Step 2: Set up a 'pothole' hash with those values
    // We'll feed this into ajax call and it'll become params for 'create' action
    var pothole = {
      pothole:
        {
          name: $name,
          description: $description,
          latitude: $latitude,
          longitude: $longitude,
          vote_count: $vote_count,
          user_id: $user_id
        }
      };

    // Step 3: Ajax call
    // A 'post' call requires two arguments: a route and the data to be sent in as params
    // In this case, that's the 'vote' hash from step 2
    $.post("/potholes", pothole).done(function(data) {

      // Step 4: Stuff done after successful ajax call
      // In this case, we need to fill in infoBox with newly created data

      // Step 4.1: Create the html that will fill the infobox
      // We got back json data because we rendered that in the 'create' action
      // NOTE: This is repeated below. Maybe use a partial to DRY it
      var newContent = [
        "<h1>" + data.name + " the Pothole</h1>",
        "<div>" + data.description + "</div>",
        "<button class='upvote vote' id='" + data.id + "'>Still broken!</button>",
        "<button class='downvote vote' id='" + data.id + "'>Fixed!</button>",
        "<div class='vote_counter' id='" + data.id + "'>Pothole sightings: " + data.vote_count + "</div>",
        "<button class='deleteButton' id='" + data.id + "'>Delete!</button>",
        "<button class='showPhotosButton' id='" + data.id + "'>Show Photos!</button>",
        "<button class='addPhotosButton hidden' id='" + data.id + "'>Add Photos!</button>"
      ].join("");

      // Step 4.2: Replace infobox content with new content
      infobox.setContent(newContent);

      // Step 4.3: Allow a new marker to be created
      newMarkerExists = false;
    })
  })



  /////////////////////////////////////////////////////////////////////////////


  /////////////////////////////////////////
  // Display all pothole markers on load //
  /////////////////////////////////////////

  $.get('/potholes.json').done(function(data) {
    _.each(data, function(item) {

      // Create marker
      var itemData = new google.maps.LatLng( parseFloat(item.latitude), parseFloat(item.longitude) )

      // Add pothole content
      // NOTE: This is repeated above. Maybe use a partial to DRY it.
      var potholeContent = [
        "<h1>" + item.name + " the Pothole</h1>",
        "<div>" + item.description + "</div>",
        "<button class='upvote vote' id='" + item.id + "'>Still broken!</button>",
        "<button class='downvote vote' id='" + item.id + "'>Fixed!</button>",
        "<div class='vote_counter' id='" + item.id + "'>Pothole sightings: " + item.vote_count + "</div>",
        "<button class='deleteButton' id='" + item.id + "'>Delete!</button>",
        "<button class='showPhotosButton' id='" + item.id + "'>Show Photos!</button>",
        "<button class='addPhotosButton hidden' id='" + item.id + "'>Add Photos!</button>"
      ].join("")

      // Execute
      createMarker(itemData, potholeContent, item.id);

    })
  })


  /////////////////////////////////////////////////////////////////////////////


  ///////////////////////////////////
  // Creating and Displaying Votes //
  ///////////////////////////////////

  // Executes when upvote or downvote button (both have class 'vote') is clicked
  $('body').on('click', '.vote', function(event) {
    event.preventDefault()

    // Step 1: Grab the relevant data for the Vote attributes and stick them into jquery variables
    // Upvote boolean is determined by checking button for 'upvote' or 'downvote' class
    // Placeholder for user_id right now

    var $upvote = (_.contains(this.classList, "upvote")) ? true : false
    var $pothole_id = this.id
    // var $user_id = something wil go here


    // Step 2: Set up the 'vote' hash that will become params for 'create' action
    var vote = {
      vote: {
        upvote: $upvote,
        pothole_id: $pothole_id,
        user_id: 1
      }
    }

    // Step 3: Ajax call
    // Our background worker gets called on creation of Vote, so vote_count will also get updated.
    $.post("/votes", vote).done(function(data) {

      // Step 4: Stuff done after successful ajax call
      // In this case, we update the vote count

      // This also has several steps

      // Step 4.1: Grab the div that contains the current vote count
      // Here the 'votes' json data is useful: we use its pothole_id to grab the correct div
      // We could merge this with the last line, but it's more readable this way
      var $countDiv = $('.vote_counter[id="' + data.pothole_id + '"]')

      // Step 4.2: Ajax call to grab potholes json (because it stores the current vote count)
      $.getJSON("/potholes.json", function(json) {

        // Step 4.3: Loop through each pothole json, checking whether it matches our pothole_id
        // If it does, we grab its vote_count and stick it in a variable
        for (i in json) {
          if (json[i]["id"] == data.pothole_id) {
            var $newValue = json[i]["vote_count"]
          }
        }

        // Step 4.4: Shove that number (step 4.3) into the div (step 4.1)
        $countDiv.html($newValue)
      })
    })
  })



  ///////////////
  // DELETE!!! //
  ///////////////

  // NOTE: Make sure delete_button has hidden class unless user_id == current_user.id

  $('body').on('click','.deleteButton', function(event){
    event.preventDefault();

    // Step 1: Grab pothole id
    var $potholeID = this.id

    // Step 2: Ask for confirmation (only execute if true)
    var confirmDelete = window.confirm("Are you sure you want to delete this pothole?");

    if (confirmDelete == true) {

      // Step 3: Ajax call to delete
      $.ajax({
        method: "delete",
        url: "/potholes/" + $potholeID
      }).done(function(data){

        // Step 4: Close infobox
        infobox.close();

        // Step 5: Loop through markers array, find matching id, remove it
        for (i in markers) {
          if ( markers[i]["pothole_id"] == $potholeID || markers[i]["pothole_id"] == null) {
            markers[i].setMap(null);
          }
        }

      }) // end of .done()

    } else {
      // Step 6: In case user is dumb
      console.log("OK, then why did you click delete?")
    }
  })



  //////////////////////////
  // Toggle Photo Buttons //
  //////////////////////////

  $('body').on('click', '.showPhotosButton', function(event) {
    $('.addPhotosButton[id="#"]').toggleClass('hidden');
    $('.showPhotosButton[id="#"]').toggleClass('hidden');
  })




})
