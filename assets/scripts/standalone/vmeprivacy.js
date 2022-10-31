function getCookieValueFromName(name){
  cookieFound = false;
  var cookies = document.cookie.split(';');
  for (var i=0; i<cookies.length; i++){
      var cookie = cookies[i].split("=");
      if(cookie[0].replace(" ", "") == name){
          cookieFound = true;
          cookieVal = cookie[1];
      }
  }
  if (cookieFound){
      return cookieVal;
  }else{
      return false;
  }
}

$("#e-privacy-message-noscript").length > 0 && $("#e-privacy-message-noscript").hide();
    var ePrivacy = {
        initialize: function(a) {
            $("#e-privacy-message").length > 0 && this.isePrivacyMessageActive() && (this.cookiesDetected() ? ($("#cookie-msg-nocookies").hide(), $("#cookie-msg").show(), this.checkePrivacyCookie() && (this.activateePrivacyMessage(!0), $("#e-privacy-message-script").show())) : ($("#cookie-msg").hide(), $("#cookie-msg-nocookies").show(), this.activateePrivacyMessage(!1), $("#e-privacy-message-script").show()))
        },
        cookiesDetected: function() {
            var a = !!navigator.cookieEnabled,
                b = !!(document.cookie || document.cookie.length > 0 || -1 != document.cookie.indexOf("testCookie"));
            if ("undefined" != typeof navigator.cookieEnabled || a)
                return !(!a || !b);
            document.cookie = "testCookie";
            var a = b;
            return a
        },
        isePrivacyMessageActive: function() {
            var ePrivacyActive
            return ePrivacyActive = ePrivacyParams.active, ePrivacyActive
        },
        activateePrivacyMessage: function(a) {
            ePrivacyEvent = ePrivacyParams.event, "onView" == ePrivacyEvent ? ($("#btn-dismiss-cookies").click(function() {
                $("#e-privacy-message-script").slideUp(300)
            }), $("#btn-dismiss-nocookies").click(function() {
                $("#e-privacy-message-script").slideUp(300)
            }), a && this.writeePrivacyCookie(!0)) : ($("#btn-dismiss-cookies").click(function() {
                $("#e-privacy-message-script").slideUp(300), a && ePrivacy.writeePrivacyCookie(!0)
            }), $("#btn-dismiss-nocookies").click(function() {
                $("#e-privacy-message-script").slideUp(300)
            }), this.writeePrivacyCookie(!1))
        },
        checkePrivacyCookie: function() {
            return ePrivacyVersion = ePrivacyParams.version, "" != !getCookieValueFromName("ePrivacy") || (ePrivacyCookie = getCookieValueFromName("ePrivacy"), parseInt(ePrivacyCookie) != parseInt(ePrivacyVersion) && (document.cookie = "ePrivacy=;path=/;expires=Thu, 01-Jan-1970 00:00:01 GMT;domain=" + ePrivacyParams.domain, !0))
        },
        writeePrivacyCookie: function(a) {
            if (ePrivacyVersion = ePrivacyParams.version, expires = "", ePrivacyExpiry = ePrivacyParams.cookieExpiryDays, parseInt(ePrivacyExpiry), a) {
                var b = new Date;
                b.setTime(b.getTime() + 24 * ePrivacyExpiry * 60 * 60 * 1e3), expires = "expires=" + b.toGMTString() + ";"
            }
            document.cookie = "ePrivacy=" + ePrivacyVersion + ";path=/;" + expires + "domain=" + ePrivacyParams.domain
        }
    };
    $(document).ready(function() {
        ePrivacy.initialize()
});