/*
// Mobile func to change the background colour on scroll, just triggers the target event
$(window).on('scroll',function(e){

  $('#content > .pitch-panel').each(function(){
    if ($(this).offset().top < window.pageYOffset + 10 && $(this).offset().top + $(this).height() > window.pageYOffset + 10) {
      window.location.hash = $(this).attr('id');
    }
  });

  $('body').addClass('scrolling');
});

$(document).ready(function () {

  // If the page is loaded with a hash then make sure its styled correctly
  if($('.pitch-panel:target').length){

    $('.pitch-panel:target').first().addClass('current');
    $('.pitch-panel:target').first().prevAll().addClass('previous');
  }
  else {
    $('.pitch-panel').first().addClass('current');
  }

  // Delay animation being triggered until page is loaded to reduce FLOUT
  setTimeout(function(){
    $('body').addClass('animate-ready');
  }, 100);

  $('body').on('click','.pitch-panel .btn[data-direction]',function(event){
    
    // We want to trigger the target event so we do NOT prevent default
    
    var $btn = $(this);
    var $current =  $btn.closest('.pitch-panel');
    var $next =  $($btn.attr('href'));
    var direction = "next";

    // Check the direction we are going
    if($btn.is('[data-direction="prev"]')){
      direction = "prev";
    }
    else {
      // If forwards then assign a prev class so that we can figure out the progress of the page easily later
      $current.addClass('previous').prevAll().addClass('previous');
    }

    // Assign some classes to trigger animation and transition states
    // Some of the animations are triggered by the target state
    // We are just adding extra states and improving that animation
    $('html').addClass('animating '+direction);
    $current.addClass('trans-out');
    $next.addClass('trans-in'); 

    // After the animation is complete then lets cleanup and remove the classes that trigger animation
    // Timeout needs to match the time of animation within the CSS file
    setTimeout(function(){
      
      $('html').removeClass('animating').removeClass('next').removeClass('prev');
      $('.pitch-panel').removeClass('current').removeClass('trans-out').removeClass('trans-in');

      // Assign the current class to the panel now shown
      // Remove previous class if its on
      $('.pitch-panel:target').first().addClass('current').removeClass('previous');  
    }, 500);
  });

  $('body').on('click','.pitch__links a',function(event){

    // We want to trigger the target event so we do NOT prevent default

    // Figure out the direction and the panel to show
    var id = $(this).attr('href');
    var dir = "next";

    if($(id).hasClass('previous')){
      dir = "prev";
    }

    // Trigger the corresponding next or prev button so we dont have to repeat any JS logic
    $('.btn[data-direction="'+dir+'"][href="'+id+'"]').trigger('click');
  });
});
*/