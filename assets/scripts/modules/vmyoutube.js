/**
 * Integrate YouTube videos as a way of hosting videos without the overhead and worry surrounding hosting vides. i.e. file sizes, performance and accessibility.
 */
class vmYoutube {

  /** @param {HTMLElement} embed dom element */
  constructor(embed){

    let createEmbed = this.createEmbed;

    // If the scripts is already loaded then lets just create the embed
    if(document.body.classList.contains('youtubeLoaded')){
      embed.addEventListener('click', function(e){
        // loop parent nodes from the target to the delegation node
        for (var target = e.target; target && target != this; target = target.parentNode) {
      
          if (target.matches('a:not([data-modal-youtube]')) {
  
            e.preventDefault();
            createEmbed(embed,target);
            break;
          }
        }
      }, false);
    }
    else {
      this.loadScripts(embed, this.createEmbed);
    }
  }

  /**
   * Load the YouTube scripts before trying to create the embed
   * @param {HTMLElement} embed dom element
   * @param {Function} createEmbed function to create the embed after script loaded.
   */
  loadScripts(embed, createEmbed){
    
    return new Promise((resolve, reject) => {

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
        tag.onload = () => {

          embed.addEventListener('click', function(e){
            // loop parent nodes from the target to the delegation node
            for (var target = e.target; target && target != this; target = target.parentNode) {
          
              if (target.matches('a:not([data-modal-youtube]')) {
      
                e.preventDefault();
                createEmbed(embed,target);
                break;
              }
            }
          }, false);
        }   

      };
      image.onerror = function(){
        reject(false);
      };
      image.src = "https://youtube.com/favicon.ico";
    });
  
  }

  /**
   * Create the YouTube embed after the user has clicked on it.
   * @param {HTMLElement} embed dom element
   */
  createEmbed(embed,target){

    // If there is more than one video lets make sure there is only one playing at a time.
    if(typeof window.player != "undefined" && typeof window.player.pauseVideo == "function")
      window.player.pauseVideo();


    var video_id = target.getAttribute('data-id');
    var link_id = target.getAttribute('id')
    
    // create an id to pass t the script if one isn't present
    if(typeof link_id == 'undefined' || link_id == null){

      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      link_id = randLetter + Date.now();
      target.setAttribute('id',link_id);
    }

    // This function creates an <iframe> (and YouTube player) after the API code downloads.          
    function onYouTubeIframeAPIReady() {

      window.player = new YT.Player(link_id, {
        height: '100%',
        width: '100%',
        videoId: video_id,
        playerVars: { 
          'modestbranding': 1,
          'playsinline': 1,
          'rel': 0,
          'showinfo': 0
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });

    }
    onYouTubeIframeAPIReady();
    
    // The API will call this function when the video player is ready.
    function onPlayerReady(event) {
      // Play the video straight away
      event.target.playVideo();
      
    }

    // The API calls this function when the player's state changes.
    // The function indicates that when playing a video (state=1)
    var done = false;
    function onPlayerStateChange(event) {
      
      if (event.data == YT.PlayerState.PLAYING && !done) {
        
        var link = document.getElementById(link_id);
        link.classList.add('player-ready');

        done = true;
      }

      var states = {
        "-1" :"unstarted",
        "0" : "ended",
        "1" : "playing",
        "2" : "paused",
        "3" : "buffering",
        "5" : "video cued"
      }

      // Add to data layer
      if(typeof window.dataLayer === "undefined"){ window.dataLayer = []; }
      dataLayer.push({
        "event": "Youtube video state change",
        "data": {
          "video": video_id,
          "state": states[event.data],
          "time": typeof window.player.getCurrentTime == "function" ? window.player.getCurrentTime() : 0
        }
      });
      
    }
  }
}

export default vmYoutube