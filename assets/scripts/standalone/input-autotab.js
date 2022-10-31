$(document).ready(function(){

  $(".form-group--dob input, .form-group--sortcode input").keyup(function () {

    $this=$(this);
    maxlength = $this.attr("maxlength");

    if ($this.val().length >= maxlength) {

      if($this.val().length> maxlength ){

        $this.val($this.val().substring(0,maxlength));
      }
      $this.nextAll("input").focus();
    }
  });
});