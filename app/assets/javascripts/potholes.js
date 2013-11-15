$(function(){

  var map;
  var markers = [];                             // Where all markers are stored
  var currentLat;                               // These two used to create pothole with last position
  var currentLng;
  var infobox = new google.maps.InfoWindow({    // One infobox, only content changes
     content: "Hello!",
     maxWidth: 700,
     boxStyle:{
      border: "1px solid black"
     }
  });
  var isWindowOpen = false;                     // Used so only one window opens at a time
  var newMarkerExists = false;                  // Used so only one marker creaed at a time
  var blueDot = "/assets/blueDot.png";
  var currentMarker;                            // Maybe use this for photo sizing issue?

/////////////////////////////////////////////////////////////////////////////


  ////////////////////////
  // Setting up the Map //
  ////////////////////////

  // This doesn't (yet) include the 'drop all markers at start' function
  // That's further down the file

  function initialize() {

    // Step 1: Set up variable with custom map options
    var mapOptions = {
        // Refactoring: If geolocation, center there. Else, SF
        center: new google.maps.LatLng(37.7833, -122.4167),         // Set default center to SF
        zoom: 13,                                                   // Set default zoom to show entire city
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDoubleClickZoom: true,                               // Disable double click zoom
    };


    // Step 2: Create map (with that options variable) and throw it into a div
    map = new google.maps.Map($("#map-canvas")[0],mapOptions);

    // Step 3: Allow for geolocation (the blue dot)
     if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {

        // 3.1: Grab current position in a variable
        var currentPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

        // 3.2: Place blue dot on current position
        var userMarker = new google.maps.Marker({
          position: currentPosition,
          map: map,
          icon: blueDot
        });

        // 3.3: Center on current position
        map.setCenter(currentPosition);
      }, function() {
          handleNoGeolocation(true);
        });
      }

    // Step 4: Allow double click to create (only one) new marker
    // This executes the createMarker function (defined below)
    if(gon.current_user){
      google.maps.event.addListener(map,'dblclick',function(event){
        if (newMarkerExists == false) {
          infobox.close();
          newMarkerExists = true;
          createMarker(event.latLng);
        }
      });
    }
  }


////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////



  // This needs refactoring
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
      contentString = JST['templates/newForm'](markerLocation);
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

    // Bug fix: Set currentLat/currentLng to hold last dragged position
    currentLat = markerLocation.latitude
    currentLng = markerLocation.longitude

    google.maps.event.addListener(marker, 'dragend', function(){
      currentLat = this.getPosition().lat()
      currentLng = this.getPosition().lng()
    })




    // On clicking marker, centers and opens/closes info window
    // Refactoring: Does this need to go inside createMarker function?

    google.maps.event.addListener(marker, 'click', function(){

      map.panTo(marker.getPosition());

      if (isWindowOpen == false) {
        infobox.setContent(contentString);
        infobox.open(map,marker);
        isWindowOpen = true;
        currentMarker = marker;
      } else if (infobox.content === contentString) {
        infobox.close();
        isWindowOpen = false;
      } else {
        infobox.close();
        infobox.setContent(contentString);
        infobox.open(map,marker);
        currentMarker = marker;
      }
    });
  } // end of potHole()


/////////////////////////////////////////////////////////////////////////////////////

  // This lets everything happen only AFTER rest of window loads
  // Refactoring: In a weird location, need to move it
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
    // Refactoring: fix 'user_id'
    var $name = $('#name').val();
    var $description = $('#description').val();
    var $latitude = currentLat
    var $longitude = currentLng
    var $vote_count = 1
    var $user_id = gon.current_user.id

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
      var newContent = JST['templates/pothole'](data);

      // Step 4.2: Recreate marker with correct data
      var lastMarker = markers.pop()
      var lastPosition = lastMarker.position
      createMarker(lastPosition, newContent, data.id);

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
      var potholeContent = JST['templates/pothole'](item);

      // Execute
      createMarker(itemData, potholeContent, item.id);

    })

    // Optional: Marker clusters. Remove/comment out if you don't want it.
    var markerCluster = new MarkerClusterer(map, markers);
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


/////////////////////////////////////////////////////////////////////////////////////


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


/////////////////////////////////////////////////////////////////////////////////////


  //////////////////////////
  // Toggle Photo Buttons //          // WARNING: Sizing issues
  //////////////////////////

  $('body').on('click', '.showHide', function(event) {
    event.preventDefault();

    // infobox.close();
    $('.showPhotosButton[id="' + this.id + '"]').toggleClass('hidden'); // Do we even need to check ID? Test this
    $('.photosContent[id="' + this.id + '"]').toggleClass('hidden');
    // infobox.setContent("<div>I'm a div!</div>")                         // Needs to grab correct data w/o hidden class
    // infobox.open(map, currentMarker);



    // Search through database for pictures with pothole_id

    // Append them to storePhotos div




  })


// To change the popup box css properties:

$('body').on('click', '.gmnoprint', function(){
  setTimeout(function(){
  $('#content').parent().parent().parent().css('border','2px solid red');
  }, 20);
})
/////////////////////////////////////////////////////////////////////////////////////


  ////////////////////////////
  // Add Photo (incomplete) //
  ////////////////////////////


  // $('body').on('click', '.addPhotosButton', function(event) {
  //   event.preventDefault();

  //   // Step 1: Grab attribute data
  //   var $image_source = $('input[name="image_source"]').val()
  //   var $pothole_id = $('input[name="pothole_id"]').val()
  //   var $user_id = 1                                            // Placeholder; fix this

  //   // Step 2: Set up params hash
  //   var photo = {
  //     photo: {
  //       image_source: $image_source,
  //       pothole_id: $pothole_id,
  //       user_id: $user_id
  //     }
  //   }

  //   // Step 3: Ajax call
  //   $post('/photos', photo).done(function(data) {

  //     alert("Yay, you posted a photo!");

  //     // Step 4: Add picture to infoBox               // Only works for ONE photo; build a loop for this

  //     // 4.1: Grab storePhotos div
  //     var $photoDiv = $('.storePhotos')               // Test whether we need ID here too

  //     // 4.2: Write html for photo
  //     var $newPhoto = [
  //       "<img src='" + data.remote_image_url + "'>"   // Check with Kristine whether this'll work
  //     ]

  //     // 4.3: Throw that photo into that div
  //     $photoDiv.html($newPhoto)

  //   }) // end of .done()

  //   // Step 5 (maybe): Reopen infobox (so it sizes correctly?)
  // })


/////////////////////////////////////////////////////////////////////////////////////


  ////////////////////////////
  // Add Photo (two pager)  //
  ////////////////////////////

  // $('body').on('click', '.addPhotosButton', function(event) {
  //   event.preventDefault()


  //   var $pothole_id = $('input[name="pothole_id"]').val()
  //   console.log("The pothole ID is: " + $pothole_id)

  //   var photo = {
  //     photo: {
  //       pothole_id: $pothole_id
  //     }
  //   }

  //   $.post('/photos', photo).done(function(data) {
  //     console.log(data)
  //     // redirect to /photos

  //     // ajax call to uploader
  //     $.ajax(url: uploader_action).done({

  //       grab $user_id, $key, $pothole_id

  //       $.post(all that stuff)
  //     })
  //   })


  // })



})
