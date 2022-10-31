/**
 * A results list should only show 10 items on page load but also have the option to show more.
 */
class vmResultsList {
  /**
   * Within the constructor all of the items in the results list are hidden using CSS then the first 10 are shown.
   * An event lisener is created to load more result items when the more button is clicked.
   * 
   * @constructs vmResultsList
   * @param {HTMLElement} results - The dom element with the class of .results-list.
   */
  constructor(results){
    const showItems = this.showItems;
    let startItemCount = results.getAttribute('data-show-items') ? parseInt(results.getAttribute('data-show-items')) : 10;
    let items = results.querySelectorAll('li');
    let title = results.querySelector('h2');
    let button = results.querySelector('button');

    title.innerHTML = "Showing <span class='results-list__count'>"+(startItemCount < items.length ? startItemCount : items.length)+"</span> or "+items.length+" results";

    if(startItemCount < items.length){

      items.forEach((item, index) => {
        item.classList.add('d-none');
      });

      showItems(results, startItemCount);

      results.addEventListener('click', function(e){
        // loop parent nodes from the target to the delegation node
        for (var target = e.target; target && target != this; target = target.parentNode) {
          if (target.matches('button')) {

            var itemCount = results.querySelectorAll('li:not(.d-none)').length + startItemCount;

            showItems(results,itemCount);
            break;
          }
        }
      }, false);

      button.classList.remove('d-none');
    }
  }

  showItems(results,showItems = 10){

    let items = results.querySelectorAll('li');
    let button = results.querySelector('button');
    let countDisplay = results.querySelector('.results-list__count');

    countDisplay.innerHTML = (showItems < items.length ? showItems : items.length);

    for (let i = 0; i <= items.length; i++) {
      
      if(i === items.length)
        button.classList.add('d-none');
      else if (i === showItems) 
        break;
      else 
        items[i].classList.remove('d-none');
    }
  }
}

export default vmResultsList;