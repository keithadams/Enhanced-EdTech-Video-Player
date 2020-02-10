var Subtitles = function() {
    var subtitles;

    function init(videoSubtitles) {        
        subtitles = videoSubtitles;
    }

    function getCurrentSubtitle(timestampSeconds) {
        if (!subtitles) return "";

        for(var i = 0; i < subtitles.length; i++) {
            var start = parseFloat(subtitles[i].start);
            var duration = parseFloat(subtitles[i].dur);
            var end = (i < subtitles.length-1) ? parseFloat(subtitles[i+1].start) : start + duration;

            if (timestampSeconds >= start && timestampSeconds < end) {
                return subtitles[i].text
            }
        }

        return "";
    }

    return {
        "getCurrentSubtitle": getCurrentSubtitle,
        "init": init
    };
}();