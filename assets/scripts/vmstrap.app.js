// Bootstrap modules
import Alert from '../bootstrap/js/src/alert'
import Collapse from '../bootstrap/js/src/collapse'

// VM Modules
import vmDataLayer from './modules/vmdatalayer'
import vmScale from './modules/vmscale'
import * as vmHelpers from './modules/vmhelpers'
import vmInview from './modules/vminview'
import vmYoutube from './modules/vmyoutube'
import vmInput from './modules/vminput'
import vmForm from './modules/vmforms'
// VM Component modules
import vmArticleFeed from './modules/vmarticlefeed'
import vmCarousel from './modules/vmcarousel'
import vmTabs from './modules/vmtabs'
import vmAccordion from './modules/vmaccordion'
import vmChart from './modules/vmcharts'
import vmModal from './modules/vmmodal'
import vmResultsList from './modules/vmresultslist'


// Attach classes to dom elements
document.addEventListener("DOMContentLoaded", function() {

  /* Global */
  vmDataLayer();
  vmScale();
  // Add helpers to the page
  vmHelpers.addBodyClasses(document.body);
  vmHelpers.checkElements(document.body);
  vmInview();
  

  /* Elements */
  // youtube
  var arrVideos = Array.from(document.querySelectorAll('.youtube-embed'));
  arrVideos.forEach((arrayElement, index) => {
    new vmYoutube(arrayElement);
  });
  // input fields: needs finishing
  Array.from(document.querySelectorAll('.form-group')).forEach((arrayElement, index) => {
    new vmInput(arrayElement);
  });
  // forms: needs finishing
  var arrForms = Array.from(document.querySelectorAll('form'));
  arrForms.forEach((arrayElement, index) => {
    new vmForm(arrayElement);
  });
  

  /* Component */
  // Article feeds
  var arrArticleFeeds = Array.from(document.querySelectorAll('.article-deck--feed'));
  arrArticleFeeds.forEach((arrayElement, index) => {
    new vmArticleFeed(arrayElement);
  });

  // Article carousel
  var arrCarousel = Array.from(document.querySelectorAll('.carousel__wrapper'));
  arrCarousel.forEach((arrayElement, index) => {
    new vmCarousel(arrayElement);
  });

  // Tabs
  var arrTabs = Array.from(document.querySelectorAll('.tabs'));
  arrTabs.forEach((arrayElement, index) => {
    new vmTabs(arrayElement);
  });

  // Accordions
  Array.from(document.querySelectorAll('.accordion')).forEach((arrayElement, index) => {
    new vmAccordion(arrayElement);
  });


  // charts
  Array.from(document.querySelectorAll('.container--chart')).forEach((arrayElement, index) => {
    new vmChart(arrayElement);
  });

  // Results List
  Array.from(document.querySelectorAll('.results-list')).forEach((arrayElement, index) => {
    new vmResultsList(arrayElement);
  });

});

// Create a Modal only when needed
document.addEventListener('click', function(e){
  // loop parent nodes from the target to the delegation node
  for (var target = e.target; target && target != this; target = target.parentNode) {

    if (target.matches('[data-modal-open]')) {
      e.preventDefault();

      new vmModal(target);      
      break;
    }
    else if (target.matches('[data-modal-image]')) {
      e.preventDefault();

      new vmModal(target,"image");      
      break;
    }
    else if (target.matches('[data-modal-youtube]')) {
      e.preventDefault();


      target.setAttribute('data-id',target.getAttribute('data-modal-youtube'));
      new vmModal(target,"youtube");

      var youTubeModal = document.querySelector('#modal-youtube .youtube-embed');
      new vmYoutube(youTubeModal);
      
      var playBtn = youTubeModal.querySelector('a')
      playBtn.click();
 
      break;
    }
  }
}, false);


// If the hash changes then lets make sure the collapse is opened
window.addEventListener('hashchange', function(e)
{
  if(location.hash.indexOf('#/') == -1){ // Ignore react hash router

    if(document.querySelector('[data-toggle="collapse"][href="'+window.location.hash+'"]') != null){

      e.preventDefault();
      let link = document.querySelector('[data-toggle="collapse"][href="'+window.location.hash+'"]');
      link.click();
    }

    if(typeof window.dataLayer === "undefined"){ window.dataLayer = []; }
    dataLayer.push({
      "event": "Hash change",
      "data": {
        "id": location.hash
      }
    });
  }
});

// Make classes available to external standalone JavaScript
var global = window || global;
global.vmDataLayer = vmDataLayer;
global.vmInview = vmInview;
global.vmScale = vmScale;
global.vmHelpers = vmHelpers;
global.vmArticleFeed = vmArticleFeed;
global.vmCarousel = vmCarousel;
global.vmTabs = vmTabs;
global.vmAccordion = vmAccordion;
global.vmYoutube = vmYoutube;
global.vmInput = vmInput;
global.vmForm = vmForm;
global.vmChart = vmChart;
global.vmResultsList = vmResultsList;