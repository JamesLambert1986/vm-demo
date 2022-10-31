/** 
 * Global helper functions to help maintain and enhance framework elements.
 * @module vmHelpers 
 */

/**
 * Add global classes used by the CSS and later JavaScript.
 * @param {HTMLElement} body Dom element, this doesn't have to be the body but it is recommended.
 */
const addBodyClasses = (body) => {
  
  body.classList.add("js-enabled");

  setTimeout(function(){
    body.classList.add("animate");
  }, 300);

  if(navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0){
    
    body.classList.add("ie");
  }

  return null
}

/**
 * Check if an element contains certain elements that needs enhancing with the JavaScript helpers, it is recommended to do this on the page body after the dom is loaded. Elements that are loaded via ajax should also run this function. 
 * @param {HTMLElement} element Dom element, this doesn't have to be the body but it is recommended.
 */
const checkElements = (element) => {

  // Check for list anchors
  Array.from(element.querySelectorAll('.list-anchors')).forEach((arrayElement, index) => {
    enhanceListAnchor(arrayElement);
  });

  // check for unaccessible headings
  Array.from(element.querySelectorAll('h1')).forEach((arrayElement) => {

    if(arrayElement.querySelectorAll('span:not([aria-hidden="true"])').length){

      accessibleHeading(arrayElement);
    }
  });

  // Add contains image class to containers of images
  Array.from (element.querySelectorAll('.container--split .row > [class*="col"]')).forEach(arrayElement => {

    if(arrayElement.querySelectorAll('img').length){

      arrayElement.classList.add('contains-img');
    }
  });

  Array.from(element.querySelectorAll('.pattern')).forEach(arrayElement => createPattern(arrayElement));
  
  // Create icons
  Array.from(element.querySelectorAll('[data-icon]:not([data-icon=""])')).forEach(arrayElement => createIcon(arrayElement));

  // Observe
  Array.from(element.querySelectorAll('.dynamic')).forEach((arrayElement, index) => {
    observeDynamic(arrayElement);
  });


  // Tables
  Array.from(element.querySelectorAll('table')).forEach((table, index) => {

    tableWrap(table);

    if(table.classList.contains('table-stacked'))
      tableStacked(table);
  });

  Array.from(element.querySelectorAll('table.table-stacked')).forEach((table, index) => {
    tableStacked(table);
  });

  // Add pattern
  if(element.classList.contains('pattern')){
    createPattern(element);
  }

  // Tooltips
  Array.from(element.querySelectorAll('.tooltip')).forEach((tooltip, index) => {
    
    tooltip.setAttribute('tabindex','0');
    tooltip.setAttribute('role','button');
  });

  // Bespoke lists

  Array.from(element.querySelectorAll('.list-bespoke')).forEach((list, index) => {
    
    addListBespoke(list);
  });
  

  fixCollapses(element);
  trigger(element);
}

/**
 * Fix headings by supplying a screen reader friendly span with all inner HTML tags removed.
 * @param {HTMLElement} element Dom element
 */
const accessibleHeading = (element) => {

  element.innerHTML = `<span class="sr-only">${element.innerText}</span><span aria-hidden="true">${element.innerHTML}</span>`;
}

/**
 * Create a SVG element from a data attribute. Used to get round system limitations of content management systems.
 * @param {HTMLElement} element Dom element with selector of [data-icon]:not([data-icon=""]
 */
const createIcon = (element) => {

  if(!element.matches('[data-icon]:not([data-icon=""]'))
    return false;

  if(element.querySelectorAll('.svg__wrapper').length)
    return false;

  let iconFile = element.getAttribute('data-icon');
  let iconPos = 'right';
  let iconTitle = '';

  // Work out the position of the icon
  if(element.classList.contains('btn') || element.hasAttribute('data-icon-left'))
    iconPos = 'left';

  if(element.hasAttribute('data-icon-right'))
    iconPos = 'right';

  // Set the title of the Icon
  if(element.hasAttribute('data-icon-title'))
    iconTitle = '<title>' + element.getAttribute('icon-title') + '</title>';

  // Create dom element
  var icon = document.createElement('div');
  icon.setAttribute("class", "svg__wrapper");
  icon.innerHTML = `<svg>${iconTitle}<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="${iconFile}"></use></svg>`

  // Add the icon to either the start or end of the element
  if(iconPos == "left")
    element.insertBefore(icon, element.firstChild);
  else
    element.appendChild(icon);
}

/**
 * Create the SVG element needed to display pattern from assessing the classes assigned to the element.
 * @param {HTMLElement} element Dom element
 */
const createPattern = (element) => {

  if(element.querySelectorAll('.pattern__inner').length)
    return false;

  //let patternFile = element.getAttribute('data-icon');
  let patternLocation = "/assets/svg/";
  let pattern = "pattern-1";

  if(document.body.hasAttribute('data-assets-folder')){
    patternLocation = document.body.getAttribute('data-assets-folder')+"/svg/";
  }
  
  if(element.classList.contains('pattern--2')){
    pattern = 'pattern-2';
  }
  else if(element.classList.contains('pattern--3')){
    pattern = 'pattern-3';
  }
  else if(element.classList.contains('pattern--giving')){
    pattern = 'pattern-giving';
  }

  let inner = document.createElement("div")
  inner.className = "pattern__inner"
  inner.innerHTML = `<svg viewBox="0 0 1600 320"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="${patternLocation}pattern.svg#${pattern}"></use></svg>`;
  element.appendChild(inner);
}

/**
 * Enhance lists with the selector of .list-anchors, assigning correct attributes and creating the anchor svg icon element.
 * @param {HTMLElement} element Dom element matching selector of .list-anchors
 */
const enhanceListAnchor = (element) => {

  Array.from(element.querySelectorAll('li a[href^="#"]')).forEach((link, index) => {
    
    let iconLocation = "/assets/svg/";
  
    if(document.body.hasAttribute('data-assets-folder')){
      iconLocation = document.body.getAttribute('data-assets-folder')+"/svg/";
    }

    link.setAttribute('data-icon',iconLocation+"rebrand-ui.svg#anchor");
    createIcon(link);
    link.setAttribute('data-trigger',"scroll");
  });
}

/**
 * Creates an event to observe changes to elements with a .dynamic class, 
 * @param {HTMLElement} element Dom Element
 */
const observeDynamic = (element) => {

  let options = {
    characterData: true,
    childList: true
  },
  observer = new MutationObserver(mCallback);

  function mCallback(mutations) {
    for (let mutation of mutations) {
      if (mutation.type === 'characterData' || mutation.type === 'childList') {

        mutation.target.classList.add('updated');
        setTimeout(function (){

          mutation.target.classList.remove('updated');
        },500);
      }
    }
  }

  observer.observe(element, options);
}

/**
 * Wrap tables with a table wrapper div to help maintain its responsive design.
 * @param {HTMLElement} table Dom table element
 */
const tableWrap = (table) => {
  
  if(!table.parentNode.classList.contains('table__wrapper')){

    const tableHTML = table.outerHTML;

    table.outerHTML = `<div class="table__wrapper">${tableHTML}</div>`;
  }
}

/**
 * Creates data attributes to be used by the CSS for mobile views.
 * @param {HTMLElement} table Dom table element
 */
const tableStacked = (table) => {

  const colHeadings = Array.from(table.querySelectorAll('thead th'));
  const colRows = Array.from(table.querySelectorAll('tbody tr'));

  colRows.forEach((row, index) => {

    const cells = Array.from(row.querySelectorAll('th, td'));
    
    cells.forEach((cell, cellIndex) => {

      const heading = colHeadings[cellIndex];
      if(typeof heading != "undefined"){

        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = heading.innerHTML;
        let headingText = tempDiv.textContent || tempDiv.innerText || "";
        cell.setAttribute('data-col',headingText);
      }
    });
  });
}

/**
 * Enhance bootstraps default collapse functionality by adding extra classes to define when its opening and closing.
 * @param {HTMLElement} element Dom element
 */
const fixCollapses = (element) => {

  // Add a collapsed class
  var arrCollapseLinks = Array.from(element.querySelectorAll('[data-toggle="collapse"]'));
  arrCollapseLinks.forEach((link, index) => {
    
    link.setAttribute('data-bs-toggle','collapse');
    link.classList.add('collapsed');
  });

  // Use the new bootstrap selector
  var arrCollapseParents = Array.from(element.querySelectorAll('[data-parent]'));
  arrCollapseParents.forEach((link, index) => {
    let parentID = link.getAttribute('data-parent');
    link.setAttribute('data-bs-parent',parentID);
  });

  // Add extra classes
  var arrCollapses = Array.from(document.querySelectorAll('.collapse'));
  arrCollapses.forEach((collapse, index) => {
    
    collapse.addEventListener('show.bs.collapse', function(e){
      
      collapse.classList.add('opening');

      if(typeof window.dataLayer === "undefined"){ window.dataLayer = []; }
      dataLayer.push({
        "event": "Collapse DIV Opened",
        "data": {
          "id": collapse.getAttribute('id')
        }
      });
    }, false);

    collapse.addEventListener('shown.bs.collapse', function(e){
      
      collapse.classList.remove('opening');

      // Lazy load images
      Array.from(collapse.querySelectorAll('[data-collapse-src]')).forEach(img => img.setAttribute('src',img.getAttribute('data-collapse-src')));

    }, false);
    
    collapse.addEventListener('hide.bs.collapse', function(e){
      
      collapse.classList.remove('show-onload');
      collapse.classList.add('closing');

      if(typeof window.dataLayer === "undefined"){ window.dataLayer = []; }
      dataLayer.push({
        "event": "Collapse DIV Closed",
        "data": {
          "id": collapse.getAttribute('id')
        }
      });
    }, false);
    collapse.addEventListener('hidden.bs.collapse', function(e){
      
      collapse.classList.remove('closing');
    }, false);
  });
  
}

/**
 * Lists with the class of .list-bespoke need extra markup to create bespoke counters
 * @param {HTMLElement} list Dom element
 */
const addListBespoke = (list) => {

  // If there are already counters then return false
  if(Array.from(list.querySelectorAll('.list__counter')).length !== 0)
    return false;
  
  // Add the required html
  Array.from(list.querySelectorAll('li')).forEach((item, index) => {

    const itemContent = item.innerHTML,
          itemClass   = item.getAttribute('data-counter-class') || list.getAttribute('data-counter-class');

    item.innerHTML = `<span class="list__counter ${itemClass}"></span><span class="list__content">${itemContent}</span>`;
  });
}

/**
 * Enhance elements with extra functions by triggering actions on click or on change.
 * @param {HTMLElement} element Dom element
 */
const trigger = (element) => {

  var matches = function(el, selector) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
  };

  var triggerFunction = function (event,element){

    // If a user click on a select it shouldn't trigger anything, its only when the selection has been changed is should trigger something
    if(matches(element, 'select') && event.type == "click"){ return false; }


    let triggerAction = element.getAttribute('data-trigger');
    let triggerSelector = element.getAttribute('data-trigger-selector');

    if(triggerSelector === null){
      triggerSelector = element.getAttribute('href');
    }


    let toTrigger = document.querySelector(triggerSelector);

    // Combined with an IF statement
    if(element.getAttribute('data-trigger-if') != null && element.getAttribute('data-trigger-if') != element.value){ 
      
      if(triggerAction == "show")
        triggerAction = "close";
      else
        return false; 
    }

    // If the triggered element exists lets decide what to do with it
    if(toTrigger != null){

      toTrigger.blur();
      switch(triggerAction) {
        
        case "show": {

          toTrigger.classList.add('show');

          // Fix the original button if there is one
          let collapseBtn = document.querySelector("[href='#"+toTrigger.getAttribute('id')+"']");
          if(collapseBtn != null)
            collapseBtn.classList.remove('collapsed');

          break; 
        }
        case "close": {

          toTrigger.classList.remove('show');
          
          // Fix the original button if there is one
          let collapseBtn = document.querySelector("[href='#"+toTrigger.getAttribute('id')+"']");
          if(collapseBtn != null)
            collapseBtn.classList.add('collapsed');

          break; 
        }
        case "class": {

          toTrigger.classList.add(element.getAttribute('data-trigger-class'));
          
          break; 
        }
        case "scroll": {
          
          toTrigger.scrollIntoView({behavior: "smooth"})

          break; 
        }
        case "multi-collapse": {
          
          if(element.classList.contains('active')){

            element.classList.remove('active');
            toTrigger.classList.remove('show')
          }
          else {
            
            var buttons = Array.from(document.querySelectorAll('[href="#'+toTrigger.getAttribute('id')+'"], [data-trigger-selector="'+toTrigger.getAttribute('id')+'"]'));
            buttons.forEach((button, index) => {
              button.classList.remove('active');
            });
            element.classList.add('active');
            toTrigger.classList.add('show')
          }

          break; 
        }
        default: {

          toTrigger.dispatchEvent(new Event(triggerAction));
          break;
        }
      }
    }
  } // end:triggerFunction

  element.addEventListener('click', function(e){
    // loop parent nodes from the target to the delegation node
    for (var target = e.target; target && target != this; target = target.parentNode) {
  
      if (target.matches('[data-trigger]')) {
        e.preventDefault();
  
        triggerFunction(e,target);
        break;
      }
    }
  }, false);
  element.addEventListener('change', function(e){
    // loop parent nodes from the target to the delegation node
    for (var target = e.target; target && target != this; target = target.parentNode) {
  
      if (target.matches('[data-trigger]')) {

        triggerFunction(e,target);
        break;
      }
    }
  }, false);
}

export {
  addBodyClasses,
  checkElements,
  accessibleHeading,
  createIcon,
  createPattern,
  enhanceListAnchor,
  observeDynamic,
  tableWrap,
  tableStacked,
  fixCollapses,
  addListBespoke
}