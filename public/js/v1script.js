// Make the modal closable once the page is fully loaded
window.onload = function() {
  $('.loadingSpinner, #modalBG').css('display','none');
  window.scrollTo(0,1);

  if (( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) | (navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2)) {
  } else { 
    if (localStorage.getItem("modal") === null) {
      $('.modalContent, #modalBG').css('display','block');
      }
  }
};
    
// ===== Top page Pedal Shuffle =====

function randomize() {
  var allBanners = $('#pedalTable img');
  shuffle(allBanners.hide()).slice(17).show();    
}

$('#randomDiv').click(randomize);
randomize();

function shuffle(array) {
var currentIndex = array.length, 
    temporaryValue, 
    randomIndex;

while (0 !== currentIndex) {
  randomIndex = Math.floor(Math.random() * currentIndex);
  currentIndex -= 1;
  temporaryValue = array[currentIndex];
  array[currentIndex] = array[randomIndex];
  array[randomIndex] = temporaryValue;
}
return array;
}

$('#randomDiv').mouseover( function() {
  $('#topPageHeader').addClass('addAnimation');
});

$('#randomDiv').mouseleave( function() {
  $('#topPageHeader').removeClass('addAnimation');
});

// ===== Link to Pedal with PedalID as URL Parameter =====

var pedalBtn = $('.pedalList');

$(pedalBtn).click(function() {
$('.loadingSpinner').css('display','inline-block');
$('#modalBG').css('display','block');

var thisPedal = event.currentTarget;
var pedalNumber = $(thisPedal).attr("data-pedal-id");

window.location.replace('pedal.html?pedalid=' + pedalNumber );
});

// ===== Hide the modal and show the page content =====

$('#showStarter').click(function() {
  $('.pedalPageWrap').css('display','block');
  $('#modalBG').css('display','none');
  localStorage.setItem("modal", "clicked");
});




// Detect IE browser and show an alert
function is_IE() {
  return (window.navigator.userAgent.match(/MSIE|Trident/) !== null);
}

//function to show alert if it's IE
function ShowIEAlert(){
if(is_IE()){
alert("Unsupported Browser!\nOnomatoPedal will not work in Internet Explorer. Use Microsoft Edge or Google Chrome for the full experience.\n\nInternet Explorerでは、このページは正しく動作しません。Microsoft EdgeかGoogle Chromeで再度お試しください。");
}
};

$(document).ready( function() {
  ShowIEAlert();
});