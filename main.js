// Create a rectangle with an (x, y) coordinate, a width, and a height
function rect(x, y, w, h, col, rtype) {
  return { x: x, y: y, w: w, h: h, col: col, rtype: rtype }
}
function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; //abcdefghijklmnopqrstuvwxyz
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

// Represent the level as a list of rectangles
var rects = [
  rect(0, 0, 10000, 20, "ff0", "block"),
  rect(0, 0, 20, 600, "f0f", "block"),
  rect(200, 580, 1200, 20, "00f", "block"),
  rect(200, 880, 800, 800, "f00", "block"),
  rect(780, 0, 20, 300, "fff", "block"),
  rect(0, 100, 100, 20, "f0f", "block"),
  rect(0, 100, 100, 20, "f0f", "block"),
  rect(100, 20, 20, 100, "D2691E", "destructable"),
  rect(120, 140, 20, 20, "fff", "block"),
  rect(140, 160, 20, 20, "fff", "block"),
  rect(160, 180, 20, 20, "fff", "block"),
  rect(180, 200, 20, 20, "fff", "block"),
  rect(0, 2000, 50, 50, "fff", "block"),
  rect(180, 200, 20, 20, "fff", "block")
]

var enemies = [
	//{x: 60, y: 200, w: 20, h: 50, col: "ff0", alpha: makeid(1), hp: 1, maxhp: 50, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 250, y: 200, w: 100, h: 100, col: "ff0", alpha: "A", hp: 99, maxhp: 99, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 300, y: 200, w: 20, h: 80, col: "ff0", alpha: "L", hp: 30, maxhp: 30, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 350, y: 200, w: 20, h: 60, col: "ff0", alpha: "P", hp: 1, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 400, y: 200, w: 20, h: 60, col: "ff0", alpha: "H", hp: 1, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 450, y: 200, w: 20, h: 60, col: "ff0", alpha: "A", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 500, y: 200, w: 20, h: 60, col: "ff0", alpha: ".", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 550, y: 200, w: 20, h: 60, col: "ff0", alpha: "W", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 600, y: 200, w: 20, h: 60, col: "ff0", alpha: "A", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 650, y: 200, w: 20, h: 60, col: "ff0", alpha: "R", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 700, y: 200, w: 20, h: 60, col: "ff0", alpha: "S", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 750, y: 200, w: 20, h: 60, col: "ff0", alpha: ".", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 800, y: 200, w: 20, h: 60, col: "ff0", alpha: "X", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 850, y: 200, w: 20, h: 60, col: "ff0", alpha: "Y", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 900, y: 200, w: 20, h: 60, col: "ff0", alpha: "Z", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false }
]

var punch = {
	col: 255,
	x: 0,
	y: 0,
	active: false,
	w: 10,
	h: 10
}

var gun = {
	dir: 6,
	col: 255,
	x: 0,
	y: 0,
	active: false,
	w: 5,
	h: 1,
	bulletsMax: 6,
	bullets: 6
}

var check = false;
var firstblood = false;
var points = 0;

var world = {};
world.minX = 0;
world.minY = 0;
world.maxX = 0;
world.maxY = 0;
world.gameon = false;

var items = [];
items[0] = "Fist";
items[1] = "Gun";
items[2] = "Platform Gun";
items.active = 0;

for (var i=0; i < rects.length; i++) {
	if (rects[i].x < world.minX) { world.minX = rects[i].x; }
	if (rects[i].x+rects[i].w > world.maxX) { world.maxX = rects[i].x + rects[i].w; }
	if (rects[i].y < world.minY) { world.minY = rects[i].y; }
	if (rects[i].y+rects[i].h > world.maxY) { world.maxY = rects[i].y + rects[i].h; }
}
world.minY = -world.maxY;
world.minX = -world.maxX;

var volumes={};
if ($.cookie('vol1') != undefined) {
	volumes.sfx = parseInt($.cookie('vol1'));
} else {
	volumes.sfx = 10;
}
if ($.cookie('vol2') != undefined) {
	volumes.music = parseInt($.cookie('vol2'));
} else {
	volumes.music = 10;
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
function addPoints(toAdd) {
	points += toAdd;
	$("#points").html(formatNumber(points));
}
function fail() {
	$("#def").html("Word entry doesn't exist!");
	sndFail.play();
}
function checkwords() {
	// word check
	if (check == true) return;
	check = true;
	
	var word = encodeURI($("#kills").text().trim().toLowerCase());
	$.ajax({
		url: "https://s3-us-west-2.amazonaws.com/words.alexmeub.com/otcwl2018/"+word+".json",
		context: document.body,
		dataType: "json",
		success: function(data, textStatus, jqXHR) {
			try {
				if (data.definition != undefined) {
					for (var pts=1;pts <= word.length;pts++) {
						addPoints(pts);
					}
					$("#def").html('<span class="word">'+word+':</span> "'+data.definition+'"');
					if (word.length > 10) {
						sndGodlike.play();
					} else if (word.length >= 5) {
						sndCatch.play();
					} else {
						sndCapture.play();
					}
				}
			} catch (err) {
				fail();
			}
		}, error: function() {
			fail();
		}
	});
	$("#kills").html("");
	setTimeout(function(){ check = false; }, 1000);
}

function sound(src, bar) {
	//
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  this.bar = bar;
  document.body.appendChild(this.sound);
  this.play = function(){
	if (this.bar == 2) {
		//music
		this.volume(volumes.music);
	} else {
		//sfx
		this.volume(volumes.sfx);
	}
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
  this.volume = function(v) {
	if (v < 0) v = 0;
	if (v > 100) v = 100;
	v = v / 100;
	//console.log("b"+this.bar+":"+v);
	this.sound.volume = v;
  }
}

// Return an object that supports at most "copies" simultaneous playbacks
function createSound(path, copies) {
  var elems = [], index = 0
  for (var i = 0; i < 16; i++) elems.push(new Audio(path))
  return {
    play: function() {
      if (window.chrome) elems[index].load()
      elems[index].play()
      index = (index + 1) % copies
    }
  }
}

// Want to be able to play at most 3 different copies of 'jump.wav' at once
//var bg = createSound('music.mp3', 1)
var bg = new sound("sounds/rocktronica.mp3", 2)
var sndJump = new sound('sounds/jump.wav', 1)
var sndJumpedOn = new sound('sounds/jumped-on.wav', 1)
var sndBlockBlow = new sound('sounds/block-blow.wav', 1)
var sndStep = new sound('sounds/pl_step1.wav', 1)
var sndPunchMiss  = new sound('sounds/punch-miss.wav', 1)
var sndPunch = new sound('sounds/punch-hit.mp3', 1)
var sndPunch2 = new sound('sounds/punch-hit-2.wav', 1)
var sndDie = new sound('sounds/pl_die1.wav', 1)
var sndFail = new sound('sounds/fail.mp3', 1)
var sndCapture  = new sound('sounds/capture.wav', 1)
var sndCatch  = new sound('sounds/nicecatch.wav', 1)
var sndDominate  = new sound('sounds/dominating.wav', 1)
var sndBlood  = new sound('sounds/firstblood.wav', 1)
var sndGodlike  = new sound('sounds/godlike.wav', 1)
var sndLost  = new sound('sounds/lostmatch.wav', 1)
var sndNextLevel  = new sound('sounds/proceed.wav', 1)
var sndUnstop  = new sound('sounds/unstoppable.wav', 1)
var sndGun  = new sound('sounds/gun.wav', 1)
var sndGunReload  = new sound('sounds/reload.wav', 1)
var sndClip  = new sound('sounds/menu.wav', 1)
var sndBP  = new sound('sounds/build-block.wav', 1)
var item0  = new sound('sounds/fist.wav', 1)
var item1  = new sound('sounds/shout-gun.wav', 1)
var item2  = new sound('sounds/platform.wav', 1)

function changeVolume(val, whichBar) {
	
	if (whichBar == 2) {
		//music
		bg.volume(val);
	} else {
		// sounds
		sndJump.volume(val);
		sndStep.volume(val);
		sndPunchMiss.volume(val);
		sndPunch.volume(val);
		sndDie.volume(val);
		sndFail.volume(val);
		sndCapture.volume(val);
		sndCatch.volume(val);
		sndDominate.volume(val);
		sndBlood.volume(val);
		sndGodlike.volume(val);
		sndLost.volume(val);
		sndNextLevel.volume(val);
		sndUnstop.volume(val);
	}
}

var lastDir = 6;

// Returns true iff a and b overlap
function overlapTest(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y
}

// Move the rectangle p along vx then along vy, but only move
// as far as we can without colliding with a solid rectangle
function move(p, vx, vy) {
  // Move player along x axis
  
  for (var i = 0; i < rects.length; i++) {
    var c = { x: p.x + vx, y: p.y, w: p.w, h: p.h }
    if (overlapTest(c, rects[i])) {
      if (vx < 0) vx = rects[i].x + rects[i].w - p.x
      else if (vx > 0) vx = rects[i].x - p.x - p.w
    }
  }
  
  p.x += vx

  // Move player along y axis
  for (var i = 0; i < rects.length; i++) {
    var c = { x: p.x, y: p.y + vy, w: p.w, h: p.h }
    if (overlapTest(c, rects[i])) {
      if (vy < 0) vy = rects[i].y + rects[i].h - p.y
      else if (vy > 0) vy = rects[i].y - p.y - p.h
    }
  }
  p.y += vy

}

// Record which key codes are currently pressed
var keys = {}
var mouse = false;
var keysP = {}
document.onkeydown = function(e) { keys[e.which] = true; }
document.onkeyup = function(e) { keys[e.which] = false; bg.play(); }
document.onkeypress = function(e) {
	if (!world.gameon) return;
	var k = e.code.toLowerCase();
	if (k == "keyq") {
	  items.active += 1;
	  if (items.active >= items.length) items.active = 0;
		e.preventDefault();
	} else if ( (k == "keye") || (k == "tab") ) {
	  items.active -= 1;
	  if (items.active < 0) items.active = items.length - 1;
		e.preventDefault();
	}
	if ( (k == "keyq") || (k == "keye") || (k == "tab") ) {
		if (items.active == 0) {
			item0.play();
		} else if (items.active == 1) {
			item1.play();
		} else if (items.active == 2) {
			item2.play();
		}
		e.preventDefault();
	}
	if ( (k == "space") && (items.active == 2) ) {
		// platform gun
		if (lastDir==6) {
			// looking right
			rects.push(rect(player.x + 50, player.y, 20, 20, "0f0", "destructable"));
		} else {
			// looking left
			rects.push(rect(player.x - 50, player.y, 20, 20, "0f0", "destructable"));
		}
		e.preventDefault();
	}
}
document.onmousedown = function(e) { mouse = true; }
document.onmouseup = function(e) { mouse  = false; bg.play(); }

// Player is a rectangle with extra properties
//					x, y, w, h
var player = rect(20, 20, 20, 42)
player.velocity = { x: 0, y: 0 }
player.onFloor = false
player.alpha = "P";
// Updates the state of the game for the next frame

//d:68, s: 83, a: 65, w: 87, 37 gauche, 39 droite

//E: 69, Q: 81
function update() {

  // enter key check words
  if (!!keys[13]) {
	checkwords();
  }  
  
  // player is moving, play steps sounds
  if ( (!!keys[68]) || (!!keys[65]) || (!!keys[39]) || (!!keys[37]) ) {
	  
	if (!!keys[39] || (!!keys[68])) {
		lastDir = 6;
	} else {
		lastDir = 4;
	}
	sndStep.play();
  }

  // player is pressing space, punch sound
  if ( (!!keys[32]) || !!mouse ) {
	  
	if (items.active == 0) {
	  
		sndPunchMiss.play();
		if (lastDir==6) {
			// punch right
			punch.active = true;
			punch.x = player.x + 40 - Math.floor(Math.random() * Math.floor(20));
			punch.y = player.y + 25;
		} else {
			// punch left
			punch.active = true;
			punch.x = player.x - Math.floor(Math.random() * Math.floor(20));
			punch.y = player.y + 25;
		}
		if (punch.active) {
			// punch enemy
			for (var i = 0; i < enemies.length; i++) {
				var p = { x: punch.x, y: punch.y, w: punch.w, h: punch.h }
				var e = enemies[i];
				if (overlapTest(p, e)) {
					// knockback
					if (lastDir==6) {
						enemies[i].x += 5;
					} else {
						enemies[i].x -= 5;
					}
					// punch damage
					e.hp -= 1;
					
					// kill or punch sound
					if (e.hp <= 0) {
						kill(i);
					} else {
						if ( (Math.floor(Math.random() * 100) + 1) > 50) {
							sndPunch.play();
						} else {
							sndPunch2.play();
						}
					}
					punch.active = false;
				}
			}
			
			// punch wall
			for (var i = 0; i < rects.length; i++) {
				var c = { x: punch.x, y: punch.y, w: punch.w, h: punch.h }
				if (overlapTest(c, rects[i])) {
					punch.active = false;
					if (rects[i].rtype == "destructable") {
						// TODO: tone down until destroyed
						//rects[i].col = col;
						//if (col=="#000000") {
							rects.splice(i,1);
						//}
					} 
					sndBlockBlow.play();
				}
			}
		}
	} else if (items.active == 1) {
		
		sndGun.play();
		
		// gun shot
		if (lastDir==6) {
			// looking right
			gun.active = true;
			gun.x = player.x + 40 - Math.floor(Math.random() * Math.floor(20));
			gun.y = player.y + 25;
			gun.dir = 6;
		} else {
			// looking left
			gun.active = true;
			gun.x = player.x - Math.floor(Math.random() * Math.floor(20));
			gun.y = player.y + 25;
			gun.dir = 4;
		}

	} else if (items.active == 2) {
		// platform gun shot
		sndBP.play();
	}
  }
  
  // Update the velocity
  player.velocity.x = 3 * ( ( (!!keys[39]) || (!!keys[68]) ) - ((!!keys[37]) || (!!keys[65]) ) ); // right - left
  player.velocity.y += 1 // Acceleration due to gravity

  // Move the player and detect collisions
  var expectedY = player.y + player.velocity.y
  move(player, player.velocity.x, player.velocity.y)
  player.onFloor = (expectedY > player.y)
  if (expectedY != player.y) player.velocity.y = 0


	// move enemies
  // Update the velocity
  for (var ii = 0; ii < enemies.length; ii++) {
	var e = enemies[ii];
	e.velocity.y += 1 // Acceleration due to gravity
	// todo: MOVE AI
	var expectedY = e.y + e.velocity.y
	move(e, e.velocity.x, e.velocity.y)
	e.onFloor = (expectedY > e.y)
	if (expectedY != e.y) e.velocity.y = 0
	// jump damage
	if ( (player.velocity.y > 0) && (overlapTest(player, e)) ) {
		sndJumpedOn.play();
		e.hp -= Math.floor(player.velocity.y / 2);
		player.velocity.y = -10;
		if (e.hp <= 0) kill(ii);
	}
  }

  // Only jump when we're on the floor. 
  if (player.onFloor && (keys[38] || keys[87] ) ) {
    player.velocity.y = -13
    sndJump.play()
  }
}

function kill(eID) {
	enemies[eID].hp = 0;
	sndDie.play();

	// add killed letter
	$("#kills").append(""+enemies[eID].alpha);

	// add 1 point
	addPoints(1);

	// fb?
	if (!firstblood) {
		sndBlood.play();
		firstblood = true;
	}
}

function clamp(value, min, max){
    if(value < min) return min;
    else if(value > max) return max;
    return value;
}

// Renders a frame
function draw() {
  var c = document.getElementById('screen').getContext('2d')

  // setup cam
	c.setTransform(1,0,0,1,0,0);//reset the transform matrix as it is cumulative
	c.clearRect(0, 0, c.canvas.width, c.canvas.height);//clear the viewport AFTER the matrix is reset

	//Clamp the camera position to the world bounds while centering the camera around the player                                             

	var camX = clamp(-player.x + c.canvas.width / 2, world.minX, world.maxX );
	var camY = clamp(-player.y + c.canvas.height / 2, world.minY, world.maxY);

	c.translate( camX, camY ); 

  // Draw background
  c.fillStyle = '#222'
  c.fillRect(0, 0, world.maxX, world.maxY)
  var img = document.getElementById("bg");
  c.drawImage(img, 0, 0);

  // Draw player
	//player.style = "normal";
	//player.ital = "normal";

  
	c.fillStyle = player.col;
	c.font = player.h+"px "+player.fam;
	
	if (lastDir == 6) {
		c.fillText(player.alpha, player.x, player.y + player.h); 
	} else {
		c.save();
		c.translate(player.x, player.y);
		c.scale(-1, 1);
		c.fillStyle = player.col;
		c.font = player.h+"px "+player.fam;
		c.textAlign = 'right';
		c.fillText(player.alpha, 0, 0 + player.h);
		c.restore();
	}
	
  // Draw enemies
  for (var i = 0; i < enemies.length; i++) {
	var e = enemies[i];
	if (e.hp > 0) {
		c.fillStyle = "#"+e.col;
		c.font = e.h+"px Arial";
		c.fillText(e.alpha, e.x, e.y + e.h);
		
		// enemy hp, display if lower than full
		if (e.hp < e.maxhp) {
			c.fillStyle = '#f00'
			c.fillRect(e.x, e.y, e.maxhp, 5)
			c.fillStyle = '#0f0'
			c.fillRect(e.x, e.y, e.hp, 5)
		}
	} else {
		enemies.splice(i, 1);
		if (enemies.length <= 0) {
			sndNextLevel.play();
		}
	}
  }

  // Draw levels
  for (var i = 0; i < rects.length; i++) {
    var r = rects[i]
	c.fillStyle = '#'+r.col;
    c.fillRect(r.x, r.y, r.w, r.h)
  }

  // draw punch
  if (punch.active) {
	c.beginPath();
	c.arc(punch.x, punch.y, 5, 0, 2 * Math.PI, false);
	c.fillStyle = '#'+punch.col.toString(16)+punch.col.toString(16)+"00";
	c.fill();
	punch.col -= 10;
	if (punch.col < 1) {
		punch.active = false;
		punch.col = 255;
	}
  }
  
	// draw item
	c.save();	
	c.translate(player.x-c.canvas.width / 2, player.y - c.canvas.height / 2);
	c.fillStyle = '#000'
	c.font = player.h+"px Arial";
	c.fillText(items[items.active], 10, 10 + 20); 
	c.fillStyle = '#fff'
	c.fillText(items[items.active], 12, 12 + 20); 
	c.restore();
	
  // draw bullets
  if (gun.active) {
	  if (gun.dir==6) gun.x += 10;
	  if (gun.dir==4) gun.x -= 10;
    c.fillRect(gun.x, gun.y, 5, 1)
  }
  
}

function jump_start() {
  setInterval(function() {
    update()
    draw()
  }, 1000 / 60)
}
