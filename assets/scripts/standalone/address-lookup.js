/* Adds the returning data into the correct fields */
function addDataToInputs(element,data){

  $(element).find('.form-control.address-line-1').val(data.MatchedAddressGeneric.AddressLine1);
  $(element).find('.form-control.address-line-2').val(data.MatchedAddressGeneric.AddressLine2);
  $(element).find('.form-control.address-line-3').val(data.MatchedAddressGeneric.Town);
  $(element).find('.form-control.address-line-4').val(data.MatchedAddressGeneric.County);
  $(element).find('.form-control.postcode').val(data.MatchedAddressGeneric.PostCode);

}

// Events
$(document).ready(function () {

  removeTabIndex();

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var lookups = document.getElementsByClassName('postcode-lookup');
  var uselookup = document.getElementsByClassName('use-lookup');
  var usemanual = document.getElementsByClassName('use-manual');
  var addresschoices = document.querySelectorAll('.address-choices select');

  // Loop over them and prevent submission
  var addresslookup = Array.prototype.filter.call(lookups, function(lookup) {
    lookup.addEventListener('click', function(event) {

      event.preventDefault();
      event.stopPropagation();

      // Variables
      var target = $(this).attr('href');
      var $addresslookup = $(this).closest('.address-lookup__wrapper');
      var postcode = $addresslookup.find('input.postcode').val();
      var housename = $addresslookup.find('input.house-name').val();
      var choices = $(this).attr('data-choices-id');
      var $btn = $(this);

      
      // Resets of messages
      $('.invalid-feedback[data-for="'+$btn.attr('id')+'"]').remove();
      $addresslookup.removeClass("form-group-error");
      
      
      // DEMO If 1 address found 
      if($(this).is('[data-example]') && $(this).attr('data-example') === "found"){
        /*
        data = {"isOk":true,"isMatch":true,"Addresses":[{"Display":"11 North Avenue, Gosforth, NEWCASTLE UPON TYNE NE3 4DT","ID":"0qOGBRCAzhBwAAAAABAwEAAAABQA.AUgAgAAAAADExAAD..2QAAAAA.....wAAAAAAAAAAADExLCBuZTMgNGR0AA--"}],"MatchedAddress":{"FlatNumber":null,"BuildingName":null,"BuildingNumber":null,"Street":null,"Locality":null,"Town":null,"County":null,"PostCode":null,"ID":"0qOGBRCAzhBwAAAAABAwEAAAABQA.AUgAgAAAAADExAAD..2QAAAAA.....wAAAAAAAAAAADExLCBuZTMgNGR0AA--","Country":"United Kingdom"},"MatchedAddressGeneric":{"AddressLine1":"11 North Avenue","AddressLine2":"Gosforth","Town":"NEWCASTLE UPON TYNE","County":"","PostCode":"NE3 4DT","ID":null}};
                 
        addDataToInputs($addresslookup,data);
        $(target).addClass('target');
        */
      }
      // DEMO If more than one address found 
      else if($(this).is('[data-example]') && $(this).attr('data-example') === "multi"){
/*
        data = {"isOk":true,"isMatch":false,"Addresses":[{"Display":"2 Chollerford Close, NEWCASTLE UPON TYNE NE3 4RN","ID":"09OGBRCAzhBwAAAAABAwEAAAABQWshkgAgAAAAADIAAP..ZAAAAAD.....AAAAAAAAAAAAbmUzIDRybkB4AA--"},{"Display":"4 Chollerford Close, NEWCASTLE UPON TYNE NE3 4RN","ID":"0TOGBRCAzhBwAAAAABAwEAAAABQWshkgAgAAAAADQAAP..ZAAAAAD.....AAAAAAAAAAAAbmUzIDRybkB4AA--"},{"Display":"6 Chollerford Close, NEWCASTLE UPON TYNE NE3 4RN","ID":"0JOGBRCAzhBwAAAAABAwEAAAABQWshkgAgAAAAADYAAP..ZAAAAAD.....AAAAAAAAAAAAbmUzIDRybkB4AA--"},{"Display":"8 Chollerford Close, NEWCASTLE UPON TYNE NE3 4RN","ID":"0lOGBRCAzhBwAAAAABAwEAAAABQWshkgAgAAAAADgAAP..ZAAAAAD.....AAAAAAAAAAAAbmUzIDRybkB4AA--"},{"Display":"10 Chollerford Close, NEWCASTLE UPON TYNE NE3 4RN","ID":"07OGBRCAzhBwAAAAABAwEAAAABQWshkgAgAAAAADEwAAD..2QAAAAA.....wAAAAAAAAAAAG5lMyA0cm5AeAA-"},{"Display":"12 Chollerford Close, NEWCASTLE UPON TYNE NE3 4RN","ID":"02OGBRCAzhBwAAAAABAwEAAAABQWshkgAgAAAAADEyAAD..2QAAAAA.....wAAAAAAAAAAAG5lMyA0cm5AeAA-"},{"Display":"14 Chollerford Close, NEWCASTLE UPON TYNE NE3 4RN","ID":"0lOGBRCAzhBwAAAAABAwEAAAABQWshkgAgAAAAADE0AAD..2QAAAAA.....wAAAAAAAAAAAG5lMyA0cm5AeAA-"},{"Display":"16 Chollerford Close, NEWCASTLE UPON TYNE NE3 4RN","ID":"08OGBRCAzhBwAAAAABAwEAAAABQWshkgAgAAAAADE2AAD..2QAAAAA.....wAAAAAAAAAAAG5lMyA0cm5AeAA-"},{"Display":"18 Chollerford Close, NEWCASTLE UPON TYNE NE3 4RN","ID":"0WOGBRCAzhBwAAAAABAwEAAAABQWshkgAgAAAAADE4AAD..2QAAAAA.....wAAAAAAAAAAAG5lMyA0cm5AeAA-"},{"Display":"20 Chollerford Close, NEWCASTLE UPON TYNE NE3 4RN","ID":"0sOGBRCAzhBwAAAAABAwEAAAABQWshkgAgAAAAADIwAAD..2QAAAAA.....wAAAAAAAAAAAG5lMyA0cm5AeAA-"},{"Display":"22 Chollerford Close, NEWCASTLE UPON TYNE NE3 4RN","ID":"0hOGBRCAzhBwAAAAABAwEAAAABQWshkgAgAAAAADIyAAD..2QAAAAA.....wAAAAAAAAAAAG5lMyA0cm5AeAA-"},{"Display":"24 Chollerford Close, NEWCASTLE UPON TYNE NE3 4RN","ID":"0yOGBRCAzhBwAAAAABAwEAAAABQWshkgAgAAAAADI0AAD..2QAAAAA.....wAAAAAAAAAAAG5lMyA0cm5AeAA-"}],"MatchedAddress":{"FlatNumber":null,"BuildingName":null,"BuildingNumber":null,"Street":null,"Locality":null,"Town":null,"County":null,"PostCode":null,"ID":null,"Country":"United Kingdom"},"MatchedAddressGeneric":{"AddressLine1":null,"AddressLine2":null,"Town":null,"County":null,"PostCode":null,"ID":null}}
        
        $(choices).find('select').attr('data-example','multi');
        
        
        $(choices).addClass('target');
        
        $.each(data.Addresses, function( key, address ) {
          
          $(choices).find('select').append('<option value="'+address.ID+'">'+address.Display+'</option>');
        }); 
        */
      }
      else {
        
        var searchString = '/api/address/searchplus/',
            token = $('input[name="__RequestVerificationToken"]').val();

        searchString += postcode;

        if(housename !== "")
            searchString += "/" + housename;
        else
            searchString += "/null";

        searchString += "/true";
        

        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: searchString,
            headers: {
                "RequestVerificationToken": token
            },
            success: function (data) {

              // Lets check the data that is returned
              // One is found
              if(data && data.isOk && data.Addresses.length == 1){
                resetTabIndex($(target));
                addDataToInputs($addresslookup,data);
                $(target).addClass('target');
              }
              // Multiple is found
              else if(data && data.isOk && data.Addresses.length > 1){

                $(choices).addClass('target');

                $.each(data.Addresses, function( key, address ) {

                  $(choices).find('select').append('<option value="'+address.ID+'">'+address.Display+'</option>');
                }); 
              }
              // something hasn't worked so lets show an error
              else {

                $addresslookup.addClass("form-group-error");

                $('.invalid-feedback[data-for="'+$btn.attr('id')+'"').remove();
                $addresslookup.prepend('<span class="display-4 invalid-feedback" data-for="'+$btn.attr('id')+'">'+$btn.attr('data-error')+'</span>');
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              
              $addresslookup.addClass("form-group-error");

              $('.invalid-feedback[data-for="'+$btn.attr('id')+'"').remove();
              $addresslookup.prepend('<span class="display-4 invalid-feedback" data-for="'+$btn.attr('id')+'">'+$btn.attr('data-error')+'</span>');
            },
            timeout: 10000
        });


      }
      
      
    }, false);
  });


  var uselookupfunc = Array.prototype.filter.call(uselookup, function(uselookup) {
    uselookup.addEventListener('click', function(event) {


        event.preventDefault();
        event.stopPropagation();

        var target = $(this).attr('data-address-id');
        $(target).removeClass('target');

        var choices = $(this).attr('data-choices-id');
        $(choices).removeClass('target');

    }, false);
  });


  var usemanualfunc = Array.prototype.filter.call(usemanual, function(usemanual) {
    usemanual.addEventListener('click', function(event) {

        event.preventDefault();
        event.stopPropagation();

        var target = $(this).attr('href');
        $(target).addClass('target');
        resetTabIndex($(target));

    }, false);
  });

  var addresschoicesfunc = Array.prototype.filter.call(addresschoices, function(addresschoices) {
    addresschoices.addEventListener('change', function(event) {

      event.preventDefault();
      event.stopPropagation();

      var addressID = $(this).val();
      var $addresslookup = $(this).closest('.address-lookup__wrapper');
      
      
      if($(this).is('[data-example]') && $(this).attr('data-example') === "multi"){
/*
        data = {"isOk":true,"isMatch":true,"Addresses":[{"Display":"11 North Avenue, Gosforth, NEWCASTLE UPON TYNE NE3 4DT","ID":"0qOGBRCAzhBwAAAAABAwEAAAABQA.AUgAgAAAAADExAAD..2QAAAAA.....wAAAAAAAAAAADExLCBuZTMgNGR0AA--"}],"MatchedAddress":{"FlatNumber":null,"BuildingName":null,"BuildingNumber":null,"Street":null,"Locality":null,"Town":null,"County":null,"PostCode":null,"ID":"0qOGBRCAzhBwAAAAABAwEAAAABQA.AUgAgAAAAADExAAD..2QAAAAA.....wAAAAAAAAAAADExLCBuZTMgNGR0AA--","Country":"United Kingdom"},"MatchedAddressGeneric":{"AddressLine1":"11 North Avenue","AddressLine2":"Gosforth","Town":"NEWCASTLE UPON TYNE","County":"","PostCode":"NE3 4DT","ID":null}};
        
        addDataToInputs($addresslookup,data);
        $addresslookup.find('.address').addClass('target');
        */
      }
      else {
        
        var searchString = '/api/address/formatplus/',
            token = $('input[name="__RequestVerificationToken"]').val();

        searchString += addressID + "/true";

        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: searchString,
            headers: {
                "RequestVerificationToken": token
            },
            success: function (data) {
              
              if(data && data.isOk){

                $addressFields = $addresslookup.find('.address');
                resetTabIndex($addressFields);
                addDataToInputs($addresslookup,data);
                $addressFields.addClass('target');
              }

            },
            error: function (xhr, ajaxOptions, thrownError) {
              
            },
            timeout: 10000
        });
      }
      
      
    }, false);
  });

  function removeTabIndex() {
    $(document).find('.address').each(function() {
      $(this).children('input').each(function() {
        $(this).attr('tabindex', -1);
      });
    });
  }

  function resetTabIndex($selector) {
    $selector.each(function() {
      $(this).children('input').each(function() {
        $(this).attr('tabindex', 0);
      });
    });
  }
  
});


