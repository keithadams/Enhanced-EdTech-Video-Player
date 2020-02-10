function formatTime(time){
    time = Math.round(time);
    var minutes = Math.floor(time / 60),
    seconds = time - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ":" + seconds;
}

// sequential comment generator, text "Comment x"
function generateComments(num){
    var comments = [];
    for(var i = 0; i < num; i++) {
        comment = {};
        comment.text = "Comment " + i;
        comment.seconds = i * 100;
        comment.coordinates = [i*10,i*10,100 + i*10,100 + i*10];
        comments.push(comment);
    }

    return comments;
}

// random comment generator, text containing timestamp and coordinates
function generateRandomComments(num,playerWidth,playerHeight,duration){
    function getRandomCoordinates(w,h){
        var x1 = Math.floor(Math.random() * w);
        var x2 = Math.floor(Math.random() * w);
        var y1 = Math.floor(Math.random() * h);
        var y2 = Math.floor(Math.random() * h);
        return [x1,y1,x2,y2];
    }

    function getRandomSeconds(duration){
        return Math.floor(Math.random() * duration);
    }
    
    var comments = [];
    for(var i = 0; i < num; i++){
        var comment = {};
        comment.seconds = getRandomSeconds(duration);
        var timestamp = formatTime(comment.seconds);
        comment.coordinates = getRandomCoordinates(playerWidth, playerHeight);
        comment.text = "<b>Comment " + i + "</b><br><br><b>Time:</b> " + timestamp + "<br><b>Selection:</b> [" + comment.coordinates + "]";
        
        comments.push(comment);
    }
    return comments;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomStringFromArraySource(source,numItems) {
    var result = [];
    
    for(var i = 0; i < numItems; i++){
        randInd = getRandomInt(0,source.length);
        result.push(source[randInd]);
    }
    
    return result.join(" ");
}

function generateCommentsFromSource(source,num){
    var comments = [];
    for(var i = 0; i < num; i++) {
        comment = {};
        // comment.text = "Comment " + i;
        comment.text = randomStringFromArraySource(source,getRandomInt(1,20));
        comment.seconds = i * 100;
        comment.coordinates = [i*10,i*10,100 + i*10,100 + i*10];
        comments.push(comment);
    }

    return comments;
}

function generateCommentsFromTextArray(textArray){
    var comments = [];

    for(var i = 0; i < textArray.length; i++) {
        comment = {};
        comment.text = textArray[i].text;
        comment.replies = textArray[i].replies;
        comment.seconds = textArray[i].seconds;
        comment.coordinates = textArray[i].coordinates;
        comments.push(comment);
    }

    return comments;

}
