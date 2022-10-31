
// If the banner of the page has a video
if($('#banner__player').length && window.innerWidth >= 576){

    // Get the video id
    video_id = $('#banner__player').attr('data-video');
    
    // Add the buttons
    $('#banner__player').closest('.banner').append('<div class="banner__btns"><button class="btn btn-secondary banner__pause" data-video="#banner__player"><div class="svg__wrapper svg__wrapper--fill"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/public/svg/ui.svg#pause"></use></svg></div>Pause</button></div>');

    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    var player;
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('banner__player', {
            height: '100%',
            width: '100%',
            videoId: video_id,
            playerVars: {'autoplay': 1, 'controls': 0,'autohide':1,'wmode':'opaque','version':3,'loop':1,'playlist': video_id,'rel': 0,'disablekb':1,'showinfo':0},
            events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
            }
        });
    }
    

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {

        event.target.playVideo();
        event.target.mute();
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    var done = false;
    function onPlayerStateChange(event) {

        if (event.data == YT.PlayerState.PLAYING) {
            //setTimeout(stopVideo, 6000);
            //done = true;

            $('#banner__player').closest('.banner').addClass('loaded');
        }
    }
    function stopVideo() {

        player.stopVideo();
    }

    $('body').on('click','.banner__pause',function(e){

        if(!$(this).hasClass('active')){
            player.pauseVideo();
            $(this).addClass('active');

            $(this).html('<div class="svg__wrapper svg__wrapper--fill"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/public/svg/ui.svg#play"></use></svg></div>Play&nbsp;&nbsp;&nbsp;');
        }
        else {
            player.playVideo();
            $(this).removeClass('active');

            $(this).html('<div class="svg__wrapper svg__wrapper--fill"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/public/svg/ui.svg#pause"></use></svg></div>Pause');
        }
    });
}