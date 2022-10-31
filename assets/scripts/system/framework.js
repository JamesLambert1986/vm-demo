document.addEventListener("DOMContentLoaded", function() {

  var isIE = false;

  if(navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0)
    isIE = true

  if (!isIE && window.location.href.indexOf("/framework/") > -1 ){

    var hitSplit = false;
    var timer;

    window.location.href.split("/").forEach(function (item) {
      
      if(hitSplit == true){

        let link = document.querySelector('a[href="#'+item+'"]');
        link.click();

        hitSplit = false;
      }

      if(item == "framework"){
        hitSplit = true;
      }
    });

    // #region Trigger animations on page /framework/styles/motion and the component stages
    document.addEventListener('click', function(e){
      // loop parent nodes from the target to the delegation node
      for (var target = e.target; target && target != this; target = target.parentNode) {

        if (target.matches('[data-animation]:not(.action--stop)')) {

          e.preventDefault();

          let toAnimate = document.getElementById(target.getAttribute('data-animation'));
          let time = target.getAttribute('data-animation-time');
          let svgWrapper = target.querySelector('.svg__wrapper');

          if(svgWrapper != null)
            svgWrapper.classList.add('svg__wrapper--alt');
    
          toAnimate.classList.add('animate');
          target.classList.add('action--stop');

          timer = setTimeout(function(){ 

            if(svgWrapper != null)
              svgWrapper.classList.remove('svg__wrapper--alt');
      
            toAnimate.classList.remove('animate');
            target.classList.remove('action--stop');
    
          }, (time*1000) + 1000);

          break;
        }
        else if (target.matches('.action--stop[data-animation]')) {

          e.preventDefault();
          let toAnimate = document.getElementById(target.getAttribute('data-animation'));
          let svgWrapper = target.querySelector('.svg__wrapper');

          if(svgWrapper != null)
            svgWrapper.classList.remove('svg__wrapper--alt');
    
          toAnimate.classList.remove('animate');
          target.classList.remove('action--stop');

          clearTimeout(timer);

          break;
        }
        else if (target.matches('[data-animation-stage]:not(.action--stop)')) {

          e.preventDefault();
          let stage = document.querySelector('.system-stage');
          let time = target.getAttribute('data-animation-time');
          let svgWrapper = target.querySelector('.svg__wrapper');

          if(svgWrapper != null)
            svgWrapper.classList.add('svg__wrapper--alt');

          
          stage.classList.add('animate');

          Array.from(stage.querySelectorAll(':scope > .container')).forEach((arrayElement, index) => {
            arrayElement.classList.add('not-inview');
          });

          target.classList.add('action--stop');

          setTimeout(function(){

            Array.from(stage.querySelectorAll(':scope > .container')).forEach((arrayElement, index) => {
              arrayElement.classList.remove('not-inview');
              arrayElement.classList.add('inview');
            });

          }, 1000);

          timer = setTimeout(function(){

            if(svgWrapper != null)
              svgWrapper.classList.remove('svg__wrapper--alt');

            stage.classList.remove('animate');
            Array.from(stage.querySelectorAll(':scope > .container')).forEach((arrayElement, index) => {
              arrayElement.classList.remove('not-inview');
              arrayElement.classList.remove('inview');
            });

            target.classList.remove('action--stop');
    
          }, (time*1000) + 1000 + 1000);

          break;
        }
        else if (target.matches('.action--stop[data-animation-stage]')) {

          e.preventDefault();
          let stage = document.querySelector('.system-stage');
          let svgWrapper = target.querySelector('.svg__wrapper');
          
          if(svgWrapper != null)
            svgWrapper.classList.remove('svg__wrapper--alt');

          stage.classList.remove('animate');
          Array.from(stage.querySelectorAll(':scope > .container')).forEach((arrayElement, index) => {
            arrayElement.classList.remove('not-inview');
            arrayElement.classList.remove('inview');
          });

          target.classList.remove('action--stop');

          clearTimeout(timer);

          break;
        }
      }
    }, false);
  // #endregion
  }


  // #region Component Variant switcher
  document.addEventListener('change', function(e){
    // loop parent nodes from the target to the delegation node
    for (var target = e.target; target && target != this; target = target.parentNode) {

      if (target.matches('.url-switcher')) {

        window.location.href = target.value;
        
        break;
      }
    }
  }, false);
  // #endregion

  // #region Background switcher
  document.addEventListener('change', function(e){
    // loop parent nodes from the target to the delegation node
    for (var target = e.target; target && target != this; target = target.parentNode) {

      if (target.matches('.background-picker select')) {

        let stage = target.getAttribute('data-stage');
        let bg = target.value;

        let preview = document.getElementById(stage+'--stage--preview');

        preview.className = preview.className.replace(/(^|\s)bg-\S+/g, '');
        
        preview.classList.add(bg);

        break;
      }
    }
  }, false);
  // #endregion


  
  // #endregion

  // #region Pattern switcher
  document.addEventListener('change', function(e){
    // loop parent nodes from the target to the delegation node
    for (var target = e.target; target && target != this; target = target.parentNode) {

      if (target.matches('.pattern-switcher')) {

        let selectID = target.getAttribute('id');
        let patternStage = document.getElementById('pattern--stage');
        let value = target.value;

        switch(selectID) {
          case "pattern-number":
            
            Array.from(patternStage.querySelectorAll('.pattern:not(.pattern--'+value+')')).forEach((arrayElement, index) => {
              
              arrayElement.classList.add('d-none')
            });
        
            patternStage.querySelector('.pattern--'+value).classList.remove('d-none');

            break;
          case "pattern-size":
            
            Array.from(patternStage.querySelectorAll('.pattern')).forEach((arrayElement, index) => {
              
              arrayElement.classList.remove('pattern--xs')
              arrayElement.classList.remove('pattern--sm')
              arrayElement.classList.remove('pattern--lg')
              arrayElement.classList.remove('pattern--xl')
              arrayElement.classList.remove('pattern--xxl');

              if(value != "default")
                arrayElement.classList.add('pattern--'+value);
            });

            break;
          case "pattern-transform":

            Array.from(patternStage.querySelectorAll('.pattern')).forEach((arrayElement, index) => {
                
              arrayElement.classList.remove('pattern--vertical')
              arrayElement.classList.remove('pattern--diagonal-left')
              arrayElement.classList.remove('pattern--diagonal-right')
              arrayElement.classList.remove('pattern--xl')
              arrayElement.classList.remove('pattern--xxl');

              if(value != "default")
                arrayElement.classList.add('pattern--'+value);
            });

            break;
          default:
            // code block
        }

        break;
      }
    }
  }, false);
  // #endregion

});