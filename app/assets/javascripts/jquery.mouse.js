$(document).ready(function(){

  var isClicked = false

    //When clicked once opens div, clicked again closes the div
    $('body').on('touchstart', 'li', function(event){
      if(isClicked ==false){
        $(this).stop().animate({height:'100px'},{easing: 'easeOutBounce'})
        isClicked=true
      }
      else{
        $(this).stop().animate({height:'31px'},{easing: 'easeOutBounce'})
        isClicked = false
      }
    });

    $('body').on('click', 'li', function(event){
      if(isClicked ==false){
        $(this).stop().animate({height:'100px'},{easing: 'easeOutBounce'})
        isClicked=true
      }
      else{
        $(this).stop().animate({height:'31px'},{easing: 'easeOutBounce'})
        isClicked = false
      }
    });
});

