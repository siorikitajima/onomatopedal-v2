var r = 90, g = 80, b = 80;
var colNum = 1;
var rSw = true, gSw = true, bSw = true;

class Particle {
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.r = 2;
    this.xSpeed = random(-2,2);
    this.ySpeed = random(-1.5,1.5);
  }
  createParticle() {
    noStroke();
    noFill();
    circle(this.x,this.y,this.r);
  }
  moveParticle() {
    if(this.x < 0 || this.x > width)
      this.xSpeed*=-1;
    if(this.y < 0 || this.y > height)
      this.ySpeed*=-1;
    this.x+=this.xSpeed;
    this.y+=this.ySpeed;
  }
  joinParticles(particles) {
    particles.forEach(element =>{
      let dis = dist(this.x,this.y,element.x,element.y);
      if(dis<150) {
        stroke('rgb(' + r + ',' + g + ',' + b + ')');
        line(this.x,this.y,element.x,element.y);
      }
    });
  }
}
class WideBar {
  constructor(y,r,b,g) {
    this.x = 0;
    this.y = y;
    this.w = width;
    this.h = height/4;
    this.r = r;
    this.g = g;
    this.b = b;
    this.speed = 40;
  }
  createWideBar() {
    noStroke();
    fill(this.r, this.g, this.b);
    rect(this.x, this.y, this.w, this.h);
  }
  goDown(arrayName) {
    this.y+=this.speed;
    if(this.y > height) arrayName.splice(0, 1);
  }
  goUp(arrayName) {
    this.y-=this.speed;
    if(this.y < 0) arrayName.splice(0, 1);
  }
}

let particles = [];
let wideBars = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('rgb(10,10,10)');
  frameRate(24);
  for(let i = 0;i<width/20;i++){
    particles.push(new Particle(random(0,width),random(0,height)));
  }
}

function draw() {
  background('rgba(15,15,15,0.01)');
  // background('rgba(10,10,10,0.005)');
  for(let i = 0;i<particles.length;i++) {
    particles[i].createParticle();
    particles[i].moveParticle();
    particles[i].joinParticles(particles.slice(i));
  }
  for(let i = 0;i<wideBars.length;i++) {
    wideBars[i].createWideBar();
    wideBars[i].goDown(wideBars);
  }
  if (r >= 200) {rSw = false;}
  if (r <= 10) {rSw = true;}
  if (g >= 200) {gSw = false;}
  if (g <= 10) {gSw = true;}
  if (b >= 200) {bSw = false;}
  if (b <= 10) {bSw = true;}

    if (rSw){r = r + colNum;
    } else {r = r - colNum;}
    if (gSw){g = g + colNum;
    } else {g = g - colNum;}
    if (bSw){b = b + colNum;
    } else {b = b - colNum;}
}

function keyPressed() {
var randomX = random(0,width);
var randomY = random(0,height);
  if (key >= 'a' && key <= 'e') {
    r = r + 10;
    for(var i=0;i<10;i++) {
      particles.push(new Particle(random(0,width),random(0,height)));
    }
  }
  if (key >= 'f' && key <= 'j') {
    g = g + 10;
    for(var i=0;i<10;i++) {
      particles.push(new Particle(randomX + random(-100,100), randomY + random(-100,100)));
    }
  }
  if (key >= 'k' && key <= 'o') {
    b = b + 10;
    for(var i=0;i<10;i++) {
      particles.push(new Particle(width/2 + random(-100,100), height/2 + random(-100,100)));
    }  }
  if (key >= 'p' && key <= 't') {
    r = 90;
    g = 80;
    b = 80;    
    for(var i=0;i<10;i++) {
      particles.push(new Particle(randomX + random(-100,100),randomY + random(-100,100)));
    }  }
  if (key >= 'u' && key <= 'z') {
    r = 190;
    g = 180;
    b = 180;
    for(var i=0;i<10;i++) {
      particles.push(new Particle(random(0,width),random(0,height)));
    }
  }
  if (key >= '0' && key <= '3') {
    wideBars.push(new WideBar(0,10,10,10));
  }

  if(particles.length > 80) {
    var extraParticles = particles.length + 1 - 80;
    particles.splice(0, extraParticles);
  }
}

function touchStarted() {
  var colorRandom = floor(random(0,4.9));
  if(colorRandom == 0) {
    r = r + 10;
  } else if(colorRandom == 1) {
    g = g + 10;
  } else if(colorRandom == 2) {
    b = b + 10;
  } else if(colorRandom == 3) {
    r = 90;
    g = 80;
    b = 80;  
  } else {
    r = 190;
    g = 180;
    b = 180;
  }
  for(var i=0;i<5;i++) {
    particles.push(new Particle(mouseX + random(-100,100), mouseY + random(-100,100)));
  }
  if(particles.length > 30) {
    var extraParticles = particles.length + 1 - 30;
    particles.splice(0, extraParticles);
  }
}