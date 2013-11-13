$(function(){

  var map;
  var markers = [];
  var currentLat;
  var currentLng;

  // Initialize: sets up default map and map behavior
  function initialize() {


    // This variable sets up basic map functionality
    var mapOptions = {
        center: new google.maps.LatLng(37.7833, -122.4167), //set default center to be SF
        zoom: 13,//set default zoom to show entire extent of SF
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDoubleClickZoom: true, //disabled double click zoom
    };


    // Creates map and throws it into a div
    map = new google.maps.Map($("#map-canvas")[0],mapOptions);


    // On double click, creates marker with createPothole function
    google.maps.event.addListener(map,'dblclick',function(event){
      createPothole(event.latLng);
    });
  }



  // Everything related to markers goes here
  function createPothole(location, content) {

    // Part 1
    // Marker sets up defaults (via a hash)

    // First make old ones non-draggable
    var drag = (content === undefined) ? true : false



    var marker = new google.maps.Marker({
      position: location,
      map: map,
      draggable: drag,
      animation: google.maps.Animation.DROP,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5
      }
    });

    // Part 2
    // Adds newly created markers to marker array (created at top)
    markers.push(marker);
    var markerLocation = {latitude:marker.position.ob, longitude:marker.position.pb}

    // Part 3
    // HTML for info windows
    var contentString

    // Selects whether to add a form or existing data
    if (content === undefined) {
      contentString = [
      "<h2>New Pothole</h2>",

      "<form id='potholeForm'>",
        "<input id='name' type='text'name='name'placeholder='name'><br>",
        "<input type='text' id='description' name='description'placeholder='description'>",
        "<input type='hidden' id='latitude' name='latitude' value='"+markerLocation.latitude+"'>",
        "<input type='hidden' id ='longitude' name='longitude' value='"+markerLocation.longitude+"'>",
        "<button id='ajax'></button>",
      "</form>"

      ].join("")
    } else {
      contentString = content;
    }

    // Sets lat and long so it saves even without dragging
    currentLat = markerLocation.latitude
    currentLng = markerLocation.longitude

    // Part 4
    // Creates info window for one marker
    var infowindow = new google.maps.InfoWindow({
         content: contentString,
         maxWidth: 300
    });



    // When dragging, updates current variable
    google.maps.event.addListener(marker, 'dragend', function(){
      console.log(this.getPosition().lat())
      currentLat = this.getPosition().lat()
      currentLng = this.getPosition().lng()
      console.log(currentLat)
    })





    // What single clicks do
    google.maps.event.addListener(marker, 'click', function(){

      // On first click, centers and opens information window
      map.setCenter(marker.getPosition());
      infowindow.open(map,marker);

      // On second click, zooms to pothole
      google.maps.event.addListener(marker, 'click', function() {
       map.setZoom(16);



        });
     });


  } // end of potHole()





  ////////////////////////////////////////////////////////
  // These four functions connect to buttons on top bar
  ////////////////////////////////////////////////////////

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


  // This lets everything happen only AFTER rest of window loads
  google.maps.event.addDomListener(window, 'load', initialize);




  // On submit, creates database pothole and (something on map)
  $('body').on('click', '#ajax', function(event){
    event.preventDefault();

    var $name =$('#name').val();
    var $description=$('#description').val();
    var $latitude=currentLat
    var $longitude=currentLng
    var $vote_count= 1

    var pothole = {
      pothole:
        {
          name: $name,
          description: $description,
          latitude: $latitude,
          longitude: $longitude,
          vote_count: $vote_count
        }
      };
    console.log(pothole)
    $.post("/potholes",pothole).done(function(data){
      alert('hep')
      console.log(data)
      // Something else will get done here
    })
  })



  /////////////////////////////////////////////////////////////////////////////

  // Gathers all database potholes and drops markers for them

  $.get('/potholes.json').done(function(data) {
    // debugger
    _.each(data, function(item) {

      // Create marker
      var itemData = new google.maps.LatLng( parseFloat(item.latitude), parseFloat(item.longitude) )

      // Add pothole content
      var potholeContent = [
        "<h1>" + item.name + " the Pothole</h1>",
        "<div>" + item.description + "</div>",
        "<button class='upvote vote' id='" + item.id + "'>Upvote!</button>",
        "<div class='vote_counter' id='" + item.id + "'>1</div>",
        "<button class='downvote vote' id='" + item.id + "'>Downvote!</button>"
      ].join("")

      // Execute
      createPothole(itemData, potholeContent);

    })
  })

  /////////////////////////////////////////////////////////////////////////////

  // Creates votes

  $('body').on('click', '.vote', function(event) {
    event.preventDefault()

    var $upvote = (_.contains(this.classList, "upvote")) ? true : false
    var $pothole_id = this.id

    var vote = {
      vote: {
        upvote: $upvote,
        pothole_id: $pothole_id,
        user_id: 1
      }
    }

    // Ajax call and dynamic vote count updating
    $.post("/votes", vote).done(function(data) {
      var $countDiv = $('.vote_counter[id="' + data.pothole_id + '"]')

      $.getJSON("/potholes.json", function(json) {

        for (i in json) {
          if (json[i]["id"] == data.pothole_id) {
            var $newValue = json[i]["vote_count"]
          }
        }
        $countDiv.html($newValue)
      })
    })
  })
})









