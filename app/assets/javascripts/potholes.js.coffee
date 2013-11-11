# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/


#initialize function to set up default map and map behavior
initialize = ->
  mapOptions =
    center: new google.maps.LatLng(37.7833, -122.4167) #set default center to be SF
    zoom: 13 #set default zoom to show entire extent of SF
    mapTypeId: google.maps.MapTypeId.ROADMAP
    disableDoubleClickZoom: true #disabled double click zoom

  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions)

  #click event listener to add new marker on double cick
  google.maps.event.addListener map, "dblclick", (event) ->
    potHole event.latLng


#set default behavior for markers
potHole = (location) ->
  marker = new google.maps.Marker(
    position: location
    map: map
    draggable: true
    animation: google.maps.Animation.DROP
    icon:
      path: google.maps.SymbolPath.CIRCLE
      scale: 5
  )

  #adds newly created markers to marker array
  markers.push marker

  #/ content string is where the css for the info boxes should go
  contentString = "<img src= 'http://bostonbiker.org/files/2011/02/pothole.jpg'><h2>Bill</h2> <li> Discovered by: Rocketfish</li> <li> Date Discovered: 11/10/2013</li>"
  infowindow = new google.maps.InfoWindow(
    content: contentString
    maxWidth: 300
  )
  google.maps.event.addListener marker, "click", ->
    map.setZoom 18
    map.setCenter marker.getPosition()
    google.maps.event.addListener marker, "click", ->
      infowindow.open map, marker


setAllMap = (map) ->
  i = 0

  while i < markers.length
    markers[i].setMap map
    i++
clearMarkers = ->
  setAllMap null
showMarkers = ->
  setAllMap map
deleteMarkers = ->
  clearMarkers()
  markers = []
map = undefined
markers = []
google.maps.event.addDomListener window, "load", initialize