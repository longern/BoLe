window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var audioCtx = new AudioContext();
var analyser = audioCtx.createAnalyser();
var ctx = null;
analyser.fftSize = 1024;

var msPerBeat = 60000 / 105.;
var musicScore = [[-3, 0], [-1, 1], [0, 2], [4, 3], [9, 4], [-3, 8], [-1, 9], [0, 10], [4, 11], [9, 12], [14, 16], [12, 17], [11, 18], [12, 19], [9, 20], [-3, 24], [-1, 25], [0, 26], [4, 27], [9, 28], [-3, 32], [-1, 33], [0, 34], [4, 35], [9, 36], [14, 48], [12, 49], [11, 50], [12, 51], [9, 52]];
var gameScore = 0.;

// Global Functions
function ellapseTime() {
    var endTime = new Date().getTime();
    return endTime - gameBeginTime;
}

function indexToFrequency(index) {
    return index * audioCtx.sampleRate / analyser.fftSize;
}

// Render Functions
function drawNote(x, y) {
    ctx.beginPath();
    ctx.ellipse(x, y, 9, 7, -25 * Math.PI / 180, 0, 2 * Math.PI);
    ctx.fill();
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawLines();

    drawNote(460, 264);
    drawNote(632, 235);
}

// Logic Functions
function analyseAudio() {
    bufferLength = analyser.frequencyBinCount;
    fftDataArray = new Float32Array(bufferLength);
    analyser.getFloatFrequencyData(fftDataArray);
    document.title = Math.round(indexToFrequency(fftDataArray.indexOf(Math.max.apply(null, fftDataArray)))) + " Hz";
}

// Main Loop
function timerEvent() {
    analyseAudio();
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
