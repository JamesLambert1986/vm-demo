$(document).ready(function(){

  
  var $form = $('#investment-calculator');
  var $btn = $form.find('button[type="submit"]');
  var jsonUrl = $form.attr('data-json');
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

  // Load a json file and replace dom values from the value of the matching property name to dom ID
  var getJSON = function(formID,jsonUrl){

    $.getJSON( jsonUrl).done(function( json ) {
      $(formID + ' .alert-msg').addClass('d-none').attr('role','presentation');

      Object.keys(json).forEach(function(key) {

        if($('#'+key).text() != json[key])
          $('#'+key).text(json[key]);
      });

      if(json['error']){

        $(formID + ' .alert-msg').removeClass('d-none').attr('role','alert');
        $(formID + ' .alert-msg__content').html('<p>'+json['error']+'</p>');
        
        $([document.documentElement, document.body]).animate({
          scrollTop: $(formID + ' .alert-msg').offset().top - 40
        }, 500);
      }
    })
    .fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      $(formID + ' .alert-msg').removeClass('d-none').attr('role','alert');
      $(formID + ' .alert-msg__content').html('<p>Request Failed: ' + err+'</p>');

      $([document.documentElement, document.body]).animate({
        scrollTop: $(formID + ' .alert-msg').offset().top - 40
      }, 500);
    });
  }

  var computeVars = function(){

    if($('#projection-investment-type').text() != $('[name="approach"]:checked + label').text()) {
      $('#projection-investment-type').text($('[name="approach"]:checked + label').text());
      $('#projection-link-text').text($('[name="approach"]:checked + label').text());
      $('#projection-svg').addClass('updated').html('<svg class=""><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="'+$('[name="approach"]:checked + label').data('icon')+'"></use></svg>');
      setTimeout(function (){
        $('#projection-svg').removeClass('updated');
      },500);

      $('#investment-continue').attr('href',$('#investment-continue').attr('data-href')+"?"+$form.serialize());
    }

    // Lets do the easy updates and calculations
    if($('#projection-period').text() != $('#investment-length').val()+" years")
    $('#projection-period').text($('#investment-length').val()+" years");

    if($('#projection-one-off-payment').text() != formatCurrency($('#lump-sum').val()))
    $('#projection-one-off-payment').text(formatCurrency($('#lump-sum').val()));

    if($('#projection-regular-payment').text() != formatCurrency($('#monthly').val()))
    $('#projection-regular-payment').text(formatCurrency($('#monthly').val()));

    if($('#projection-transfer-isa-amount').text() != formatCurrency($('#transfer-isa-amount').val()))
    $('#projection-transfer-isa-amount').text(formatCurrency($('#transfer-isa-amount').val()));

    var regularPayment = parseInt($('#monthly').val());
    var investmentLength = parseInt($('#investment-length').val());
    var oneOffPayment = parseInt($('#lump-sum').val());
    var transferIsaAmount = parseInt($('#transfer-isa-amount').val());

    var totalInvested = ((regularPayment * 12) * investmentLength) + oneOffPayment + transferIsaAmount;
    var approachFee = (totalInvested / 100) * 0.3;
    var platformFee = (totalInvested / 100) * 0.5;

    $('#total-invested').text(formatCurrency(totalInvested));
    $('#approach-fee').text(formatCurrency(approachFee));
    $('#platform-fee').text(formatCurrency(platformFee));
    
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

    var formData = getFormData();

    if(formData['lump-sum'] && formData['monthly'] && formData['length'] && formData['investment-type'] && formData['transfer-isa-amount'] && formData['approach']) {

      var submit = window.Vmforms.validate($form);
      if(!submit)
        return false;

      clearTimeout(investmentTimeout);
      investmentTimeout = setTimeout(function(){ 
        
        getJSON('#investment-calculator',jsonUrl+"?"+$form.serialize());
        computeVars();
        $('#projection').addClass('js-hide').empty();
      }, 500);
    } 
  };

  // Disable the submit button until enough data is inputed
  $btn.attr('disabled','disabled');

  // If form is pre-populated enough then enable the submit button
  var formData = getFormData();
  if(formData['lump-sum'] && formData['monthly'] && formData['length'] && formData['investment-type'] && formData['transfer-isa-amount'] && formData['approach'])
    $btn.removeAttr('disabled');

  // Enable submit button only when we have enough data
  $('body').on('change','#investment-calculator input',function(e){

    var formData = getFormData();

    if(formData['lump-sum'] && formData['monthly'] && formData['length'] && formData['investment-type'] && formData['transfer-isa-amount'] && formData['approach'])
      $('#investment-calculator button[type="submit"]').removeAttr('disabled');
  });

  // On submit we are going to hide the submit button and show the calculator results
  $('body').on('click','#investment-calculator button[type="submit"]',function(e){

    e.preventDefault();

    $form.addClass('form--submitted');
    var $btn = $(this);
    var buttonOffset = $btn.offset();

    $('#investment-calculator .calculator__results').removeClass('js-hide');
    var resultsOffset = $('#investment-calculator .calculator__results').removeClass('js-hide').offset();

    $btn.addClass('d-none');

    // Scroll down to results when the button is above the results i.e. mobile and tablet
    if(buttonOffset.top < resultsOffset.top){
      $([document.documentElement, document.body]).animate({
        scrollTop: $("#investment-calculator .calculator__results").offset().top - 120
      }, 500);
    }

    investmentform();
  });

  // Allow the investment API call after the submit button has been clicked and enough data has been collected
  $('body').on('change keyup','#investment-calculator.form--submitted input',function(e){

    investmentform();
  });

  $('body').on('submit','#investment-calculator',function(e){
    
    e.preventDefault();
    investmentform($('#calculator'));
  });

  $('body').on('click','#load-chart',function(e){

    var url = $(this).attr('data-ajax')
    $("#projection").load(url+"?"+$form.serialize(), function() {

      $('#projection').removeClass('js-hide');
      $([document.documentElement, document.body]).animate({
        scrollTop: $("#projection").offset().top - 40
      }, 500);
    });
  });
});