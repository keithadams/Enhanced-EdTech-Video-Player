var VideoCrop = function () {

    // The variable jcrop_api will hold a reference to the
    // Jcrop API once Jcrop is instantiated.
    var jcrop_api;
    var selectionCoordinates;

    function init(elementId){
        if (!jQuery().Jcrop) {;
            return;
        }
        
        App.addResizeHandler(handleResponsive);
        handleResponsive();

        $('#' + elementId).Jcrop({
            bgFade: true,
            bgColor: 'black',
            bgOpacity: 0.90,
            onChange:   onChange,
            onSelect:   showCoords,
            // setSelect: [c.x,c.y,c.x2,c.y2],
            // addClass: " jcrop-dark",
            onRelease: releaseCheck

        },function(){
            jcrop_api = this;
            // jcrop_api.animateTo([0,0,100,100]);
        });

        // Attach interface buttons
        $('#attach').click(function(e) {
            jcrop_api.enable();
            animateTo([0,0,100,100]);
            return false;
        });
        $('#detach').click(function(e) {
            // Destroy Jcrop widget, restore original state
            // jcrop_api.destroy();

            // Update the interface to reflect un-attached state
            jcrop_api.release();
            jcrop_api.disable();
          return false;
        });

    }

    // This function is bound to the onRelease handler...
    // In certain circumstances (such as if you set minSize
    // and aspectRatio together), you can inadvertently lose
    // the selection. This callback re-enables creating selections
    // in such a case. Although the need to do this is based on a
    // buggy behavior, it's recommended that you in some way trap
    // the onRelease callback if you use allowSelect: false
    function releaseCheck(){
        jcrop_api.setOptions({ allowSelect: true });
        // $('#can_click').attr('checked',false);
    };

    function onChange(c){
        selectionCoordinates = [c.x,c.y,c.x2,c.y2];
        showCoords(c);
    }

    function getSelectionCoordinates(){
        console.log(selectionCoordinates);
        return selectionCoordinates;
    }

    function showCoords(c){
        $('#x1').text(c.x);
        $('#y1').text(c.y);
        $('#x2').text(c.x2);
        $('#y2').text(c.y2);
        $('#w').text(c.w);
        $('#h').text(c.h);
    };

    var demo7 = function() {
        // var c = {"x":0,"y":0,"x2":100,"y2":100,"w":100,"h":100};
    }

    var handleResponsive = function() {
      if ($(window).width() <= 1024 && $(window).width() >= 678) {
        $('.responsive-1024').each(function(){
            $(this).attr("data-class", $(this).attr("class"));
            $(this).attr("class", 'responsive-1024 col-md-12');
        }); 
      } else {
        $('.responsive-1024').each(function(){
          if ($(this).attr("data-class")) {
            $(this).attr("class", $(this).attr("data-class"));  
            $(this).removeAttr("data-class");
          }
        });
      }
    }

    function animateTo(coordinatesArray){
        if(coordinatesArray != null) {
            jcrop_api.animateTo(coordinatesArray);
        }
        else {
            jcrop_api.animateTo([0,0,0,0]);
        }
    }

    return {
        "getSelectionCoordinates":getSelectionCoordinates,
        "animateTo":animateTo,
        "init":init
    };

}();
