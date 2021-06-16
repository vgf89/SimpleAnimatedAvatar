
// Controls the volume above which the avatar animates.
// Lower values make it more sensitive and higher values make it
// less sensitive. If you click F12 in your browser and open the
// Console tab, you will see your current microphone volume.
var activation_volume = 3.0;

// Controls how far the avatar moves vertically in pixels
var maxmargintop = 40;

// Controls the minimum brightness percentage of the avatar.
// Use values betwen 0.0 and 1.0. Other values distort the colors (overexpose)
var minbrightness = 0.6;

// Controls animation speed. Use values between 0 and 1.
// values closer to 0 make the animation slow.
// Values closer to 1 make the animation fast.
var lerpspeed = 0.7;





// These don't need to be changed.
var minmargintop = 10;
var margintop = 10;
var lastmargintop = 10;

var brightness = 1.0;
var lastbrightness = 1.0;

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
if (navigator.getUserMedia) {
    navigator.getUserMedia({
        audio: true
    },
        function (stream) {
            audioContext = new AudioContext();
            analyser = audioContext.createAnalyser();
            microphone = audioContext.createMediaStreamSource(stream);
            javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;

            filter = audioContext.createBiquadFilter();
            filter.Q.value = 8.30;
            filter.frequency.value = 355;
            filter.gain.value = 3.0;
            filter.type = 'bandpass';

            // Connects the microphone to a filter, then
            // to the volume analyzer.
            microphone.connect(filter);
            filter.connect(analyser);

            // If the noise supression causes issues that aren't
            // fixed by adjusting activation_volume, try disable the 
            // noise supression by commenting out lines 56 and 57,
            // and uncommenting line 61.
            // microphone.connect(analyser);


            analyser.connect(javascriptNode);
            javascriptNode.connect(audioContext.destination);

            javascriptNode.onaudioprocess = function () {
                var array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                var values = 0;

                var length = array.length;
                for (var i = 0; i < length; i++) {
                    values += (array[i]);
                }

                var average = values / length;


                // Grab the avatar element so we can adjust its properties
                var avatar = document.getElementById('avatar')

                if (average > activation_volume) {
                    margintop = lerp(lastmargintop, minmargintop, lerpspeed);
                    brightness = lerp(lastbrightness, 1.0, lerpspeed);
                } else {
                    margintop = lerp(lastmargintop, maxmargintop, lerpspeed);
                    brightness = lerp(lastbrightness, minbrightness, lerpspeed);
                }

                
                avatar.style.marginTop = '' + margintop + 'px';
                avatar.style.filter = 'brightness(' + brightness + ')';

                lastbrightness = brightness;
                lastmargintop = margintop;
                console.log('microphone volume = ' + average)

            } // end fn stream
        },
        function (err) {
            console.log("The following error occured: " + err.name)
        });
} else {
    console.log("getUserMedia not supported");
}

function lerp (v1, v2, amount)
{
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return v1 + (v2 - v1) * amount;
}