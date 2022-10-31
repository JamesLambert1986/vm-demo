document.addEventListener("DOMContentLoaded", function() {

  var cookie_value = function(name) {

    var value = false;
    var cookies = document.cookie.split(';');

    for (var i=0; i<cookies.length; i++){
      var cookie = cookies[i].split("=");
      if(cookie[0].replace(" ", "") == name){

          value = cookie[1];
      }
    }
    
    return value;
  }

  var create_cookie = function(value) {

    // Create an expiry date
    var exdays = 365;
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    
    document.cookie = "themePicker=" + value + ";expires="+d.toUTCString()+";path=/;"
  }

  document.addEventListener('change', function(e){
    // loop parent nodes from the target to the delegation node
    for (var target = e.target; target && target != this; target = target.parentNode) {

      if (target.matches('#theme-picker')) {

        let value = target.value;

        document.body.classList.remove('theme--retail');
        document.body.classList.remove('theme--business');

        document.body.classList.add('theme--'+value);
        create_cookie(value);

        break;
      }
    }
  }, false);


  var stored_value = cookie_value("themePicker");

  if(navigator.cookieEnabled && stored_value && document.body.classList.contains('theme--') != false){

    document.body.classList.remove('theme--retail');
    document.body.classList.remove('theme--business');
    document.body.classList.add('theme--'+stored_value);

    document.getElementById('theme-picker').value = stored_value;
  }
  
});