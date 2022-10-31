$(document).ready(function(){

  var $form = $('#select-approach');
  
  $('body').on('change','#select-approach input',function(e){

    var url = $form.attr('data-ajax');
    var animated = $("#pre-apply .container.inview").length ? true : false;

    $("#pre-apply").load(url+"?"+$form.serialize()+" #pre-apply", function(data) { 

      $("#pre-apply #pre-apply").unwrap();

      // If the containers have not animated into view previously then the inview functionality needs to be added back in
      if(!animated){

        window.Vminview.inview();
      }

      window.Vmforms.disabled_until();
    });
  });
});