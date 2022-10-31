/**
 * Accordions use the default bootstrap collapse functionality but is enhanced slightly to add use of the history API.
 */
class vmAccordion {

  /** @param {HTMLElement} accordion Dom Element */
  constructor(accordion){
    
    // Open accordion item on page load
    if(accordion.querySelector('[data-toggle="collapse"][href="'+location.hash+'"]')){
      accordion.querySelector('[data-toggle="collapse"][href="'+location.hash+'"]').click();
    }

    /**
     * On click of an accordion title within the accordion will trigger a scroll if needed and add to the history API.
     * @event click
     * @memberof vmAccordion
     */
    accordion.addEventListener('click', function(e){
        
      for (var target = e.target; target && target != this; target = target.parentNode) {

        if (target.matches('.accordion__title:not(.collapsed)')) {
          
          const id = target.getAttribute('href');
    
          setTimeout(function(){

            const windowTop = window.pageYOffset;
            const WindowBottom = window.pageYOffset + window.innerHeight;
            const rect = target.getBoundingClientRect();
            const elOffsetTop = rect.top - 100;

            if(elOffsetTop < 0 || elOffsetTop > WindowBottom){
              
              window.scroll({
                top: (windowTop + elOffsetTop), 
                left: 0, 
                behavior: 'smooth'
              });
              
            }

            history.replaceState(null, null, id);
          },300);
          
          break;
        }
      }
    }, false);
  }  
}

export default vmAccordion;