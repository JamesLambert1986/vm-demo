/**
 * Add in some extra functionality so that we can hide/show data groups be changing an input field in the chart key.
 * 
 * **NOTE:** IE11 needs some extra JavaScript for it to display appropriately.
 */
class vmChart {
  /** @param {HTMLElement} chartContainer Dom element */
  constructor(chartContainer){

    let hideData = this.hideData;
    let showData = this.showData;

    // Turn the key into a series of buttons
    Array.from(chartContainer.querySelectorAll('.key__btn')).forEach((arrayElement, index) => {
      arrayElement.setAttribute('role','button');
    });
  
    chartContainer.addEventListener('change', function(e){
      // loop parent nodes from the target to the delegation node
      for (var target = e.target; target && target != this; target = target.parentNode) {
    
        if (target.matches('.chart__key .custom-control-input')) {

          const set = target.getAttribute('data-index');

          if(target.checked)
            showData(chartContainer,set);
          else 
            hideData(chartContainer,set);

          break;
        }
      }
    }, false);
  }

  showData(chartContainer,set){
    Array.from(chartContainer.querySelectorAll('.group .data:nth-of-type('+set+')')).forEach((arrayElement, index) => {
      arrayElement.classList.remove('hide');
    });

    // Line chart
    Array.from(chartContainer.querySelectorAll('svg:nth-of-type('+set+')')).forEach((arrayElement, index) => {
      arrayElement.classList.remove('hide');
    });
  }

  hideData(chartContainer,set){
    Array.from(chartContainer.querySelectorAll('.group .data:nth-of-type('+set+')')).forEach((arrayElement, index) => {
      arrayElement.classList.add('hide');
    });

    // Line chart
    Array.from(chartContainer.querySelectorAll('svg:nth-of-type('+set+')')).forEach((arrayElement, index) => {
      arrayElement.classList.add('hide');
    });
  }

  /** @todo If the chart has a range */
  /* 
    * Update the z-indexes of the elements
    * Below is the old jQuery version
    * This has been left as this currently isn't used anywhere
    $('body').on("mouseenter", ".chart .data", function(e){

      const index = $(this).attr('data-index');
      const $chart = $(this).closest('.chart');
      
      if($chart.find('.range[data-index="'+index+'"]').length){

        $chart.find('.line[data-index="'+index+'"]').addClass('invert');
        $chart.find('.range[data-index="'+index+'"]').addClass('show');
      }
    }).on("mouseleave", ".chart .data", function(e){

      const $chart = $(this).closest('.chart');
      $chart.find('.range.show').removeClass('show');
      $chart.find('.line.invert').removeClass('invert');
    });
  */
}

export default vmChart;