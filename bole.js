window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var audioCtx = new AudioContext();
var analyser = audioCtx.createAnalyser();
analyser.fftSize = 1024;

var msPerBeat = 60000 / 118.;

function ellapseTime() {
    var endTime = new Date().getTime();
    return endTime - gameBeginTime;
}

function indexToFrequency(index) {
    return index * analyser.fftSize * audioCtx.sampleRate;
}

function drawLines() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 2; j++) {
            ctx.beginPath();
            ctx.moveTo(230 + 460 * i, 200 + 260 * j);
            ctx.lineTo(230 + 460 * i, 430 + 260 * j);
            ctx.stroke();
        }
    }

    var barCount = ellapseTime() / msPerBeat / 4;
    ctx.beginPath();
    ctx.moveTo(230 + 460 * (barCount - Math.floor(barCount / 2) * 2), 200 + 260 * (Math.floor(barCount) % 4 >= 2));
    ctx.lineTo(230 + 460 * (barCount - Math.floor(barCount / 2) * 2), 430 + 260 * (Math.floor(barCount) % 4 >= 2));
    ctx.stroke();
}

function renderGame() {
    drawLines();

    ctx.beginPath();
    ctx.ellipse(460, 264, 9, 7, -25 * Math.PI / 180, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(632, 235, 9, 7, -25 * Math.PI / 180, 0, 2 * Math.PI);
    ctx.fill();
}

function timerEvent() {
    bufferLength = analyser.frequencyBinCount;
    fftDataArray = new Float32Array(bufferLength);
    analyser.getFloatFrequencyData(fftDataArray);
    document.title = Math.round(indexToFrequency(fftDataArray.indexOf(Math.max.apply(null, fftDataArray)))) + " Hz";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    renderGame();

    setTimeout(timerEvent, 0);
}

window.onload = function () {
    canvas = document.getElementById("cmain");
    ctx = canvas.getContext("2d");

    navigator.getUserMedia({ audio: true }, function (stream) {
        var microphone = audioCtx.createMediaStreamSource(stream);
        microphone.connect(analyser);
        gameBeginTime = new Date().getTime();
        timerEvent();
    }, function () { });
}
