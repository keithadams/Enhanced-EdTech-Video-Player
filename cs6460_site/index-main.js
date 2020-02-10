// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.id = 'iframe-youtube';
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function fires when IframeAPI is done loading
function onYouTubeIframeAPIReady() {
    YouTubePlayer.init('player');
}


var playerWidth = document.getElementById('player').offsetWidth;
var playerHeight = document.getElementById('player').offsetHeight;

jQuery(document).ready(function() {
    
    Rectangle.init();
    VideoCrop.init('player');
    ProgressBar.init('progress-bar');
    Comment.init();
    Subtitles.init(subtitles);


    var duration = 368;
    //var comments = generateRandomComments(10,10,10,10); // generates sequential comments
    //var comments = generateRandomComments(3000,playerWidth,playerHeight,duration); // generates random comments, random time,rectangle,etc
    // var comments = generateCommentsFromSource(animals,3000); // random animal text
    var comments = generateCommentsFromTextArray(khanCommentsText);
    CommentSection.init('comment-section',comments,duration);
});