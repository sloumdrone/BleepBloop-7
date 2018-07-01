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

const options = {
    'scale': ['Maj','Min'],
    'key': ['C','D','D#']
}

const state = {
    playing: false,
    recording: false,
    recording_in_memory: false,
    slice: 0
}

let engine;



/*****
 **
 ** SUPPORT FUNCTIONS
 **
 *****/

function buildPads(sequence){
    $('#pads').empty();
    for (let col = 0; col < 8; col++){
        let colHolder = $('<div>',{'class':'padColHolder','data-col':col});
        if (col === 0){
            colHolder.addClass('active');
        }
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
        let key = currentBuffer[sequence][8]['key'];
        let scale = currentBuffer[sequence][8]['scale'];
        currentBuffer[sequence][col][row] = {
            note: row,
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
            for (let x in oscs){
                oscs[x][0].stop(0);
                oscs[x][1].stop(0);
                oscs[x][0].disconnect();
                oscs[x][1].disconnect();
            }
            oscs = {};
            $('.padColHolder.active').removeClass('active');
            $(".padColHolder[data-col='"+state.slice+"']").addClass('active');
            let buffer = currentBuffer[currentBuffer['activeSequence']]
            freqList = buffer[state.slice].filter(sound => sound !== null);
            freqList.forEach(function(sound){
                let pitch = keysAndScales[buffer[8]['key']][buffer[8]['scale']]
                playNote(pitch[sound.note]);
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

    // $('.padColHolder.active').removeClass('active');

    if ($('.play').hasClass('playing')){
        $('.play').removeClass('playing');
        state.playing = false;
        clearInterval(engine);
    } else {
        state.slice = 0;
        $(".padColHolder.active").removeClass('active');
        $(".padColHolder[data-col='0']").addClass('active');
    }
});
//--|
//----]
//--|
$('.knob').on('click',function(){
    let knob;
    if ($(this).hasClass('scale')){
        knob = 'scale';
    } else {
        knob = 'key'
    }

    let count = Number($(this).attr('data-num'));
    count = count + 1 >= options[knob].length ? 0 : count + 1;
    $(this).attr('data-num',count);
    currentBuffer[currentBuffer['activeSequence']][8][knob] = options[knob][count];
    $(`.${knob}Readout span.readoutDisplay`).text(options[knob][count]);
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
