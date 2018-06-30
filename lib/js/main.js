/*****
 **
 ** DATA CONSTRUCTS
 **
 *****/

window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
var ctx = new AudioContext();
var masterGain = ctx.createGain();
masterGain.value = 0.5;
masterGain.connect(ctx.destination);
var oscs = {}

const currentBuffer = {
    1: [
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        {scale: 'Maj',key:'C'}
    ],
    2: [
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        {scale: 'Maj',key:'C'}
    ],
    3: [
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        {scale: 'Maj',key:'C'}
    ],
    4: [
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        {scale: 'Maj',key:'C'}
    ],
    5: [
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        {scale: 'Maj',key:'C'}
    ],
    6: [
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        {scale: 'Maj',key:'C'}
    ],
    7: [
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        {scale: 'Maj',key:'C'}
    ],
    'title': null,
    'tempo': [120],
    'activeSequence': 1,
    'activeVoice': 1,
}

const scales = ['Maj','Min'];
const key = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B','B#']
const testNotes = [261.63,146.83,164.81,174.61,196.00,220.00,246.94]
const state = {
    playing: false,
    recording: false,
    recording_in_memory: false,
    slice: 0
}

let engine;

var notes = {
    'C3': 130.81,
    'C#3': 138.59,
    'Db3': 138.59,
    'D3': 146.83,
    'D#3': 155.56,
    'Eb3': 155.56,
    'E3': 164.81,
    'F3': 174.61,
    'F#3': 185.00,
    'Gb3': 185.00,
    'G3': 196.00,
    'G#3': 207.65,
    'Ab3': 207.65,
    'A3': 220.00,
    'A#3': 233.08,
    'Bb3': 233.08,
    'B3': 246.94,
    'C4': 261.63,
    'C#4': 277.18,
    'Db4': 277.18,
    'D4': 293.66,
    'D#4': 311.13,
    'Eb4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4': 369.99,
    'Gb4': 369.99,
    'G4': 392.00,
    'G#4': 415.30,
    'Ab4': 415.30,
    'A4': 440.00,
    'A#4': 466.16,
    'Bb4': 466.16,
    'B4': 493.88,
    'C5': 523.25,
    'C#5': 554.37,
    'Db5': 554.37,
    'D5': 587.33,
    'D#5': 622.25,
    'Eb5': 622.25,
    'E5': 659.26,
    'F5': 698.46,
    'F#5': 739.99,
    'Gb5': 739.99,
    'G5': 783.99,
    'G#5': 830.61,
    'Ab5': 830.61,
    'A5': 880.00,
    'A#5': 932.33,
    'Bb5': 932.33,
    'B5': 987.77,
};

/*****
 **
 ** SUPPORT FUNCTIONS
 **
 *****/

function buildPads(sequence){
    $('#pads').empty();
    for (let col = 0; col < 8; col++){
        let colHolder = $('<div>',{'class':'padColHolder','data-col':col});
        for (let pad = 0; pad < 7; pad++){
            let classList = sequence[col][pad] ? 'pad active' : 'pad';
            let padDiv = $('<div>',{'class':classList,'data-row':pad,'data-col':col});
            // let minus = $('<div>',{'class':'padMinus','data-row':pad,'data-col':col}).text('-');
            // let plus = $('<div>',{'class':'padPlus','data-row':pad,'data-col':col}).text('+');
            // colHolder.append(padDiv.append(minus,plus));
            colHolder.append(padDiv);
        }
        $('#pads').append(colHolder);
    }
}

function updateReadouts(){
    let sequence = $('.bankRow.sequence .bankButton.active').text();
    $('.tempoReadout .readoutDisplay').text(currentBuffer.tempo);
    $('.scaleReadout .readoutDisplay').text(currentBuffer[sequence]['scale']);
    $('.keyReadout .readoutDisplay').text(currentBuffer[sequence]['key']);
}



/*****
 **
 ** ON LOAD
 **
 *****/

buildPads(currentBuffer[currentBuffer.activeSequence]);
updateReadouts();




/*****
 **
 ** CLICK HANDLERS
 **
 *****/

$('#pads').on('click','.pad',function(e){
    let col = $(this).attr('data-col');
    let row = $(this).attr('data-row');
    let sequence = $('.bankRow.sequence .bankButton.active').text();
    let sound = $('.bankRow.voice .bankButton.active').text();

    if ($(this).hasClass('active')){
        currentBuffer[sequence][col][row] = null;
        $(this).removeClass('active');
    } else {
        currentBuffer[sequence][col][row] = {
            note: testNotes[row],
            voice: sound
        };
        $(this).addClass('active');
    }
});


$('.bankButton').on('click',function(){
    let bank;
    let bankNum;
    if ($(this).hasClass('sequence')){
        bank = 'sequence';
    } else {
        bank = 'voice';
    }



    $(`.${bank}.bankButton.active`).removeClass('active');
    $(this).addClass('active');
    currentBuffer['active'+ bank[0].toUpperCase() + bank.substr(1)] = $(this).text();

    if (bank === 'sequence'){
        $('.scaleReadout .readoutDisplay').text(currentBuffer[currentBuffer.activeSequence][8].scale);
        $('.keyReadout .readoutDisplay').text(currentBuffer[currentBuffer.activeSequence][8].key);
        buildPads(currentBuffer[currentBuffer.activeSequence]);
    }
});
//--|
//----]
//--|
$('.play').on('click',function(){
    var noteLength = 1 / (currentBuffer['tempo'][0]/60) * 0.5 * 1000;
    if (!$(this).hasClass('playing')){
        $(this).addClass('playing');
        state.playing = true;
        engine = setInterval(function(){
            console.log(oscs);
            for (let x in oscs){
                oscs[x][0].stop(0);
                oscs[x][1].stop(0);
                oscs[x][0].disconnect();
                oscs[x][1].disconnect();
            }
            oscs = {};
            freqList = currentBuffer[currentBuffer['activeSequence']][state.slice].filter(sound => sound !== null);
            freqList.forEach(function(note){
                playNote(note.note);
            });
            state.slice = state.slice + 1 < 8 ? state.slice + 1 : 0;
        },noteLength)
    }
});
//--|
//----]
//--|
$('.stop').on('click',function(){
    for (let x in oscs){
        oscs[x][0].stop(0);
        oscs[x][1].stop(0);
        oscs[x][0].disconnect();
        oscs[x][1].disconnect();
    }

    if ($('.play').hasClass('playing')){
        $('.play').removeClass('playing');
        state.playing = false;
        clearInterval(engine);
    }
})


function playNote(note){
    var osc = ctx.createOscillator();
    var osc2 = ctx.createOscillator();

    osc.frequency.value = note;
    osc2.frequency.value = note;

    osc.type = 'square';
    osc2.type = 'triangle';

    osc.detune.value = -10;
    osc2.detune.value = 10;

    osc.connect(masterGain);
    osc2.connect(masterGain);

    masterGain.connect(ctx.destination);

    oscs[note] = [osc,osc2];

    osc.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
}

function stopNote(note){
    oscs[note].stop(ctx.currentTime);
}
