/**
 * Module to trigger animations on components when they become in view of the browser window.
 * 
 * The loading animation should only be triggered on components that are below what is visible of the page when first loaded. No animations should be triggered on components when they are in view on page load. This is so we can have a smooth non JavaScript fallback without creating a jittery effect on page load.
 * 
 */
const vmInview = () => {

  var detectReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)'); 
  if(document.body.hasAttribute('data-no-animate') || document.body.classList.contains('no-animate') || detectReducedMotion.matches == true){

    return false;
  }

  // Vars
  var selector = "body > .container, #content > .container, #secondary > .container, .banner, footer, [data-load-animate]";
  var inviewObjects = [], timer, viewportSize, viewportOffset, d = document, w = window, documentElement = d.documentElement;

  var arrContainers = Array.from(document.querySelectorAll(selector));
  arrContainers.forEach((arrayElement, index) => {
    
    // Add in card animation delays
    Array.from(arrayElement.querySelectorAll('.card-deck, .article-deck')).forEach((deck, deckIndex) => {

      var arrCards = Array.from(deck.querySelectorAll('.card'));
      arrCards.forEach((card, cardIndex) => {
        card.style.animationDelay = ((cardIndex+2)*0.25)+"s";
      });
    });

    // Rows
    Array.from(arrayElement.querySelectorAll('.row:not(.no-animate)')).forEach((row, rowIndex) => {

      if(!document.body.classList.contains('ie')){ // The below code does not work in IE11

        var arrCols = Array.from(row.querySelectorAll(':scope > [class*="col"]'));
        arrCols.forEach((col, colIndex) => {
          
          var arrItems = Array.from(col.querySelectorAll(':scope > *'));
          arrItems.forEach((item, itemIndex) => {

            item.style.animationDelay = ((colIndex+2)*0.25)+"s";
          });
        });
      }
    });
    
    inviewObjects.push({ delete: false, element: arrayElement });
  });

  // Re-usable functions
  function getViewportSize() {
   
    var mode, domObject, size = { height: w.innerHeight, width: w.innerWidth };

    // if this is correct then return it. iPad has compat Mode, so will
    // go into check clientHeight/clientWidth (which has the wrong value).
    if (!size.height) {
    
      mode = d.compatMode;

      if (mode) { // IE, Gecko
        domObject = mode === 'CSS1Compat' ?
          documentElement : // Standards
          d.body; // Quirks
        size = {
          height: domObject.clientHeight,
          width:  domObject.clientWidth
        };
      }
    }

    return size;
  }

  function getViewportOffset() {
    return {
      top:  w.pageYOffset || documentElement.scrollTop   || d.body.scrollTop,
      left: w.pageXOffset || documentElement.scrollLeft  || d.body.scrollLeft
    };
  }

  // Check each element within the array is inview of the page
  var checkInView = function(pageLoad){


    if (!inviewObjects.length) {

      clearInterval(timer); // Clear the interval as the global array is now empty
      return;
    }

    // Filter the array to 
    inviewObjects = inviewObjects.filter(item => item.delete == false);

    // Create usable elements Array
    var elements = inviewObjects.map(function(inviewObject, index) {

      return inviewObject.element;
    });
    
    
    viewportSize   = viewportSize   || getViewportSize();
    viewportOffset = viewportOffset || getViewportOffset();

    elements.forEach((element, index) => {
    
      if (!viewportOffset || !viewportSize) {
        return;
      }

      var paddingTop = parseInt(getComputedStyle(element)['paddingTop']) * 2;
      if(pageLoad){
        paddingTop = parseInt(getComputedStyle(element)['paddingTop']) + 16;
      }

      
      if (element.offsetTop + paddingTop < viewportOffset.top + viewportSize.height) {

        if(pageLoad){

          element.classList.add('no-animate');
          element.classList.add('inview-onload');
        }

        element.classList.remove('not-inview');
        element.classList.add('inview');

        if (element.matches('footer')) {

          if(typeof window.dataLayer === "undefined"){ window.dataLayer = []; }
          dataLayer.push({
            "event": "Scrolled to footer",
            "data": {
              "page": document.title
            }
          });
        }

        // Remove from array
        inviewObjects[index].delete = true;
      } 
      else {
        
        element.classList.add('not-inview');
      }
    
    });
  }

  checkInView(true);
  // Set interval
  if (inviewObjects.length) {
    timer = setInterval(checkInView, 250);
  }

  // Update viewport sizes on scroll, resize, scrollstop
  window.addEventListener('scroll', function(e) {
    viewportSize = null;
    viewportOffset = null;
  });

  window.addEventListener('resize', function(e) {
    viewportSize = null;
    viewportOffset = null;
  });

  window.addEventListener('scrollstop', function(e) {
    viewportSize = null;
    viewportOffset = null;
  });

  // If a user clicks on an anchor link lets make sure the animation doesn't trigger abover.
  window.addEventListener('popstate', function(e) {
    checkInView(true);
  });


  return true;
}

export default vmInview