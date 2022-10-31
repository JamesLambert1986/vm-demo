/*
* 
* 
*/


// On page load ****************************************************************************************************************
$(document).ready(function () {
  
  
  var data = [];
  $('input[type="hidden"]').each(function() {
    
    var variable_name = $(this).attr('name');
    var variable_val = $(this).val();

    data[variable_name] = variable_val;
  });

  
});

// Click events ****************************************************************************************************************

// Update the data field
$('body').on('click','#charity-reporting [data-update],#charity-reporting__bin [data-update]',function(e){

  e.preventDefault();
  
});