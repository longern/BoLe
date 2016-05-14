window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var audioCtx = new AudioContext();
var analyser = audioCtx.createAnalyser();
var ctx = null;
analyser.fftSize = 1024;

var msPerBeat = 60000 / 110.;
var musicScore = [[-3, 2], [-1, 2.5], [0, 3], [4, 3.5], [9, 4], [-3, 6], [-1, 6.5], [0, 7], [4, 7.5], [9, 8], [14, 10], [12, 10.5], [11, 11], [12, 11.5], [9, 12], [-3, 18], [-1, 18.5], [0, 19], [4, 19.5], [9, 20], [-3, 22], [-1, 22.5], [0, 23], [4, 23.5], [9, 24], [14, 26], [12, 26.5], [11, 27], [12, 27.5], [9, 28]];
var gameScore = 0;

// Global Functions
function ellapseTime() {
    var endTime = new Date().getTime();
    return endTime - gameBeginTime;
}

function indexToFrequency(index) {
    return index * audioCtx.sampleRate / analyser.fftSize;
}

function pitchToScoreLine(pitch) {
    return Math.round(pitch / 12. * 7.);
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

    currentBeatCount = ellapseTime() / msPerBeat;
    for (note in musicScore) {
        if (musicScore[note][1] < currentBeatCount - 0.1 || musicScore[note][1] >= currentBeatCount + 15)
            continue;
        var barCount = musicScore[note][1] / 4.;
        var barLine = Math.floor(barCount) % 4 >= 2;
        drawNote(230 + 460 * (barCount - Math.floor(barCount / 2) * 2), 249 + 260 * barLine - pitchToScoreLine(musicScore[note][0]) * 7);
    }

    document.getElementById("scorelabel").innerText = gameScore;
}

// Logic Functions
function analyseAudio() {
    var bufferLength = analyser.frequencyBinCount;
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
    }, function () { });
}

window.onkeydown = function (event) {
    switch (event.which) {
        case 13:
            gameBeginTime = new Date().getTime();
            timerEvent();
            break;
    }
}
