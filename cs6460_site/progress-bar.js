var ProgressBar = function() {
    var slider;

    var init = function(elementId) {
        createSlider(elementId);
    }

    var createSlider = function(elementId) {
        slider = document.getElementById(elementId);

        noUiSlider.create(slider, {
            start: 0,
            connect: "lower",
            range: {
                'min':  0,
                'max':  100
            }
        });

        // 'slide' event listener
        slider.noUiSlider.on('slide', function(){
            var newTime = YouTubePlayer.getDuration() * (slider.noUiSlider.get() / 100);
            YouTubePlayer.seekTo(newTime);
        });
    }

    var set = function(value) {
        slider.noUiSlider.set(value);
    }

    var get = function() {
        return slider.noUiSlider.get();
    }

    return {
        "init": init,
        "set": set
    };

}();