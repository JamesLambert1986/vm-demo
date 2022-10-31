$(document).ready(function(){

  var $form = $('#investment-calculator');
  var btnID = "growth-button";
  var investmentTimeout;

  // Format pound values correctly
  var formatCurrency = function(amount){
    // Create our number formatter.
    var formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    });

    amount = formatter.format(amount).replace('.00','');

    return amount;
  }

  var computeVars = function(formData){

    var lmp = parseInt(formData['lmp']);
    var lmpFMT = formatCurrency(lmp);
    var reg = parseInt(formData['reg']);
    var period = parseInt(formData['period']);
    var regTotal = ((reg * 12) * period);
    var regTotalFMT = formatCurrency(regTotal);
    var trns = parseInt(formData['trns']);
    var trnsFMT = formatCurrency(trns);
    var totalInvested = regTotal + lmp + trns;
    var totalInvestedFMT = formatCurrency(totalInvested);
    var periodLength = formData['period']+" years";

    if($('#invest-amount').text() != totalInvestedFMT)
      $('#invest-amount, .projection-investment').text(totalInvestedFMT );
    
    if($('#invest-period').text() != periodLength)
      $('#invest-period').text(periodLength);

    if($('#invest-lmp').text() != lmpFMT)
      $('#invest-lmp').text(lmpFMT);
  
    if($('#invest-trns').text() != trnsFMT)
      $('#invest-trns').text(trnsFMT);
    
    if($('#invest-reg-total').text() != regTotalFMT)
      $('#invest-reg-total').text(regTotalFMT);
  }

  var getFormData = function (){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
  }

  var investmentform = function(){

    var submit = window.vmForm.validateForm($form[0]);

    submit = true;
    console.log(submit);

    if(!submit)
      return false;

    if(formData['lmp'] && formData['reg'] && formData['period'] && formData['prod'] && formData['trns']) {

      clearTimeout(investmentTimeout);
      investmentTimeout = setTimeout(function(){ 
        
        var formData = getFormData();

        // Hide projection
        $('#filter, #approaches, #growth').remove();

        // Compte Vars
        computeVars(formData);
      }, 500);
    } 
  };

  var formData = getFormData();

  $form.attr("action","#growth")

  // Enable submit button only when we have enough data
  $('body').on('click','#investment-calculator .stepper__plus,#investment-calculator .stepper__minus',function(e){

    investmentform();
  });

  $('body').on('change','#investment-calculator input',function(e){

    investmentform();
  });

  $('body').on('submit','#investment-calculator',function(e){
    
    // Only submit from the calculate button
    if(e.originalEvent.submitter.id != btnID){

      e.preventDefault();
      investmentform();
    }
  });

});