var CommentSection = function() {
    var containerElement;
    var mediaListElement;
    var bm; // text relevancy sorter
    var commentsSaved;
    var duration;


    function init(elementId,comments,videoDuration) {      
        duration = videoDuration;

        commentsSaved = comments;

        container = document.getElementById(elementId);
        removeAll();
        mediaListElement = getMediaListElement();
        container.appendChild(mediaListElement);
        populateCommentSection(commentsSaved);
        bm = new BM25;
        addCommentsToBm25(comments);

    }

    function addCommentsToBm25(comments){
        var data = comments;
        var len = data.length;
        for (var i in data) {
            var comment = data[i]
            var doc = comment.text;

            // //add replies to document text
            // comment.replies.forEach(function(reply){
                // doc = doc + reply;
            // });

            bm.addDocument({id: i, body: doc});
        }
        bm.updateIdf();
    }

    function populateCommentSection(comments){
        comments.forEach(function(comment){
            mediaListElement.appendChild(getListElement(comment));
        });
    }

    function getMediaListElement(){
        // var node = document.createElement("UL");
        // node.className += "media-list";
        // return node;
        return getElementWithClass("ul","media-list");
    }

    function getMaxOfArray(numArray) {
        return Math.max.apply(null, numArray);
    }

    function getMinOfArray(numArray) {
        return Math.min.apply(null, numArray);
    }

    function getMaxOrder(numArray) {
        var order = [];
        
        numArray.forEach(function(x){
            var max = getMaxOfArray(numArray);
            var argmax = numArray.indexOf(max);
            order.push(argmax);
            numArray[argmax] = -Infinity;
        });
        
        return order;
        
    }

    function getMinOrder(numArray) {
        var order = [];
        
        numArray.forEach(function(x){
            var min = getMinOfArray(numArray);
            var argmin = numArray.indexOf(min);
            // console.log(min);
            // console.log(argmin);
            order.push(argmin);
            numArray[argmin] = Infinity;
        });
        
        return order;
        
    }

    function sortCommentsByTimestamp(seconds,comments=null){
        var sorted = [];

        if (comments == null)
            comments = commentsSaved;
        
        var diff = getTimestampDiff(seconds,comments,duration);
        
        // get order of indices from lowest to highest difference
        var reindex = getMinOrder(diff);
        
        // add comments in order of lowest to highest difference
        reindex.forEach(function(ind){
            sorted.push(comments[ind])
        });

        removeAll();
        mediaListElement = getMediaListElement();
        container.appendChild(mediaListElement);
        populateCommentSection(sorted);
    }

    function sortCommentsBySelection(selectionCoordinates,playerArea,comments=null){
        var sorted = [];

        if (comments == null)
            comments = commentsSaved;

        var diff = getRectangleDiff(selectionCoordinates,comments,playerArea);
        
        // get order of indices from lowest to highest difference
        var reindex = getMinOrder(diff);
        
        // add comments in order of lowest to highest difference
        reindex.forEach(function(ind){
            sorted.push(comments[ind])
        });

        removeAll();
        mediaListElement = getMediaListElement();
        container.appendChild(mediaListElement);
        populateCommentSection(sorted);
    }

    function sortCommentsByQuery(query,comments=null){
        var sorted = [];

        if (comments == null)
            comments = commentsSaved;

        var diff = getQueryDiff(query);
        
        // get order of indices from lowest to highest difference
        var reindex = getMinOrder(diff);
        
        // add comments in order of lowest to highest difference
        reindex.forEach(function(ind){
            sorted.push(comments[ind])
        });
        
        // commentsSaved = sorted;

        removeAll();
        mediaListElement = getMediaListElement();
        container.appendChild(mediaListElement);
        // populateCommentSection(commentsSaved);
        populateCommentSection(sorted);
    }

    function getTimestampDiff(seconds,comments,duration) {
        // get array of time difference from current timestamp for each comment
        var diff = comments.map(function(comment) {
            if (comment.seconds == null) return duration/duration; //normalized

            return Math.abs(comment.seconds - seconds)/duration; //normalized
        });

        return diff;
    }

    function getRectangleDiff(selectionCoordinates,comments,playerArea) {
        var diff = comments.map(function(comment) {
            if (selectionCoordinates == undefined) return 0;

            return Rectangle.compareRect(selectionCoordinates,comment.coordinates,playerArea) / (playerArea*2); //normalized
        });


        return diff;
    }

    function getQueryDiff(query) {
        var searchResults = bm.search(query);

        // get text relevancy scores
        var searchResultsSortedByIndex = searchResults.sort(function(a, b) {
            return parseInt(a.id) - parseInt(b.id);
        });
        var scoresOrderedByIndex = searchResultsSortedByIndex.map(function(e){return e._score;});

        var max = getMaxOfArray(scoresOrderedByIndex);

        scoresOrderedByIndex = scoresOrderedByIndex.map(function(e){return -e/max});


        return scoresOrderedByIndex;
    }


    function getUnifiedDiff(seconds,comments,duration,selectionCoordinates,playerArea,subtitle,query) {

        var diffTimestamp = getTimestampDiff(seconds,comments,duration);
        var diffRectangle = getRectangleDiff(selectionCoordinates,comments,playerArea);
        var diffSubtitle = getQueryDiff(subtitle);
        var diffQuestion = getQueryDiff(query);

        for(var i = 0; i < diffTimestamp.length; i++){
            diffTimestamp[i] = (1 * diffTimestamp[i]) + (1 * diffRectangle[i]) + (0.5 * diffSubtitle[i]) + (1 * diffQuestion[i]);
        }

        return diffTimestamp;
    }


    function sortCommentsByAll(seconds,selectionCoordinates,playerArea,query,subtitle,comments=null) {
        var sorted = [];

        if (comments == null)
            comments = commentsSaved;

        var diff = getUnifiedDiff(seconds,comments,duration,selectionCoordinates,playerArea,subtitle,query);

        // get order of indices from lowest to highest difference
        var reindex = getMinOrder(diff);
        
        // add comments in order of lowest to highest difference
        reindex.forEach(function(ind){
            sorted.push(comments[ind])
        });
        
        // commentsSaved = sorted;

        removeAll();
        mediaListElement = getMediaListElement();
        container.appendChild(mediaListElement);
        // populateCommentSection(commentsSaved);
        populateCommentSection(sorted);

        
    }

    function getRepliesHtml(comment) {
        if(!comment.replies) return "";

        var repliesHtml = "";

        comment.replies.forEach(function(reply){
            var replyHtml = [
                '<div class="media">',
                '    <div class="pull-left pull-top">',
                '        <div>',
                '            <i class="fa fa-angle-up"></i>',
                '        </div>',
                '        <div>',
                '            <i class="fa fa-angle-down"></i>',
                '        </div>',
                '    </div>',
                '    <div class="media-body">',
                '        <p>' + reply + '</p>',
                '    </div>',
                '</div><hr>'
                ].join('\n');
            repliesHtml = repliesHtml + "\n" + replyHtml;
        });

        return repliesHtml;
    }
    

    function getListElement(comment){
        // var timestamp = formatTime(comment.seconds);


        var repliesHtml = getRepliesHtml(comment);

        var commentCoordinateString = (comment.coordinates != null) ? '[' + comment.coordinates +']' : 'null';

        var s = [
                '<li class="media">',
                '    <div class="pull-left pull-top">',
                '        <div>',
                '            <i class="fa fa-angle-up"></i>',
                '        </div>',
                '        <div>',
                '            <i class="fa fa-angle-down"></i>',
                '        </div>',
                '    </div>',
                '    <div class="media-body">',
                '            <a href="javascript:Comment.show('+ comment.seconds + ',' + commentCoordinateString +');" style="float:right;" class="btn btn-sm btn-outline btn-circle blue-madison">',
                '                Show',
                '            </a>',
                '        <p>' + comment.text + '</p><hr>',
                // '        <div class="comment-extra">',
                // '            <a href="javascript:;" class="btn btn-icon-only default">',

                // '        </div><hr>',
                // '        <div class="comment-replies">',
                // '        </div>',
                repliesHtml,
                '    </div>',
                '</li>'
                ].join('\n');

        // return s;
        return getSingleElementFromHtmlString(s);
    }

    function getSingleElementFromHtmlString(s){
        var div = document.createElement('div');
        div.innerHTML = s;
        return div.firstChild;
    }

    function getElementWithClass(elementString,classString){
        var node = document.createElement(elementString);
        node.className += classString;
        return node;
    }

    function removeAll(){
        var myNode = container;
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
    }

    return {
        "sortCommentsByAll":sortCommentsByAll,
        "sortCommentsByTimestamp":sortCommentsByTimestamp,
        "sortCommentsBySelection":sortCommentsBySelection,
        "sortCommentsByQuery":sortCommentsByQuery,
        "removeAll": removeAll,
        "init": init
    };
}();