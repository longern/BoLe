window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var context = new AudioContext();
navigator.getUserMedia({ audio: true }, function (stream) {
    var microphone = context.createMediaStreamSource(stream);
    var filter = context.createBiquadFilter();
    console.log("hi");

    microphone.connect(filter);
    filter.connect(context.destination);
}, function () { });
