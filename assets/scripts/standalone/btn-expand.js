$(document).ready(function () {
  
  // btn expand
  var btnexpand = document.querySelectorAll('.btn--expand, [data-btn-expand]');
  var btnexpandfunc = Array.prototype.filter.call(btnexpand, function(btnexpand) {
    btnexpand.addEventListener('click', function(event) {

        event.preventDefault();
        event.stopPropagation();

        var target = $(this).attr('href');
        var $target = $(target);
        var $btn = $(this);
        
      if(!$btn.hasClass('use-manual') && !$btn.hasClass('postcode-lookup')){
        if($target.hasClass('target')){

          $btn.removeClass('active');
          $target.removeClass('target');
        }
        else {

          $btn.addClass('active');
          $target.addClass('target');
        }
      }
    }, false);
  });
});