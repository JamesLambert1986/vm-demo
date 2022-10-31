/** Enhance input fields to improve the functionality and appearance. */
class vmInput {
  /** @param {HTMLElement} inputWrapper dom element .form-group */
  constructor(inputWrapper){

    let inputField = inputWrapper.querySelector('input');

    if(inputField){
      
      // Prefix or Suffix
      if (inputWrapper.matches('[data-prefix]') || inputWrapper.matches('[data-suffix]')) {
        this.addPrefixSuffix(inputWrapper,inputField);
        // Recreate the input field after its been modified, data prefix seems to disconnect it
        inputField = inputWrapper.querySelector('input');
      }

      if (inputField.matches('[maxlength][data-autotab]'))
        this.autoTab(inputWrapper,inputField);
      else if (inputField.matches('[maxlength]'))
        this.maxLength(inputWrapper,inputField);
      
      if (inputField.classList.contains('option-1') || inputField.classList.contains('option-2') || inputField.classList.contains('option-3') || inputField.classList.contains('option-4') || inputField.classList.contains('option-5'))
        this.hiddenRequired(inputWrapper,inputField);
    
      if (inputWrapper.matches('.form-group--range'))
        this.inputRange(inputWrapper,inputField);
      
      if (inputWrapper.matches('.form-group--stepper'))
        this.inputStepper(inputWrapper,inputField);

      if (inputWrapper.matches('.form-group--password'))
        this.inputPassword(inputWrapper,inputField);
    }
  }

  /**
   * Wrap the input field in a wrapper to help control the visual of the prefix or suffix.
   * @param {HTMLElement} inputWrapper dom element .form-group
   * @param {HTMLElement} inputField dom element input fiedld
   */
  addPrefixSuffix(inputWrapper,inputField){
    
    let inputHTML = inputField.outerHTML;

    // Data prefix
    if (inputWrapper.matches('[data-prefix]')) {

      const prefix = inputWrapper.getAttribute('data-prefix');
      inputField.outerHTML = '<span class="form-control__wrapper" data-prefix="'+prefix+'">'+inputHTML+'</span>';
    }

    // Data suffix
    if (inputWrapper.matches('[data-suffix]')) {

      const suffix = inputWrapper.getAttribute('data-suffix');
      inputField.outerHTML = '<span class="form-control__wrapper" data-suffix="'+suffix+'">'+inputHTML+'</span>';
    }
  }
  
  /**
   * Prevent too many characters being added to the input field.
   * @param {HTMLElement} inputWrapper dom element .form-group
   * @param {HTMLElement} inputField dom element input fiedld
   */
  maxLength(inputWrapper,inputField){
    inputField.addEventListener('keydown', (e) => {
      const maxlength = inputField.getAttribute("maxlength");
      if (inputField.value.length >= maxlength && e.which != 9 && e.which != 16){
        e.preventDefault();
      }
    });
  }

  /**
   * Used for form groups like sort codes and date of births. Improving the UX of not having to tab between the fields that are directly related.
   * @param {HTMLElement} inputWrapper dom element .form-group
   * @param {HTMLElement} inputField dom element input fiedld
   * @returns {Boolean} Whether the function has ran or not
   */
  autoTab(inputWrapper,inputField){

    if(inputWrapper.querySelectorAll('input').length <= 1)
      return false;

    let arrInputs = Array.from(inputWrapper.querySelectorAll('input'));
    arrInputs.forEach((input, index) => {
      
      // Set the focus on the next input field
      input.addEventListener('keyup', (e) => {
      
        const maxlength = input.getAttribute("maxlength");

        if (input.value.length >= maxlength && typeof arrInputs[index+1] != "undefined" && e.which != 8 && e.which != 9 && e.which != 16 && e.which != 46)
          arrInputs[index+1].focus();
      });

      // Prevent too many characters being added to the input field.
      input.addEventListener('keydown', (e) => {
        const maxlength = input.getAttribute("maxlength");

        if (input.value.length >= maxlength && e.which != 8 && e.which != 9 && e.which != 16 && e.which != 46)
          e.preventDefault();
      });
    });

    return true;
  }
  
  /**
   * Remove required attributes on input fields when they are being hidden inside of a conditional reveal. To prevent users getting stuff on a form because the error message is hidden.
   * @param {HTMLElement} inputWrapper dom element .form-group
   * @param {HTMLElement} inputField dom element input fiedld
   */
  hiddenRequired(inputWrapper,inputField){

    // Make sure a data-required attribute is added so we know what inputs need the required attribute to be toggled.
    Array.from(inputWrapper.querySelectorAll('.option-content [required]')).forEach((input, index) => {
      
      input.setAttribute('data-required','true');

      if(input.offsetTop == 0)
        input.removeAttribute('required');
    });

    // Update the attributes whenever an input in the form group is changed.
    inputWrapper.addEventListener('change', function(e){

      Array.from(inputWrapper.querySelectorAll('.option-content [data-required]')).forEach((input, index) => {
      
        if(input.offsetTop != 0)
          input.setAttribute('required','true');
        else
          input.removeAttribute('required');
      });

    }, false);
  }

  /**
   * To make our Slider elements look and work in the desired way we need to enhance it with JavaScript. Transforming a default input field into dynamic interactable slider input with the correct range of values being allowed.
   * @param {HTMLElement} inputWrapper dom element .form-group
   * @param {HTMLElement} inputField dom element input field
   */
  inputRange(inputWrapper,inputField){

    let label = inputWrapper.querySelector('label');
    let value = inputField.value;
    let min = inputField.getAttribute('min');
    let max = inputField.getAttribute('max');
    let step = inputField.getAttribute('data-step') ? inputField.getAttribute('data-step') : inputField.getAttribute('step');
    let inputID = inputField.getAttribute('id');

    // #region - Create the markers
    // Use the data-markers attribute to dictate what markers get created.
    let markersString = `<div class="js-show" role="presentation">
      <label for="${inputID}-range" class="sr-only">${label.innerHTML}</label>
      <input type="range" class="custom-range" name="${inputID}-range" id="${inputID}-range" value="${value}" min="${min}" max="${max}" step="${step}" />
      <div class="custom-range__markers">`;

    let markers = inputWrapper.getAttribute('data-markers').split(',');

    markers.forEach(function(row,index){

      var marker = row.split(':');
      var value = marker[0];
      var label = marker[1];
      var pos = ((value - min) / (max - min)) * 100;

      if(typeof markers[index+1] != "undefined"){

        var next = markers[index+1];
        var nextSplit = next.split(':');
        next = nextSplit[0];

        var nextPos = ((next - min) / (max - min)) * 100;
        var width = nextPos - pos;
      }
      else {
        var width = 0;
      }
      
      markersString += `<div class="marker" style="left: ${pos}%; width: ${width}%;" data-value="${value}"><span class="marker__title small text-muted">${label}</span></div>`;
    });
    markersString += '</div></div>';
    // #endregion
    
    // Add the Markers to the form group
    inputWrapper.innerHTML += markersString;

    /**
     * Update the look of the slider; display the marker region and the track on the slider bar.
     * @param {*} inputWrapper dom element .form-group
     * @param {*} currentField dom element input field
     */
    function updateRange(inputWrapper,currentField){
      
      let value = currentField.value;
      let min = currentField.getAttribute('min');
      let max = currentField.getAttribute('max');
      let percent = (value - min) / (max - min);

      // Sync values
      Array.from(inputWrapper.querySelectorAll('input')).forEach((inputField, index) => {
        inputField.value = value;
      });

      // Check if marker region should be highlighted
      let markers = Array.from(inputWrapper.querySelectorAll('.marker'));
      markers.forEach((marker, index) => {
        
        marker.classList.remove('marker--highlight');
        var markerValue = parseInt(marker.getAttribute('data-value'));
        //
        if(markers[index+1]){
          var markerNextValue = parseInt(markers[index+1].getAttribute('data-value'));
          if(value >= markerValue && value < markerNextValue){
            marker.classList.add('marker--highlight');
          }
        }
        else {
          if(value == markerValue){
            
            markers[index-1].classList.add('marker--highlight');
          }
          else if(value >= markerValue){
            marker.classList.add('marker--highlight');
          }
        }
      });

      // Set percentage of the track on the slider
      inputWrapper.style.setProperty('--percent', (percent*100)+"%");
    }
    updateRange(inputWrapper,inputField);

    // Event listeners to update the range
    inputWrapper.addEventListener('input', function(e){
      
      for (var target = e.target; target && target != this; target = target.parentNode) {

        if (target.matches('input')) {
          
          updateRange(inputWrapper,target)
          break;
        }
      }

    }, false);

    inputWrapper.addEventListener('change', function(e){
      
      for (var target = e.target; target && target != this; target = target.parentNode) {

        if (target.matches('input')) {
          
          updateRange(inputWrapper,target)
          break;
        }
      }

    }, false);
    
  }
  
  /**
   * Enhance number input fields with large external plus and minus buttons.
   * @param {HTMLElement} inputWrapper dom element .form-group
   * @param {HTMLElement} inputField dom element input field
   */
  inputStepper(inputWrapper,inputField){

    var stepperEvent = 'mouseup';
    var stepperStart = 'mousedown';
    var stepperInterval;
    let step = inputField.getAttribute('data-step') ? parseFloat(inputField.getAttribute('data-step')) : parseFloat(inputField.getAttribute('step'));

    if ("ontouchstart" in document.documentElement){
      stepperEvent = 'touchend';
      stepperStart = 'touchstart';
    }

    function addStep(){

      let inputValue = parseFloat(inputField.value);

      if(isNaN(inputValue))
        inputValue = 0;

      if(isNaN(step))
        step = 1;

      inputValue = inputValue + step;
      inputValue = Math.floor(inputValue/step) * step;

      // Don't allow it to go over the max value set
      if(inputField.hasAttribute('max') && inputValue > parseFloat(inputField.getAttribute('max')))
        inputValue = parseFloat(inputField.getAttribute('max'));

      return inputValue;
    }

    function minusStep(){
      
      let inputValue = parseFloat(inputField.value);

      if(isNaN(inputValue))
        inputValue = 0;

      if(isNaN(step))
        step = 1;

      inputValue = inputValue - step;
      inputValue = Math.ceil(inputValue/step) * step;

      // don't let it go under the min value set
      if(inputField.hasAttribute('min') && inputValue < parseFloat(inputField.getAttribute('min')))
        inputValue = parseFloat(inputField.getAttribute('min'));

      return inputValue;
    }

    inputWrapper.addEventListener(stepperStart, function(e){
      // loop parent nodes from the target to the delegation node
      for (var target = e.target; target && target != this; target = target.parentNode) {
    
        if (target.matches('.stepper__plus')) {
          e.preventDefault();
    
          inputField.value = addStep();

          clearInterval(stepperInterval);
          stepperInterval = setInterval(function(){
            
            inputField.value = addStep();
          }, 200);
            
          break;
        }
        else if(target.matches('.stepper__minus')){
          e.preventDefault();
    
          inputField.value = minusStep();

          clearInterval(stepperInterval);
          stepperInterval = setInterval(function(){
            
            inputField.value = minusStep();
          }, 200);
          
          break;
        }
      }
    }, false);


    inputWrapper.addEventListener(stepperEvent, function(e){
      // loop parent nodes from the target to the delegation node
      for (var target = e.target; target && target != this; target = target.parentNode) {
    
        if (target.matches('.stepper__plus, .stepper__minus')) {
          e.preventDefault();
    
          clearInterval(stepperInterval);
          break;
        }
      }
    }, false);
  }
  /**
   * Enhance number input fields with large external plus and minus buttons.
   * @param {HTMLElement} inputWrapper dom element .form-group
   * @param {HTMLElement} inputField dom element input field
   */
  inputPassword(inputWrapper,inputField){


    inputWrapper.addEventListener("click", function(e){
      // loop parent nodes from the target to the delegation node
      for (var target = e.target; target && target != this; target = target.parentNode) {
    
        if (target.matches('button')) {
          e.preventDefault();
          var button = inputWrapper.querySelector('button');
          var orginalText = button.getAttribute('data-text');
          var altText = button.getAttribute('data-alt');
    
          if(inputField.getAttribute('type') == 'password'){

            inputField.setAttribute('type','text');
            button.innerHTML = altText;
          }
          else {

            inputField.setAttribute('type','password');
            button.innerHTML = orginalText;
          }
          
          break;
        }
      }
    }, false);
  }
}

export default vmInput