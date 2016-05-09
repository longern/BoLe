window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var context = new AudioContext();
var analyser = context.createAnalyser();

navigator.getUserMedia({ audio: true }, function (stream) {
    var microphone = context.createMediaStreamSource(stream);
    var filter = context.createBiquadFilter();
    console.log("hi");

    microphone.connect(filter);
    filter.connect(context.destination);
}, function () { });

window.onload = function () {
    ctx = document.getElementById("cmain").getContext("2d");

    ctx.beginPath();
    ctx.moveTo(170, 200);
    ctx.lineTo(170, 430);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(300, 264, 9, 7, -25 * Math.PI / 180, 0, 2 * Math.PI);
    ctx.fill();
}
