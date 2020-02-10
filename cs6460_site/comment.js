var Comment = function() {

    function init() {
    }

    function show(seconds,coordinatesArray) {

        if(seconds) {
            YouTubePlayer.pauseVideo();
            YouTubePlayer.seekTo(seconds);
            YouTubePlayer.pauseVideo();
        }

        // if(coordinatesArray) {
            VideoCrop.animateTo(coordinatesArray);
        // }
        
    }

    return {
        "show": show,
        "init": init
    };


}();