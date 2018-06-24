/*****
 **
 ** DATA CONSTRUCTS
 **
 *****/

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
    'tempo': 120,
    'activeSequence': 1,
    'activeVoice': 1,
}

const scales = ['Maj','Min'];
const key = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B','B#']
const state = {
    playing: false,
    recording: false,
    recording_in_memory: false
}


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
            note: 'test',
            voice: sound
        };
        $(this).addClass('active');
    }
});


$('.bankButton').on('click',function(){
    let bank;
    let bankNum =
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



/*****
 **
 ** CLASSES
 **
 *****/

const synth = function(){
    this.audioContext = new (window.AudioContext || window.webkitAudioContext);
    this.oscList = [];
    this.masterGainNode = null;
    this.noteFreq = null;
    this.customWaveform = null;
    this.sineTerms = null;
    this.cosineTerms = null;

}
