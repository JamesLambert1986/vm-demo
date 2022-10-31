/**
 * Enhance the modal component which works with CSS :target with JavaScript to improve the functionality.
 */
class vmModal {
  /**
   * @param {HTMLElement} button dom element, the button/link to trigger the model being opened.
   * @param {string} type The type of modal being created
   */
  constructor(button,type = "default"){

    const closeModal = this.closeModal;
    let modalID = button.getAttribute('href').replace('#','');

    if(type == "image"){
      
      let caption = "";
      
      if(button.hasAttribute("data-image-caption")){
        caption = button.getAttribute("data-image-caption");
      }

      modalID = this.createImageModal(button.getAttribute('href'),caption);
    }
    else if(type == "youtube"){
      
      modalID = this.createYoutubeModal(button.getAttribute('data-id'));
    }

    let modal = document.getElementById(modalID);

    if(document.getElementById('modal-img')){
      this.openModal(modal);
    }

    if(document.getElementById('modal-youtube')){
      this.openModal(modal);
    }
    this.openModal(modal);
    // Set close event handlers

    modal.addEventListener('click', function(e){
      // loop parent nodes from the target to the delegation node
      for (var target = e.target; target && target != this; target = target.parentNode) {
    
        if (target.matches('[data-modal-close]')) {
          e.preventDefault();
    
          closeModal(modal);      
          break;
        }
      }
    }, false);

    document.addEventListener('keyup', function(e){
      if (e.key === "Escape") { // escape key maps to keycode `27`
        
        closeModal(modal);  
      }
    }, false);
  }

  /**
   * Create a modal dynamically with an image
   * @param {string} image Image source
   * @param {string} caption Optional caption
   * @returns {string} modal ID
   */
  createImageModal(image,caption){

    if(document.getElementById('modal-img')){

      var currentModal = document.getElementById("modal-img");
      currentModal.parentNode.removeChild(currentModal);
    }

    var elem = document.createElement('div');
    elem.setAttribute("id", "modal-img");
    elem.setAttribute("class", "modal modal--image target");
    elem.setAttribute("role", "dialog");
    elem.setAttribute("aria-label", caption);

    if(caption != "")
      elem.innerHTML = `<a href="#modal-img" class="modal__overlay" tabindex="-1" data-modal-close="">
      <span class="sr-only">Close Modal</span></a>
      <div class="modal__inner">
      <figure class="figure--caption-overlay"><img src="${image}" alt="" /><figcaption>${caption}</figcaption></figure>
    </div>`;
    else
      elem.innerHTML = `<a href="#modal-img" class="modal__overlay" tabindex="-1" data-modal-close="">
      <span class="sr-only">Close Modal</span></a>
      <div class="modal__inner"><img src="${image}" alt="" class="mb-0" /></div>`;

    document.body.appendChild(elem);

    return "modal-img";
  }

  /**
   * Create a model with the correct markup needed for a YouTuvbe embed to be created via a separate function.
   * @param {string} videoId YouTube video ID
   * @returns {string} modal ID
   */
  createYoutubeModal(videoId){

    if(document.getElementById('modal-youtube')){

      var currentModal = document.getElementById("modal-youtube");
      currentModal.parentNode.removeChild(currentModal);
    }

    var elem = document.createElement('div');
    elem.setAttribute("id", "modal-youtube");
    elem.setAttribute("class", "modal modal--large target");
    elem.setAttribute("role", "dialog");
    elem.setAttribute("aria-label", "Embedded Youtube Video");
    elem.innerHTML = `<a href="#modal-youtube" class="modal__overlay" tabindex="-1" data-modal-close=""><span class="sr-only">Close Modal</span></a>
          <div class="modal__inner">
            <div class="youtube-embed mb-0">
              <div class="youtube-embed__inner">
              <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" data-id="${videoId}" id="modal-youtube-trigger"><img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" alt=""></a>
            </div>
          </div>`;

    document.body.appendChild(elem);

    return "modal-youtube";
  }

  /**
   * Open the modal by adding classes to the HTML tag and the modal.
   * @param {HTMLElement} modal dom element
   */
  openModal(modal){
    
    let modalInner = modal.querySelector('.modal__inner');
    // Fix z-indexes on the page
    document.documentElement.classList.add("modal--active");

    // Prevent items on page that are not in the  modal being tabbed
    Array.from(document.querySelectorAll('a,button,select,.tooltip,input,textarea')).forEach((element, index) => {
      
      let currentTabIndex = element.getAttribute('tabindex');

      if(currentTabIndex != null)
        element.setAttribute('data-tabindex',currentTabIndex);

      element.setAttribute('tabindex','-1');
    });

    // Enable tabbing on items inside the modal
    Array.from(modalInner.querySelectorAll('a,button,select,.tooltip,input,textarea')).forEach((element, index) => {
      
      element.setAttribute('tabindex','1');
    });

    // Apply the open styles
    modal.classList.add('target');

    // Data Layer Event
    if(typeof window.dataLayer === "undefined"){ window.dataLayer = []; }
    dataLayer.push({
      "event": "Modal opened",
      "data": {
        "id": modal.getAttribute('id')
      }
    });
  }

  /**
   * Close the modal, tidy up anything that was set in the open modal function.
   * @param {HTMLElement} modal dom element
   */
  closeModal(modal){

    let modalInner = modal.querySelector('.modal__inner');
    document.documentElement.classList.remove("modal--active");

    // Prevent items on page that are not in the  modal being tabbed
    Array.from(document.querySelectorAll('a,button,select,.tooltip,input,textarea')).forEach((element, index) => {
      /*
      let currentTabIndex = element.getAttribute('data-tabindex');

      if(currentTabIndex != null)
        element.setAttribute('tabindex',currentTabIndex);
      else
        element.removeAttribute('tabindex')

      element.removeAttribute('data-tabindex') 
      */
    });

    // Enable tabbing on items inside the modal
    Array.from(modalInner.querySelectorAll('a,button,select,.tooltip,input,textarea')).forEach((element, index) => {
      
      //element.removeAttribute('tabindex');
    });

    // Apply close styles
    modal.classList.remove('target');

    // Data Layer Event
    if(typeof window.dataLayer === "undefined"){ window.dataLayer = []; }
    dataLayer.push({
      "event": "Modal closed",
      "data": {
        "id": modal.getAttribute('id')
      }
    });

    // If a YouTube modal or an image modal is open we want to delete it
    if(document.getElementById('modal-youtube')){

      var currentModal = document.getElementById("modal-youtube");
      
      
      var videoId = currentModal.querySelector('iframe').getAttribute('data-id');

      // Data Layer Event
      if(typeof window.dataLayer === "undefined"){ window.dataLayer = []; }
      dataLayer.push({
        "event": "Youtube video state change",
        "data": {
          "video": videoId,
          "state": "closed"
        }
      });

      // Delete the modal as its on each click event
      currentModal.parentNode.removeChild(currentModal);
      
    }
    else if(document.getElementById('modal-img')){

      // Delete the modal as its on each click event
      var currentModal = document.getElementById("modal-img");
      currentModal.parentNode.removeChild(currentModal);
    }
  }
}

export default vmModal;