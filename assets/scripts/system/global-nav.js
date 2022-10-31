//Global Nav JS

$(document).ready(function(e) {
    jsToggle();
    if ($(".svg").length > 0) {
      inlineSVG(); 
    }
    GlobalNavLiving.init(e); 
  });
  
  
  function jsToggle() {
    //remove all no js classes
    $('.js-nav-block').removeClass('js-nav-block').addClass('js-nav-hidden');
    //remove product links from nav
    $('.dropdown-item').attr('href', '#');
    //remove VM Living link
    $('#living-nav').attr('href', '#');
    //remove Sign in link
    $('#mvm-nav').attr('href', '#');
    //remove SME link
    $('#sme-nav').attr('href', '#');
    //remove container-no-js class
    $('.container-no-js').removeAttr('class');
    //remove no js class for styling
    $('#global-nav').attr('class', 'navbar');
    //remove padding-top from site container
    $('.site-container').css('padding-top', '0');
  }
  
  function inlineSVG() {
    $('img.svg').each(function(){
      var $img = jQuery(this);
      var imgID = $img.attr('id');
      var imgClass = $img.attr('class');
      var imgURL = $img.attr('src');
  
      jQuery.get(imgURL, function(data) {
          // Get the SVG tag, ignore the rest
          var $svg = jQuery(data).find('svg');
  
          // Add replaced image's ID to the new SVG
          if(typeof imgID !== 'undefined') {
              $svg = $svg.attr('id', imgID);
          }
          // Add replaced image's classes to the new SVG
          if(typeof imgClass !== 'undefined') {
              $svg = $svg.attr('class', imgClass+' replaced-svg');
          }
  
          // Remove any invalid XML tags as per http://validator.w3.org
          $svg = $svg.removeAttr('xmlns:a');
  
          // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
          if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
              $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
          }
  
          // Replace image with new SVG
          $img.replaceWith($svg);
  
      }, 'xml');
  
    });
  }
  
  
  var GlobalNavLiving = (function($) {
     "use strict";
     var nav = {};
  
     nav.mobNav = $('#mobile-nav');
     nav.navExpanded = false;
     nav.removeNav = $("main, .hero, .grid");
  
     nav.init = function(e) {     
       primaryNav(e);
       subNav(e);
       mobileNav(e);
       nav.mobNav.on('click', mobileBurger);
       nav.removeNav.on('click', navClose);
       businessNavSelected();
  
       //move nav up
       $('#global-nav').prependTo('.site-container');
       //move nav up on store/lounge pages
       $('#global-nav').prependTo('.site-content');
     };
  
     function primaryNav(e) {
        //First level dropdown
        $('.nav-item a.nav-link').on('click', function(e) {
           var canPropagate = true;
  
           if ($(this).attr('href') == '#') {
               e.stopPropagation();
               e.preventDefault();
               canPropagate = false;
           } 
        
          if (!$(this).next().hasClass('show')) {      
            $(this).parents('.navbar-nav').first().find('.show').removeClass("show");
          }
  
          nav.navExpanded = $(this).attr("aria-expanded") == "true" ? true : false;
          var selectedNav = $(this).attr("id");
  
          switch(selectedNav) {
  
            case "product-nav" :
              $("#living-nav, #mvm-nav, #sme-nav").attr("aria-expanded", false);
              $("#mvm-nav").parents('.nav-item').first().find('.show').removeClass("show");
              $("#product-nav").attr("aria-expanded", !nav.navExpanded);
              break;
  
            case "living-nav" :
              $("#product-nav, #mvm-nav, #sme-nav").attr("aria-expanded", false);
              $("#mvm-nav").parents('.nav-item').first().find('.show').removeClass("show");
              $("#living-nav").attr("aria-expanded", !nav.navExpanded);
              break;
  
            case "mvm-nav" :
              $("#product-nav, #living-nav, #sme-nav").attr("aria-expanded", false);
              $("#product-nav, #living-nav, #sme-nav").parents('.navbar-nav').first().find('.show').removeClass("show");
              $("#mvm-nav").attr("aria-expanded", !nav.navExpanded);
              break;
  
            case "sme-nav" :
              $("#product-nav, #mvm-nav, #living-nav").attr("aria-expanded", false);
              $("#mvm-nav").parents('.nav-item').first().find('.show').removeClass("show");
              $("#sme-nav").attr("aria-expanded", !nav.navExpanded);
              break;
          }
  
          var sectionDropdown = $(this).next(".nav-dropdown");
          sectionDropdown.toggleClass('show');
  
         //reset aria when selecting top level nav
         var resetAria = $('li.subnav-menu').find("[aria-expanded='true']");
         resetAria.attr('aria-expanded', false); 
  
          return canPropagate;
  
        });
      }
  
     function subNav(e) {
        $('.nav-dropdown a.dropdown-toggle').on('click', function(e) {
          if (!$(this).next().hasClass('show')) {
            $(this).parents('.nav-dropdown').first().find('.show').removeClass("show");
            
            // reset aria to false on close
            var ariaExpandedProduct = $(this).parents('.nav-dropdown').find("[aria-expanded='true']");
            ariaExpandedProduct.attr('aria-expanded', false);
          }
  
          var subMenu = $(this).next(".nav-dropdown");
          subMenu.toggleClass('show');
          
          //set aria expanded attr on products
          nav.navExpanded = $(this).attr("aria-expanded") == "true" ? true : false;
          var aria = $(this).attr('aria-expanded', !nav.navExpanded);
  
          return false;
        });
      }
  
     function mobileNav(e) {
        $("#mobile-nav, #mvm-nav").on('click', function(e) {
            if ($(this).attr("id") == "mvm-nav") {
              $(".navbar-menu").removeClass('show');
              $("#mobile-nav").removeClass('burger-change');
              $("#mobile-nav").parents('.navbar-nav').first().find('.show').removeClass("show");
            } else {
              $(".navbar-menu").toggleClass('show');
              $("#mvm-nav").parents('.nav-item').first().find('.show').removeClass("show");
            }
        });
  
        //fix living to top of screen on small devices
        var deviceSize = $(window).width();
        if (deviceSize < 768) {
           $("#living-nav").on('click', function(e) {
              $('html, body').animate({
                 scrollTop: $("#living-nav").offset().top
              }, 0)
           });
        }
  
      }
  
      function mobileBurger() {
        $("#mobile-nav").toggleClass("burger-change");
   
        if ($(this).attr("aria-expanded") == "false") {
           $(this).attr("aria-expanded", "true");
           //change tab order
           $(".navbar-menu").attr("tabindex", "1");
           $(".navbar-brand").attr("tabindex", "2");
        } else {
           $(this).attr("aria-expanded", "false");
           $(".navbar-menu, .navbar-brand").removeAttr("tabindex");
        }
      }
      
      function navClose() {
         if ($('#mobile-nav').attr("aria-expanded") == "true") {
             $("#mobileNavBar").removeClass('show');
             $("#mobile-nav").removeClass("burger-change");
             $('#mobile-nav').attr("aria-expanded", "false");
             $(".navbar-menu, .navbar-brand").removeAttr("tabindex");
         }
  
        $(".nav-dropdown").removeClass('show');
        $("#product-nav, #living-nav, #mvm-nav, #sme-nav").attr("aria-expanded", false);
      }
  
      function businessNavSelected() {
      var path = window.location.pathname;
      if (path.indexOf('business') >= 0) {
         $('.nav-link').each(function(){
            if($(this).attr('href') == '/virgin/business/') {
               $(this).addClass('nav-selected');
            }
         });
      }
       }
    
     return nav;
  
  })(jQuery);