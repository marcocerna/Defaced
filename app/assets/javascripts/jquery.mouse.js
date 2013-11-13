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


//     //When mouse rolls over
//     $("li").bind('touchstart', function(){
//         $(this).stop().animate({height:'150px'},{queue:false, duration:600, easing: 'easeOutBounce'})
//     });
 
//     //When mouse is removed
//     $("li").bind('touchend', function(){
//         $(this).stop().animate({height:'50px'},{queue:false, duration:600, easing: 'easeOutBounce'})
        
//     });
 
// });