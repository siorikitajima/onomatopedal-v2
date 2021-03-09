var sampler = new Tone.Sampler({
		"C4": "sounds/a.mp3",
		"G#3": "sounds/c.mp3",
		"E4": "sounds/d.mp3",
		"F#3": "sounds/z.mp3"
}, {
	'release' : 1,
	'onload' : function(){
		console.log('ready');
    Tone.context.lookAhead = 0;
	}
}).toDestination();

var keyToPitch = { 
  " ":" ",
  "1":"C2", "2":"C#2", "3":"D2", "4":"D#2", "5":"E2", "6":"F2",
  "7":"F#2", "8":"G2", "9":"G#2", "0":"A2", "-":"A#2", "=":"B2",
  "q":"C3", "w":"C#3", "e":"D3", "r":"D#3", "t":"E3", "y":"F3",
  "u":"F#3", "i":"G3", "o":"G#3", "p":"A3", "[":"A#3", "]":"B3",
  "a":"C4", "s":"C#4", "d":"D4", "f":"D#4", "g":"E4", "h":"F4",
  "j":"F#4", "k":"G4", "l":"G#4", ";":"A4", "'":"A#4", "\\":"B4",
  "z":"C5", "x":"C#5", "c":"D5", "v":"D#5", "b":"E5", "n":"F5",
  "m":"F#5", ",":"G5", ".":"G#5", "/":"A5", "Backspace":"A#5", "`":"B5"
   }

var keyToColor = { " ":" ", "z":"#E75A7C", "s":"#7681B3", "x":"#558B6E", "d":"#F1DABF", "c":"#FBB02D", "f":"#E75A7C", "v":"#7681B3", "g":"#558B6E", "b":"#F1DABF", "h":"#FBB02D", "n":"#E75A7C", "j":"#7681B3", "m":"#558B6E", "k":"#F1DABF", ",":"#FBB02D", "l":"#E75A7C", ".":"#7681B3", "/":"#558B6E", "'":"#F1DABF", "q":"#FBB02D", "a":"#E75A7C", "2":"#7681B3",  "1":"#558B6E", "4":"#F1DABF", "w":"#FBB02D", "3":"#E75A7C", "e":"#7681B3", "r":"#558B6E", "5":"#F1DABF", "t":"#FBB02D", "6":"#E75A7C", "y":"#7681B3", "7":"#558B6E", "u":"#F1DABF", "8":"#FBB02D", "i":"#E75A7C", "9":"#7681B3", "o":"#558B6E", "0":"#F1DABF", "p":"#FBB02D", "[":"#E75A7C", "-":"#7681B3","=":"#558B6E", "]":"#F1DABF", "Backspace":"#FBB02D", "\\":"#E75A7C" }

    window.addEventListener('keydown', this.onkeydown);
    window.addEventListener('keyup', this.onkeyup);

    function onkeydown(e){
      // sampler.triggerAttackRelease(keyToPitch[e.key], Tone.context.currentTime);
      sampler.triggerAttack(keyToPitch[e.key]);
      // const player = new Tone.Player().toDestination();
      // player.buffer = bufferSamples.get(keyToPitch[e.key]);
      // player.start();
      // twoAnimation(keyToColor[e.key]);
    }
    function onkeyup(e){
      sampler.triggerRelease(keyToPitch[e.key]);
    }

/// Mobile Drumpads

  document.querySelectorAll('.pad').forEach(item => {
    item.addEventListener('mousedown', event => {
    var p = item.getAttribute('id').toString();
    console.log(p);
    item.style.color = '#f27b47';
    sampler.triggerAttack(keyToPitch[p]);
  });
  item.addEventListener('mouseup', event => {
    var p = item.getAttribute('id').toString();
    item.style.color = '#FFFFFF';
    sampler.triggerRelease(keyToPitch[p]);
  });
})
