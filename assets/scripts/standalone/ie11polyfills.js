// IE11 polyfills
// Foreach
if ('NodeList' in window && !NodeList.prototype.forEach) {
  //console.info('polyfill for IE11');
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}


// Array from
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError("Array.from requires an array-like object - not null or undefined");
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}

// Matches
Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || function matches(selector) {

	var element = this;
	var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
	var index = 0;

	while (elements[index] && elements[index] !== element) {
		++index;
	}

	return !!elements[index];
};

//Closest
if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;

    do {
      if (Element.prototype.matches.call(el, s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}


// Chart fix
$( document ).ready(function() {
  
  // #UT-VMCharts1
  $('.container--chart:not(.chart--line) .chart .data').each(function(index){

    var $this = $(this);

    $this.css({'height':$this.attr('data-percent') + '%'});
  });

  // #UT-VMCharts2
  $('.chart--line .chart .data').each(function(index){

    var $this = $(this);

    $this.css({'bottom':$this.attr('data-percent') + '%'});
  });

  // #UT-VMCharts3
  $('.chart .chart__y-axis .group').each(function(index){

    var $this = $(this);

    $this.css({'height':$this.attr('data-percent') + '%'});
  });

  // #UT-VMCharts4
  $('.chart .chart__x-axis .guideline').each(function(index){

    var $this = $(this);
    $this.css({'height':$this.attr('data-percent') + '%'});
  });

  // TO DO: Unit test
  $('.chart--stacked .chart .data').each(function(index){

    var $this = $(this);

    $this.css({'flex': '0 0 '+$this.attr('data-percent') + '%'});
  });

  // TO DO: Unit test
  $('.chart--linear-pie .chart .data').each(function(index){

    var $this = $(this);

    $this.css({'flex': '0 0 '+$this.attr('data-percent') + '%'});
  });

  // TO DO: Unit test
  $('.container--chart').each(function(index){

    var $this = $(this);
    var chart_id = $this.attr('id')
    
    var style = $this.attr('data-style');
    
    if(style != "" && typeof style != "undefined"){
      

      if(typeof chart_id == 'undefined' || chart_id == false){

        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        var chart_id = randLetter + Date.now();

        $this.attr('id',chart_id);
      }


      var arrStyles = style.split(';');

      
      var inlinestyles = "";

      $(arrStyles).each(function(index){
        if(this == "")
          return;
          
          var rule = this.split(':');

          var i = parseInt(rule[0].replace('--colour-chart-',''));
          var value = rule[1].trim();

          inlinestyles += "#"+chart_id+" .chart .data:nth-child("+i+") { color: "+value+" !important;}";
          inlinestyles += "#"+chart_id+" .chart__key .key__btn:not(.key__btn--clear):nth-child("+(i+1)+"):before { background: "+value+" !important; }";
          inlinestyles += "#" + chart_id + " .chart-colour-" + i + " { color: " + value + " !important; }";
          inlinestyles += "#"+chart_id+".chart--line .chart svg:nth-of-type("+i+") path { stroke: "+value+" !important; }";
          inlinestyles += "#"+chart_id+".chart--pie .chart svg circle:nth-of-type("+i+") { color: "+value+" !important; }";
      });

      $this.append('<style>'+inlinestyles+'</style>');
    }
  });
  

});
