/**
 * Get the current breakpoint from looking at the carousels set CSS
 * @param {HTMLElement} carousel Dom Element
 */
const getBreakpoint = (carousel) => {

  const minHeight = window.getComputedStyle(carousel, null).getPropertyValue("min-height");
  return (minHeight == "3px" ? "desktop" : (minHeight == "2px" ? "tablet" : "mobile"));
}

/**
 * Transform a component with a horizontal scroll into navigatable carousel component with next, previous and pip buttons.
 */
class vmCarousel {

  /** @param {HTMLElement} carousel Dom Element */
  constructor(carousel){
    
    let carouselContainer = carousel.closest('.container');
    let itemCount = carousel.querySelectorAll('.card').length;

    this.setupCarousel(carousel,carouselContainer,itemCount);
    this.responsiveControls(carousel,carouselContainer,itemCount);
    this.setButtons(carousel,carouselContainer,itemCount,1,getBreakpoint(carousel));
  }

  /** 
   * Assign event handlers for button clicks and scrolling.
   * @param {HTMLElement} carousel Dom Element 
   * @param {HTMLElement} carouselContainer Dom Element 
   * @param {number} itemCount Number of article cards in the carousel
   */
  setupCarousel(carousel,carouselContainer,itemCount){

    let scrollCarousel = this.scrollCarousel;
    let setButtons = this.setButtons;
    var scrollTimeout;

    carouselContainer.addEventListener('click', function(e){
      // loop parent nodes from the target to the delegation node
      for (var target = e.target; target && target != this; target = target.parentNode) {

        if (target.matches('[data-go]')) {
          
          let scrollTo = parseInt(target.getAttribute('data-go'));
          
          scrollCarousel(carousel,itemCount,scrollTo);
          setButtons(carousel,carouselContainer,itemCount,scrollTo, getBreakpoint(carousel));

          break;
        }
      }
    }, false);

    carousel.addEventListener('scroll', function(e){
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function(){ 
          
        let scrollWidth = carousel.scrollWidth;
        let scrollLeft = carousel.scrollLeft;
        let scrollTo = Math.round((scrollLeft / scrollWidth) * itemCount) + 1;

        setButtons(carousel,carouselContainer,itemCount,scrollTo, getBreakpoint(carousel));
      }, 300); 

    }, false);
  }

  /**
   * Decide if there is a need to hide the navigation controls for each breakpoint. Hide pips if too many would need to be displayed.
   * @param {HTMLElement} carousel Dom element
   * @param {HTMLElement} carouselContainer Dom element
   * @param {number} itemCount Number of article cards in the carousel
   */
  responsiveControls(carousel,carouselContainer,itemCount){
    
    let carouselControls = carouselContainer.querySelector('.carousel__controls');
    let carouselPips = carouselContainer.querySelector('.pips');

    if(itemCount <= 1)
      carouselControls.classList.add('d-none');
    else if(itemCount <=2)
      carouselControls.classList.add('d-sm-none');
    else if(itemCount <=3)
      carouselControls.classList.add('d-md-none');
    else if(itemCount > 6)
      carouselPips.classList.add('d-none','d-sm-block');
  }

  /**
   * Make sure buttons are setup with the right values depending upon the breakpoint. The buttons are reset each time an event is triggered. Making sure the next and previous buttons are updated.
   * @param {HTMLElement} carousel Dom element
   * @param {HTMLElement} carouselContainer Dom element
   * @param {number} itemCount Number of article cards in the carousel
   * @param {number} scrollTo Article number to put into display
   * @param {string} breakpoint Breakpoint view of the device
   */
  setButtons(carousel,carouselContainer,itemCount,scrollTo,breakpoint){

    /** @type {number} the amount of cards the next and previous buttons will scroll. */
    let scrollAmount = 1;
    if(breakpoint == "tablet")
      scrollAmount = 2;
    else if(breakpoint == "desktop")
      scrollAmount = 3;

    // Reset buttons
    let prev = carouselContainer.querySelector('.control-left');
    let next = carouselContainer.querySelector('.control-right');
    prev.removeAttribute('disabled');
    next.removeAttribute('disabled');
    Array.from(carouselContainer.querySelectorAll('.pip button')).forEach((arrayElement, index) => {
      arrayElement.classList.remove('current');
    });

    // Set the control attributes
    let scrollPrev = scrollTo-scrollAmount;
    let scrollNext = scrollTo+scrollAmount < itemCount ? scrollTo+scrollAmount : itemCount;
    prev.setAttribute('data-go',scrollPrev);
    next.setAttribute('data-go',scrollNext);

    // Disable buttons
    if(scrollTo == 1)
      prev.setAttribute('disabled','disabled');

    if(scrollTo >= itemCount)
      next.setAttribute('disabled','disabled');

    // Set current pip
    carouselContainer.querySelector('.pip:nth-child('+scrollTo+') button').classList.add('current'); 

    // Cheat - Make sure the last pip is being set and the next button disabled when scrolled to the end
    if(scrollAmount > 1 && itemCount - scrollTo < scrollAmount){

      next.setAttribute('disabled','disabled');

      if(breakpoint == "tablet"){ 

        var arrPipsTablet = Array.from(carouselContainer.querySelectorAll('.pip:nth-child(odd) button'));
        arrPipsTablet[arrPipsTablet.length - 1].classList.add('current');
      } 
      else if(breakpoint == "desktop"){

        var arrPipsDekstop = Array.from(carouselContainer.querySelectorAll('.pip:nth-child(3n+1) button'));
        arrPipsDekstop[arrPipsDekstop.length - 1].classList.add('current');
      } 
    }
  }

  /**
   * Scroll to a a calculated point within the carousel.
   * @param {HTMLElement} carousel Dom element
   * @param {number} itemCount Number of article cards in the carousel
   * @param {number} scrollTo Article number to put into display
   */
  scrollCarousel(carousel,itemCount,scrollTo){

    /** @type {number} Width of the carousel needed to calculate the point to scroll to. Worth noting that this width is not the full width of the carousel and its items. But is the width displayed on the page. */
    let scrollWidth = carousel.scrollWidth;
    /** @type {number} The point the carousel scrolls to.  */
    const scrollLeft = Math.floor(scrollWidth * ((scrollTo-1) / itemCount))

    if(document.body.classList.contains('ie')){
      var $carousel = $(carousel);

      $carousel.animate({
        scrollLeft: scrollLeft
      }, 'slow');
    }
    else if(typeof carousel.scroll != 'undefined') {
      
      carousel.scroll({
        top: 0,
        left: scrollLeft, 
        behavior: 'smooth'
      });
    }
  }
}

export default vmCarousel;