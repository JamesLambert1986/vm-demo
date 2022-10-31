document.addEventListener("DOMContentLoaded", function() {

  function createLoopVideos(){

    Array.from(document.querySelectorAll('[data-loop]')).forEach(function (arrayElement, index){
      
      const videoId = arrayElement.getAttribute('data-loop');
      const delay = arrayElement.getAttribute('data-delay');
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var spanId = randLetter + Date.now();
      arrayElement.innerHTML = '<div class="youtube-embed__inner"><span id="'+spanId+'"></span></div>';
      let loopWrapper = arrayElement.parentNode;
      loopWrapper.setAttribute('id',spanId+'-parent');
      loopWrapper.classList.add('loop__wrapper');
      loopWrapper.innerHTML += '<button id="'+spanId+'-pause" class="loop__pause-btn">Pause</button>';

      // If the video needs to be a bit bigger lets work out the width percentage
      if(loopWrapper.clientHeight / loopWrapper.clientWidth > 1){

        let newWidth = Math.ceil((loopWrapper.clientHeight / loopWrapper.clientWidth) * 100);
        loopWrapper.style.setProperty("--video-width",newWidth+'%');
      }

      window.YT.ready(function() {

        loopPlayer = new YT.Player(spanId, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: { 
            'modestbranding': 1,
            'playsinline': 1,
            'rel': 0,
            'showinfo': 0,
            'controls': 0,
            'loop': 1,
            'playlist': videoId,
            'ecver': 2
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });

        document.getElementById(spanId+'-pause').onclick = function(e) {
          e.preventDefault();

          if(document.getElementById(spanId+'-parent').classList.contains('loop--playing')){

            document.getElementById(spanId).contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
            document.getElementById(spanId+'-parent').classList.remove('loop--playing');
            document.getElementById(spanId+'-parent').classList.add('loop--paused');
          }
          else {

            document.getElementById(spanId).contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
            document.getElementById(spanId+'-parent').classList.remove('loop--paused');
            document.getElementById(spanId+'-parent').classList.add('loop--playing');
          }
        };

        function onPlayerReady(event) {
          // Play the video straight away

          var detectReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)'); 
          if(detectReducedMotion.matches == false){
          

            if(delay == null){
              event.target.playVideo();
            }
          }
      
          event.target.mute();
        }

        function onPlayerStateChange(event) {
        
          if(event.data == "1"){

            document.getElementById(spanId+'-parent').classList.add('loop--loaded');
            document.getElementById(spanId+'-parent').classList.add('loop--playing');
          }
        }
      });
    });


    Array.from(document.querySelectorAll('.container')).forEach((element, index) => {
      
      let options = {
        characterData: true,
        childList: true,
        attributes: true
      },
      observer = new MutationObserver(mCallback);

      function mCallback(mutations) {
        for (let mutation of mutations) {

          if (mutation.attributeName === 'class') {

            if(mutation.target.classList.contains('inview')){

              console.log('add inview');

              observer.disconnect();


              Array.from(element.querySelectorAll('[data-delay] iframe')).forEach((iframe, index) => {
    
                
                console.log('hi');

                setTimeout(function(){ 
                  
                  iframe.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
                
                }, 1000);
                

              });



            }

          }
        }
      }

      observer.observe(element, options);
    });




  }

  if(document.body.classList.contains('youtubeLoaded')){

    createLoopVideos();
  }
  else {

    return new Promise(function(resolve, reject) {

      const image = new Image();
      image.onload = function(){
        
        // This code loads the IFrame Player API code asynchronously.
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        document.body.classList.add('youtubeLoaded');
        resolve(true);

        // script has loaded, you can now use it safely
        tag.onload = function() {
          createLoopVideos();
        }   
      };
      image.onerror = function(){
        reject(false);
      };
      image.src = "https://youtube.com/favicon.ico";
    });
  }


});