/**
 * vmTabs uses the default bootstrap collapse functionality but with some minor extensions. Most notibly the first tab being opened on page load (or the one matching the hash).
 *
 */
class vmTabs {
  /**
   * Constructor method that extends the default functionality by adding extra actions to the collapse events.
   * @constructs vmTabs
   * @param {HTMLElement} tabs The dom element with the class of .tabs
   * @param {boolean} keepHistory Maintain the history of the tabs using the hash
   */
  constructor(tabs, keepHistory = true){

    const tabLinks = tabs.querySelectorAll('.tab a');
    const openFirstTab = this.openFirstTab;
    const openTab = this.openTab;
    const tabsContainer = tabs.parentNode;
    
    // Open the first tab or what the hash value matches
    let targetId = tabLinks[0].getAttribute('href').replace('#','');

    if(tabs.querySelector('[data-toggle="collapse"][href="'+window.location.hash+'"]') != null)
      targetId = window.location.hash.replace('#','');

    openFirstTab(tabs,targetId);
    

    // Tabs should show the content as soon as a link is clicked
    var arrTabPanels = Array.from(document.querySelectorAll('.tabpanel'));
    arrTabPanels.forEach((tabPanel, index) => {
      
      tabPanel.addEventListener('show.bs.collapse', function(e){
        
        openTab(tabPanel,keepHistory);
        
      }, false);
    });

    // If the pagination buttons are used the hidden tabs navigation is triggered instead of relying on the hash change trigger.
    tabsContainer.addEventListener('click', function(e){
        
      for (var target = e.target; target && target != this; target = target.parentNode) {

        if (target.matches('.pagination__next, .pagination__previous')) {
          
          e.preventDefault();
          const tabID = target.getAttribute('href').replace('#','');

          // Trigger the tab link
          let tabLink = tabs.querySelector('.tabs [data-toggle="collapse"][href="#'+tabID+'"]');
          //tabLink.click();

          let tabPanel = document.getElementById(tabID);
          openTab(tabPanel, false);

          // Pagination buttons are at the bottom of the current tab panels content, so we want to scroll back to the top of the container.
          setTimeout(function(){

            const windowTop = window.pageYOffset;
            const WindowBottom = windowTop + window.innerHeight;
            const rect = tabsContainer.getBoundingClientRect();
            const elOffsetTop = rect.top - 100;

            if(elOffsetTop < 0 || elOffsetTop > WindowBottom){
              

              window.scroll({
                top: (windowTop + elOffsetTop), 
                left: 0, 
                behavior: 'smooth'
              });
              
            }

            history.replaceState(null, null, "#"+tabID);
          },300);

          break;
        }
      }
    }, false);
  }

  /**
   * Open a tab by passing the ID of tab panel.
   * @param {HTMLElement} tabs Dom element of the tabs element
   * @param {string} tabID ID of dom tab panel we want to open.
   */
  openFirstTab(tabs,tabID){

    let tabPanel = document.getElementById(tabID);
    let link = document.querySelector('[data-toggle="collapse"][href="#'+tabID+'"]');

    link.classList.remove('collapsed');
    tabPanel.classList.add('show');
  }

  /**
   * Make sure a tab is opened correctly.
   * @param {HTMLElement} tabPanel ID of dom tab panel we want to open.
   * @param {boolean} keepHistory Maintain the history of the tabs using the hash
   */
  openTab(tabPanel,keepHistory = true){

    const id = tabPanel.getAttribute('id');
    const parent = tabPanel.getAttribute('data-parent');

    // Close open tabs
    Array.from(document.querySelectorAll('.content-list a')).forEach((element, index) => {
      
      element.classList.add('collapsed');
    });
    Array.from(document.querySelectorAll('.content-list [href="#'+id+'"]')).forEach((element, index) => {
      
      element.classList.remove('collapsed');
    });
    // Close open tabs
    Array.from(document.querySelectorAll('.tabs--content ~ [data-bs-parent="'+parent+'"]')).forEach((element, index) => {
      
      element.classList.remove('show');
    });

    // Show class added straght away and not after the default transition
    tabPanel.classList.add('show');
    tabPanel.setAttribute('tabindex','-1');

    // Set the focus into the tab panel
    let tabPanelFocus = document.getElementById(id);
    setTimeout(function () {
        tabPanelFocus.focus();
    }, 50);

    // If we want to maintain the history of the page we want to make sure that the hash of the opened tab is set within the history.
    if(window.history && keepHistory) {

      history.replaceState(null, null, "#"+id);
    }

    return null;
  }
}

export default vmTabs;
