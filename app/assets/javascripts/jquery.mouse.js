$(document).ready(function(){

var isClicked = false;

$('body').on('click', 'li', function() {
  if (isClicked == false) {
    $(this).stop().animate({height:'150px'},{queue:false, duration:600, easing: 'easeOutBounce'})
    isClicked = true;
  } else {
    $(this).stop().animate({height:'50px'},{queue:false, duration:600, easing: 'easeOutBounce'})
    isClicked = false;
  }
})









});