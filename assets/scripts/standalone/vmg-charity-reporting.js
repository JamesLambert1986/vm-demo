/*
* This file is for the Virgin Money Giving reporting tool, which re-organises templates which are used to generate csv files
* 
* Contents:
* Reorder function
* Service message function
* Init the drag drop
* On page load
*   - Check which fields need to be moved to bin
* Click events 
*   - Update the data field
*   - Remove the field
*   - Add the field back into template
* High level buttons
*   - Remove all of the fields from template
*   - Add back all of the data fields
* 
*/

// Re-order and update of position fields ************************************************************************
// This function is a general cleanup after a user has done an action, i.e. remo
var reorder = function(){

  // Update the position of each data field
  $('.drag-drop .form-control.field-position').each(function(index){
    $(this).val(index+1);
  });

  // Update the field title
  $('.drag-drop .charity-reporting__field-position').each(function(index){
    $(this).html(index+1);
  });

  // clear the position of the fields that are not included in report
  $('.charity-reporting__bin .form-control.field-position').each(function(index){
    $(this).val('');
  });

  // Update the data field totals
  $('.charity-reporting__field-total').html($('.drag-drop li').length);
  
  // Change the text of the 'Update field' button depending upon if its in the bin or not
  $('.drag-drop [data-update]').html('Update field');
  $('.charity-reporting__bin [data-update]').html('Update and add field');

  // Hide and show elements
  $('.charity-reporting__bin .bin__hide').addClass('d-none');
  $('.charity-reporting__bin .bin__show').removeClass('d-none');
  $('.drag-drop .bin__show').addClass('d-none');
  $('.drag-drop .bin__hide').removeClass('d-none');

  // Hide and show the bin if empty or has contents
  if($('.charity-reporting__bin li').length > 0){
    $('.charity-reporting__bin__container').removeClass('d-none');
    $('.charity-reporting-view-available').removeClass('d-none');
  }
  else {
    $('.charity-reporting__bin__container').addClass('d-none');
    $('.charity-reporting-view-available').addClass('d-none');
  }

  // fix tabindexes
  $('.charity-reporting__bin .drag-drop-handle').removeAttr('tabindex');
  $('.drag-drop .drag-drop-handle').attr('tabindex','0');
}

// Service Message *****************************************************************************************************************
// Notification type message after the user has done somekind of action, i.e. removing a field
var serviceTimout;
var servicemsg = function(msg){

  $('#service-msg').remove();
  $('body').append('<div class="service-msg bg-dark" id="service-msg"><p>'+msg+'</p><!--<button class="btn btn-tertiary">Undo</button>--></div>');
  clearTimeout(serviceTimout);
  serviceTimout = setTimeout(function(){ $('#service-msg').remove(); }, 3000);
}

// Init the drag drop ***************************************************************************************************************
// Uses the Dragon Drop JS library
var dragondrop = new DragonDrop(document.getElementById('charity-reporting'), {
  handle: '.drag-drop-handle',
  announcement: {
    grabbed: function (el) { },
    dropped: function (el) { 

      var $parent = $(el);
      var $title = $parent.find('.charity-reporting__field-title');
      var currentname = $title.html();
      servicemsg("'"+currentname+"' field has been moved");
      reorder(); 
    },
    reorder: function (el, items) {},
    cancel: function() { return 'Reranking cancelled.'; }
  }
});

// On page load ****************************************************************************************************************
$(document).ready(function () {
  // Check which fields need to be moved to bin, save templates will already of data of which data fields are and aren't include in report
  $('.drag-drop input[type="checkbox"]:not([checked])').each(function(index){

    var $parent = $(this).closest('li');
    var $bin = $('.charity-reporting__bin');

    $bin.append($parent);
    reorder();
  });
});

// Click events ****************************************************************************************************************

// Update the data field
$('body').on('click','#charity-reporting [data-update],#charity-reporting__bin [data-update]',function(e){

  e.preventDefault();
  var $parent = $(this).closest('li');
  var $title = $parent.find('.charity-reporting__field-title');
  var position = $parent.find('.field-position').first().val();
  var displayname = $parent.find('.field-display-name').first().val();
  var currentname = $title.html();
  var $container = $('.drag-drop');

  $moveto = $container.find('> li:nth-child('+(position-1)+')');

  if($moveto.length == 0){
    $moveto = $container.find('> li').last();
  }

  if(position == 1){
    $container.prepend($parent);
  }
  else {
    $parent.insertAfter($moveto);
  }

  $title.text(displayname);

  servicemsg("'"+currentname+"' field has been updated");
  reorder();
});

// Remove the field
$('body').on('change','.drag-drop input[type="checkbox"]',function(e){

  var $parent = $(this).closest('li');
  var $bin = $('.charity-reporting__bin');

  var $title = $parent.find('.charity-reporting__field-title');
  var currentname = $title.html();

  $bin.append($parent);

  $('[data-toggle="collapse"]').removeClass('selected');
  $('.charity-reporting__bin .collapse').removeClass('show');

  servicemsg("'"+currentname+"' field has been removed from template");
  reorder();
});

// Add the field back into template
$('body').on('change','.charity-reporting__bin input[type="checkbox"]',function(e){

  var $parent = $(this).closest('li');
  var $dragdrop = $('.drag-drop');

  $dragdrop.append($parent);

  var $title = $parent.find('.charity-reporting__field-title');
  var currentname = $title.html();
  servicemsg("'"+currentname+"' field has been added to template");

  reorder();
});



// High level buttons ****************************************************************************************************************

// Remove all of the fields from template
$('body').on('click','.charity-reporting__clear',function(e){

  e.preventDefault();

  $('.drag-drop li').each(function(index){

    $this = $(this);
    $('.charity-reporting__bin').append($this);
    $(this).find('input[type="checkbox"]').prop('checked', false);
  });

  $('.charity-reporting__bin [data-toggle="collapse"]').removeClass('selected');
  $('.charity-reporting__bin .collapse').removeClass('show');
  reorder();
});

// Add back all of the data fields
$('body').on('click','.charity-reporting__add-all',function(e){

  e.preventDefault();

  $('.charity-reporting__bin li').each(function(index){

    $this = $(this);
    $this.find('input[type="checkbox"]').prop('checked', true);
    $('.drag-drop').append($this);
  });

  reorder();
});