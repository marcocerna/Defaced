// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree ./templates
//= require jquery-fileupload/basic
//= require_tree .
//= require lodash
//= require gmaps/google

$(document).ready(function(){
 
    //When mouse rolls over
    $("li").mouseover(function(){
        $(this).stop().animate({height:'150px'},{queue:false, duration:600, easing: 'easeOutBounce'})
    });
 
    //When mouse is removed
    $("li").mouseout(function(){
        $(this).stop().animate({height:'50px'},{queue:false, duration:600, easing: 'easeOutBounce'})
    });
 
});


