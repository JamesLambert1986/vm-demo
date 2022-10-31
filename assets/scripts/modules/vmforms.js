/**
 * Validate forms using the default JavaScript Validation API.
 */
class vmForm {

  /** @param {HTMLElement} form dom element */
  constructor(form){

    const validateForm = this.validateForm;
    const disableUntil = this.disableUntil;

    // Turn off the default HTML validation, the default JavaScript validation api is used instead
    form.setAttribute('novalidate','true');

    form.addEventListener('submit', function(e){

      // If jQuery Validate is being used set a timeout before validating
      if(typeof $ === "undefined" || typeof $.validator === "undefined"){

        // Validate form 
        let submit = validateForm(form);
        if(!submit){
          e.preventDefault();
          e.stopPropagation();
        }
      }
      else {
        setTimeout(function(){

          let submitDelay = validateForm(form);
          if(!submitDelay){
            e.preventDefault();
            e.stopPropagation();
          }
        }, 100);
      }

    }, false);

    // Disable buttons until criteria is met
    Array.from(form.querySelectorAll('[data-disabled-until]')).forEach((btn, index) => {
      
      btn.setAttribute('disabled','true');
    });

    // Inline validation for after the form has been submitted at least once
    Array.from(form.querySelectorAll('input, textarea, select')).forEach((input, index) => {
      
      input.addEventListener('keyup', (event) => {
        
        disableUntil(form);

        if(!form.classList.contains('form--submitted'))
          return false;

        setTimeout(function(){ validateForm(form, true); }, 100);
      });

      input.addEventListener('change', (event) => {
        
        disableUntil(form);

        if(!form.classList.contains('form--submitted'))
          return false;

        setTimeout(function(){ validateForm(form, true); }, 100);
      });
    });
  }

  /**
   * Validate the form
   * @param {HTMLElement} form dom element
   * @param {Boolean} inline If inline validation don't create the form summary
   * @returns {Boolean} Whether to submit the form or not
   */
  validateForm(form, inline = false){

    let submit = true;
    let counter = 1;
    let errors = [];

    // Tell the CSS thats it okay to display error messages now as the user has tried to submit
    form.classList.add('form--submitted');

    // Reset error state
    Array.from(form.querySelectorAll('.form-group--error')).forEach((error, index) => {
      
      error.classList.remove('form-group--error');
    });

    Array.from(form.querySelectorAll('.error:not(.field-validation-error)')).forEach((error, index) => {
      
      error.setAttribute('aria-hidden','true');
    });

    // Check each input field for an error
    Array.from(form.querySelectorAll('input:not([disabled]),select:not([disabled]),textarea:not([disabled])')).forEach((input, index) => {
      
      let is_error = false;
      const formGroup = input.closest('.form-group');
      
      // Default JavaScript Validation except for the stepMismatch as this breaks the UX rules for the input steppers.
      if(!input.validity.valid){

        var errorOn = [
          'badInput',
          'customError',
          'patternMismatch',
          'rangeOverflow',
          'rangeUnderflow',
          //'stepMismatch',
          'tooLong',
          'tooShort',
          'typeMismatch',
          'valid',
          'valueMissing'
        ];

        errorOn.forEach(function(errorType,value) {
          
          if(input.validity[errorType]){

            is_error = true;
          }
        });
      }

      // jQueryVal support, if jQueryVal has decided theres an error then we need to style it correctly
      if(input.classList.contains('input-validation-error'))
        is_error = true;
      
      // If error then lets style it
      if(is_error){

        // Update return value as there is at least one error
        submit = false;

        // Add the correct class
        formGroup.classList.add('form-group--error');

        // Display the error message and save value to display in summary
        let label = "";
        Array.from(formGroup.querySelectorAll('.error, .field-validation-error')).forEach((error, index) => {
      
          error.setAttribute('aria-hidden','false');
          label = error.textContent;
        });

        if(label != ""){

          let id = 'error'+counter;
          formGroup.setAttribute('id',id);

          // Push error to data layer
          if(typeof window.dataLayer === "undefined"){ window.dataLayer = []; }
          dataLayer.push({
            "event": "Client-side form validation failed",
            "data": {
              "error": label
            }
          });

          // Add to array used for the form summary
          errors[id] = {'id':id,'label':label};
          counter++;
        }
      }

    });

    // If there is an alert box for the form we can display a summary
    const alert = form.querySelector('.alert-msg');
    const alertSummary = form.querySelector('.alert__summary');
    if(submit === false && inline == false && alert != null && alertSummary != null && Object.keys(errors).length){

      // Un-hide the summary
      alert.setAttribute('aria-hidden','false');

      // Use the link in the summary as a template for each error message
      let errorLink = alertSummary.querySelector('a');
      let svgHtml = errorLink.querySelector('.svg__wrapper') != null ? errorLink.querySelector('.svg__wrapper').outerHTML : "";
      errorLink.parentNode.removeChild(errorLink);

      // Add error to summary
      Object.keys(errors).forEach(function(index) {
        
        let error = errors[index];
        alertSummary.innerHTML += '<a href="#'+error.id+'">'+error.label+svgHtml+'</a><br/>';
      });

      // Scroll into view
      form.scrollIntoView({behavior: "smooth"});
    }

    return submit;
  }

  /**
   * Check if any buttons with the disable until attribute should be enabled or disabled.
   * @param {HTMLElement} form dom element
   */
  disableUntil(form){

    Array.from(form.querySelectorAll('[data-disabled-until]')).forEach((btn, index) => {
      
      const selector = btn.getAttribute('data-disabled-until');
      const element = form.querySelector(selector)
      const checkValue = btn.getAttribute('data-disabled-until-value');

      if(checkValue != null && element != null && element.value == checkValue)
        btn.removeAttribute('disabled');
      else if(checkValue == null && form.querySelector(selector))
        btn.removeAttribute('disabled');
      else
        btn.setAttribute('disabled','true');
    });
  }
}

export default vmForm