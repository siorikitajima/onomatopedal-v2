var sampler = new Tone.Sampler({
		"B3": "sounds/PyonPyonStems/B3.mp3",
		"C#4": "sounds/PyonPyonStems/Cm4.mp3",
		"G#5": "sounds/PyonPyonStems/Gm5.mp3"
}, {
	'release' : 1,
	'onload' : function(){
		console.log('ready');
    Tone.context.lookAhead = 0;
	}
}).toDestination();

////////// Keys to Play Sample
var keyToPitch = { 
  " ":" ",
  "1":"C5", "2":"C#5", "3":"D5", "4":"D#5", "5":"E5", "6":"F5",
  "7":"F#5", "8":"G5", "9":"G#5", "0":"A5", "-":"A#5", "=":"B5",
  "q":"C4", "w":"C#4", "e":"D4", "r":"D#4", "t":"E4", "y":"F4",
  "u":"F#4", "i":"G4", "o":"G#4", "p":"A4", "[":"A#4", "]":"B4",
  "a":"C3", "s":"C#3", "d":"D3", "f":"D#3", "g":"E3", "h":"F3",
  "j":"F#3", "k":"G3", "l":"G#3", ";":"A3", "'":"A#3", "\\":"B3",
  "z":"C5", "x":"C#5", "c":"D5", "v":"D#5", "b":"E5", "n":"F5",
  "m":"F#5", ",":"G5", ".":"G#5", "/":"A5", "Backspace":"A#5", "`":"B5"
   }
    window.addEventListener('keydown', this.onkeydown);
    window.addEventListener('keyup', this.onkeyup);
    function onkeydown(e){
      sampler.triggerAttack(keyToPitch[e.key]);
    }
    function onkeyup(e){
      sampler.triggerRelease(keyToPitch[e.key]);
    }

////////// Controller
var controlMain = document.getElementById("controlMain");
var stems = [document.getElementById("stem0"),
document.getElementById("stem1"),
document.getElementById("stem2")];

// Play/Pause Button
function controlHandler() {
  if(controlMain.classList.contains("paused")) {
    controlMain.classList.remove("paused");
    controlMain.classList.add("playing");
  } else {
    controlMain.classList.remove("playing");
    controlMain.classList.add("paused");
  }
};

// Stem buttons
document.querySelectorAll('.stem').forEach(item => {
  item.addEventListener('click', event => {
  if(item.classList.contains("unmuted")) {
    item.classList.remove("unmuted");
    item.classList.add("muted");
  } else {
    item.classList.remove("muted");
    item.classList.add("unmuted");
  }
})});

////////// Mobile Drumpads
  document.querySelectorAll('.pad').forEach(item => {
    item.addEventListener('mousedown', event => {
    var p = item.getAttribute('id').toString();
    console.log(p);
    // item.style.color = '#f27b47';
    sampler.triggerAttack(keyToPitch[p]);
  });
  item.addEventListener('mouseup', event => {
    var p = item.getAttribute('id').toString();
    // item.style.color = '#FFFFFF';
    sampler.triggerRelease(keyToPitch[p]);
  });
})
