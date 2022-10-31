$(document).ready(function () {

  $('form').on('submit',function(event){
    
    $form = $(this);
    
    // Make sure the address fields are display
    $form.find('.form-group.address').addClass('target');
    
    /* Reset */
    $form.find('.form-group-error').removeClass('form-group-error');
    $form.find('.input-validation-error').closest('.form-group').addClass('form-group-error');
    $form.find('.field-validation-error').addClass('invalid-feedback');
    $form.find('.alert-danger').remove();
    
    
    
    // If errors display the summary
    // Make the validation error messaging work with the GDS/bootstrap/phoenix styling
    if($form.find('.form-group-error').length){
      
      var formSummary = $form.attr('data-error-summary');
      
      $form.prepend(formSummary);

      $form.find('.form-group-error').each(function(index){

        label = $(this).find('label').first().clone().children().remove().end().text();
        link = $(this).find('input, select').first().attr('id');
        
        if(label != undefined)
          $form.find('.alert-danger').append('<a href="#'+link+'" class="short">'+label+'</a>');
      });
    }
  });
  
  
  
  // Make the inline validation worh with GDS/bootstrap/phoenix styling
  $('.form-control, .custom-select, .custom-control-label, .radio-btn-group > label').on('keyup focusin focusout change click',function(event){
    // Set a small timeout so that it runs after the validation has been done
    
    $input = $(this);
    
    setTimeout(function(){
    
      // Reset
      $input.removeClass('invalid-feedback');
      $input.closest('.form-group').removeClass('form-group-error');
      
      // Add the right classes
      $('.field-validation-error').addClass('invalid-feedback');
      $('.input-validation-error').closest('.form-group').addClass('form-group-error');
    }, 100);
  });
});