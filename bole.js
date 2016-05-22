window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var audioCtx = new AudioContext();
var analyser = audioCtx.createAnalyser();
var ctx = null;
analyser.minDecibels = -80;
analyser.maxDecibels = -10;
analyser.fftSize = 2048;
analyser.smoothingTimeConstant = 0.;

var msPerBeat = 60000 / 110.;
var musicScore = [[-3, 2], [-1, 2.5], [0, 3], [4, 3.5], [9, 4], [-3, 6], [-1, 6.5], [0, 7], [4, 7.5], [9, 8], [14, 10], [12, 10.5], [11, 11], [12, 11.5], [9, 12], [-3, 18], [-1, 18.5], [0, 19], [4, 19.5], [9, 20], [-3, 22], [-1, 22.5], [0, 23], [4, 23.5], [9, 24], [14, 26], [12, 26.5], [11, 27], [12, 27.5], [9, 28]];
var notePlayRecord = [];
var gameScore = 0;

var currentInterface = "welcome";
var globalOffset = 80;

// Global Functions
function ellapseTime() {
    var endTime = new Date().getTime();
    return endTime - gameBeginTime;
}

function indexToFrequency(index) {
    return index * audioCtx.sampleRate / analyser.fftSize;
}

function frequencyToPitch(frequency)
{
	return Math.round(Math.log2(frequency / 440) * 12.) - 3;
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

function renderOptions() {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(210 + 230, 200);
    ctx.lineTo(210 + 230, 430);
    ctx.stroke();

    if (optionLastHit != 0.) {
        ctx.beginPath();
        ctx.moveTo(210 + 920 * optionLastHit, 200);
        ctx.lineTo(210 + 920 * optionLastHit, 430);
        ctx.stroke();
    }

    ctx.strokeStyle = "#FF0000";
    var barCount = ellapseTime() / msPerBeat / 4;
    ctx.beginPath();
    ctx.moveTo(210 + 920 * (barCount % 1), 200);
    ctx.lineTo(210 + 920 * (barCount % 1), 430);
    ctx.stroke();
}

function drawLines() {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 2; j++) {
            ctx.moveTo(230 + 460 * i, 200 + 260 * j);
            ctx.lineTo(230 + 460 * i, 430 + 260 * j);
        }
    }
    ctx.stroke();

    var barCount = ellapseTime() / msPerBeat / 4;
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo(230 + 460 * (barCount % 2), 200 + 260 * (barCount % 4 >= 2));
    ctx.lineTo(230 + 460 * (barCount % 2), 430 + 260 * (barCount % 4 >= 2));
    ctx.stroke();
}

function renderGame() {
    drawLines();

    currentBeatCount = ellapseTime() / msPerBeat;
    for (note in musicScore) {
        if (musicScore[note][1] < currentBeatCount - 0.3 || musicScore[note][1] >= currentBeatCount + 15)
            continue;
        var barCount = musicScore[note][1] / 4.;
        var barLine = barCount % 4 >= 2;
        ctx.beginPath();
        ctx.strokeStyle = "#000000";
        for (var i = 5; i <= pitchToScoreLine(musicScore[note][0]); i += 2)
        {
            ctx.moveTo(220 + 460 * (barCount % 2), 249 + 260 * barLine - i * 7);
            ctx.lineTo(240 + 460 * (barCount % 2), 249 + 260 * barLine - i * 7);
        }
        ctx.stroke();
        if (musicScore[note][1] < currentBeatCount)
            ctx.fillStyle = "rgba(0, 0, 0, " + (1. - (currentBeatCount - musicScore[note][1]) / 0.3) + ")";
        else if (musicScore[note][1] >= currentBeatCount + 14.7)
            ctx.fillStyle = "rgba(0, 0, 0, " + ((currentBeatCount + 15 - musicScore[note][1]) / 0.3) + ")";
        else
            ctx.fillStyle = "#000000"
        drawNote(230 + 460 * (barCount % 2), 249 + 260 * barLine - pitchToScoreLine(musicScore[note][0]) * 7);
    }

    ctx.beginPath();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
    ctx.moveTo(0, 700);
    for (i in fftDataArray)
        ctx.lineTo(i * 3, 700 - fftDataArray[i] * 3.);
    ctx.stroke();

    document.getElementById("scorelabel").innerText = gameScore;
}

// Logic Functions
var optionLastHit = 0.;
function analyseOptions() {
    var maxFrequency = indexToFrequency(fftDataArray.indexOf(Math.max.apply(null, fftDataArray)));
    document.title = Math.round(maxFrequency) + " Hz";
    
    var barCount = (ellapseTime() - globalOffset) / msPerBeat / 4;
    if (barCount % 1 >= 0.9)
        optionLastHit = 0.;
    if (frequencyToPitch(maxFrequency) == -3 && optionLastHit == 0. && barCount % 1 <= 0.5)
        optionLastHit = barCount % 1;
}

function analysePlaying() {
    var maxFrequency = indexToFrequency(fftDataArray.indexOf(Math.max.apply(null, fftDataArray)));
    document.title = Math.round(maxFrequency) + " Hz";
    var currentBeatCount = (ellapseTime() - globalOffset) / msPerBeat;
    for (note in musicScore) {
        if (Math.abs(musicScore[note][1] - currentBeatCount) <= 0.1 &&
            frequencyToPitch(maxFrequency) == musicScore[note][0] &&
            !notePlayRecord[note]) {
            notePlayRecord[note] = true;
            gameScore += 1;
        }
    }
}

function analyseAudio() {
    var bufferLength = analyser.frequencyBinCount;
    fftDataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(fftDataArray);

    switch (currentInterface) {
        case "welcome":
            break;
        case "options":
            analyseOptions();
            break;
        case "playing":
            analysePlaying();
            break;
    }
}

// Main Loop
function timerEvent() {
    analyseAudio();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentInterface == "options")
        renderOptions();
    else if(currentInterface == "playing")
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
            notePlayRecord = [];
            gameBeginTime = new Date().getTime();
            timerEvent();
            break;
        case 27:
            switchInterface("welcome");
    }
}

window.ontouchmove = function (event) {
    return false;
}

function switchInterface(newInterface) {
    document.getElementById(currentInterface).style.visibility = "hidden";
    document.getElementById(newInterface).style.visibility = "visible";
    currentInterface = newInterface;
    gameBeginTime = new Date().getTime();
    timerEvent();
}
