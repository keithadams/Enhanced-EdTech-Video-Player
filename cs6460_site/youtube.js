var YouTubePlayer = function() {
    var player,
        hasPlayed = false,
        time_update_interval = 0;

    function init(elementId) {

        console.log('initting');
        console.log(elementId);

        player = new YT.Player(elementId, {
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
              // 'onPlaybackQualityChange': onPlayerPlaybackQualityChange,
              // 'onError': onPlayerError
            }
        });


    }

    // This function is called by initialize()
    function updateProgressBar(){
        // Update the value of our progress bar accordingly.
        // $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
        ProgressBar.set((player.getCurrentTime() / player.getDuration()) * 100);
    }

    function formatTime(time){
        time = Math.round(time);
        var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return minutes + ":" + seconds;
    }

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        player.playVideo();
        // Update the controls on load
        // updateTimerDisplay();
        updateProgressBar();

        // Clear any old interval.
        clearInterval(time_update_interval);

        // Start interval to update elapsed time display and
        // the elapsed part of the progress bar every second.
        time_update_interval = setInterval(function () {
            // updateTimerDisplay();
            updateProgressBar();
        }, 1000);

    }

    function onPlayerStateChange(event) {
        if (!hasPlayed) {
            if (event.data == YT.PlayerState.PLAYING) {
                hasPlayed = true;
                player.pauseVideo();
            }
        }

    }

    function getCurrentTime(){
        return player.getCurrentTime();
    }

    function stopVideo() {
      player.stopVideo();
    }

    function playVideo() {
      player.playVideo();
    }

    function pauseVideo() {
        player.pauseVideo();
    }

    function seekTo(seconds) {
      player.seekTo(seconds);
      updateProgressBar();
    }

    function getDuration() {
      return player.getDuration();
    }

    return {
        "init": init,
        "getCurrentTime": getCurrentTime,
        "playVideo": playVideo,
        "pauseVideo": pauseVideo,
        "seekTo": seekTo,
        "getDuration":getDuration
    };
}();