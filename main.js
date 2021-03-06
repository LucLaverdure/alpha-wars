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
  rect(0, 0, 10000, 20, "#ff0", "block"),
  rect(0, 0, 20, 600, "#f0f", "block"),
  rect(200, 580, 1200, 20, "#00f", "block"),
  rect(200, 880, 800, 800, "#f00", "block"),
  rect(780, 0, 20, 300, "#fff", "block"),
  rect(0, 100, 100, 20, "#f0f", "block"),
  rect(0, 100, 100, 20, "#f0f", "block"),
  rect(100, 20, 20, 100, "#D2691E", "destructable"),
  rect(120, 140, 20, 20, "#fff", "block"),
  rect(140, 160, 20, 20, "#fff", "block"),
  rect(160, 180, 20, 20, "#fff", "block"),
  rect(180, 200, 20, 20, "#fff", "block"),
  rect(0, 2000, 50, 50, "#fff", "block"),
  rect(180, 200, 20, 20, "#fff", "block")
]

var enemies = [
	//{x: 60, y: 200, w: 20, h: 50, col: "ff0", alpha: makeid(1), hp: 1, maxhp: 50, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 250, y: 200, w: 100, h: 100, col: "#ff0", alpha: "A", hp: 99, maxhp: 99, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 300, y: 200, w: 20, h: 80, col: "#ff0", alpha: "C", hp: 30, maxhp: 30, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 350, y: 200, w: 20, h: 60, col: "#ff0", alpha: "P", hp: 1, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 400, y: 200, w: 20, h: 60, col: "#ff0", alpha: "H", hp: 1, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 450, y: 200, w: 20, h: 60, col: "#ff0", alpha: "A", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 500, y: 200, w: 20, h: 60, col: "#ff0", alpha: ".", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 550, y: 200, w: 20, h: 60, col: "#ff0", alpha: "W", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 600, y: 200, w: 20, h: 60, col: "#ff0", alpha: "A", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 650, y: 200, w: 20, h: 60, col: "#ff0", alpha: "R", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 700, y: 200, w: 20, h: 60, col: "#ff0", alpha: "S", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 750, y: 200, w: 20, h: 60, col: "#ff0", alpha: ".", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 800, y: 200, w: 20, h: 60, col: "#ff0", alpha: "X", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 850, y: 200, w: 20, h: 60, col: "#ff0", alpha: "Y", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false },
	{x: 900, y: 200, w: 20, h: 60, col: "#ff0", alpha: "Z", hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false }
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
document.onkeyup = function(e) { keys[e.which] = false; }
document.onkeypress = function(e) {
	if (!world.gameon) return;
	bg.play();
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
			rects.push(rect(player.x + 50, player.y+(player.h / 2), 20, 20, "0f0", "destructable"));
		} else {
			// looking left
			rects.push(rect(player.x - 50, player.y+(player.h / 2), 20, 20, "0f0", "destructable"));
		}
		e.preventDefault();
	}
}
document.onmousedown = function(e) { mouse = true; }
document.onmouseup = function(e) { mouse  = false; }

// Player is a rectangle with extra properties
//					x, y, w, h
var player = rect(20, 20, 20, 42)
player.velocity = { x: 0, y: 0 }
player.onFloor = false
player.alpha = "P";
// Updates the state of the game for the next frame

//d:68, s: 83, a: 65, w: 87, 37 gauche, 39 droite

//E: 69, Q: 81

// build enemy AI
function enemy_update(ai, ii) {
	
	// movement
	ai.velocity.y += 1 // Acceleration due to gravity
	var wasOnFloor = ai.onFloor;
	var wasOnWall = ai.onWall;

	if (typeof(ai.vx) == "undefined") {
		ai.vx = ( (Math.random() * 100 + 1) > 50) ? -1 : 1;
	}
	ai.velocity.x = Math.floor(Math.random() * 3) * ai.vx;
	var expectedY = ai.y + ai.velocity.y
	var expectedX = ai.x + ai.velocity.x
	move(ai, ai.velocity.x, ai.velocity.y);

	ai.onWall = (expectedX != ai.x);
	if (ai.onWall && !wasOnWall) {
		ai.vx *= -1;
		ai.velocity.y = -10;
	}
	
	ai.onFloor = (expectedY > ai.y);
	if (!ai.onFloor && wasOnFloor) {
		// jump back on platform
		ai.vx *= -1;
		ai.velocity.y = -10;
	} else {
		// sit on platform
		if (expectedY != ai.y) ai.velocity.y = 0
	}
	
	// jump damage
	if ( (player.velocity.y > 0) && (overlapTest(player, ai)) ) {
		sndJumpedOn.play();
		ai.hp -= Math.floor(player.velocity.y / 2);
		player.velocity.y = -10;
		if (ai.hp <= 0) kill(ii);
	}

	if (typeof(ai.counter)=="undefined") ai.counter = 0;
	ai.counter += 1;
	switch (ai.alpha.toUpperCase()) {
		case "A":
			if (ai.counter >= Math.floor(Math.random() * 25 + 60)) {
				// shoot arrow
				ai.counter = 0;
			}
			break;
		case "B":
			if (ai.counter >= Math.floor(Math.random() * 25 + 70)) {
				// shoot bomb
				ai.counter = 0;
			}
			break;
		case "C":
			// The Crusher!
			if (ai.counter >= Math.floor(Math.random() * 25 + 50)) {
				// jump towards you
				ai.onFloor = false;
				ai.velocity.y = -10;
				if (player.x < ai.x)
					ai.vx = -1;
				else
					ai.vx = 1;
				ai.counter = 0;
			}
			break;
		case "D":
			if (ai.counter >= Math.floor(Math.random() * 25 + 20)) {
				// dodge???
				ai.counter = 0;
			}
			break;
		case "E":
			if (ai.counter >= Math.floor(Math.random() * 25 + 20)) {
				// electrocute floor???
				ai.counter = 0;
			}
			break;
		case "F":
			if (ai.counter >= Math.floor(Math.random() * 25 + 40)) {
				// spit fire
				ai.counter = 0;
			}
			break;
		case "G":
			if (ai.counter >= Math.floor(Math.random() * 25 + 40)) {
				// shoot gun
				ai.counter = 0;
			}
			break;
		case "H":
			if (ai.counter >= Math.floor(Math.random() * 25 + 40)) {
				// shoots health pack (h character)
				ai.counter = 0;
			}
			break;
		case "I":
			// is invisible
			if (ai.counter >= Math.floor(Math.random() * 25 + 50)) {
				// punch
				ai.counter = 0;
			}
			break;
		case "J":
			if (ai.counter >= Math.floor(Math.random() * 25 + 50)) {
				// ???
				ai.counter = 0;
			}
			break;
		case "K":
			if (ai.counter >= Math.floor(Math.random() * 25 + 50)) {
				// kick with knockback
				ai.counter = 0;
			}
			break;
		case "L":
			if (ai.counter >= Math.floor(Math.random() * 25 + 50)) {
				// ???
				ai.counter = 0;
			}
			break;
		case "M":
			if (ai.counter >= Math.floor(Math.random() * 25 + 50)) {
				// spawn lowercase letter
				ai.counter = 0;
			}
			break;
		case "N":
			if (ai.counter >= Math.floor(Math.random() * 25 + 50)) {
				// Ninja???
				ai.counter = 0;
			}
			break;
		case "O":
			if (ai.counter >= Math.floor(Math.random() * 25 + 50)) {
				// ???
				ai.counter = 0;
			}
			break;
		case "P":
			if (ai.counter >= Math.floor(Math.random() * 25 + 50)) {
				// Punch
				ai.counter = 0;
			}
			break;
		case "Q":
			if (ai.counter >= Math.floor(Math.random() * 25 + 50)) {
				// Spawns quickness letter (q)
				ai.counter = 0;
			}
			break;
		case "R":
			if (ai.counter >= Math.floor(Math.random() * 25 + 50)) {
				// Rage???
				ai.counter = 0;
			}
			break;
		case "S":
			if (ai.counter >= Math.floor(Math.random() * 150 + 200)) {
				// Spawn Uppercase Letter
				ai.counter = 0;
				enemies.push({x: ai.x, y: ai.y, w: 20, h: 60, col: "lightblue", alpha: makeid(1), hp: 10, maxhp: 10, velocity: {x: 0, y: 0}, onFloor: false });
			}
			break;
		case "T":
			if (ai.counter >= Math.floor(Math.random() * 50 + 100)) {
				// Teleport
				ai.counter = 0;
			}
			break;
		case "U":
			if (ai.counter >= Math.floor(Math.random() * 50 + 100)) {
				// ???
				ai.counter = 0;
			}
			break;
		case "V":
			if (ai.counter >= Math.floor(Math.random() * 50 + 100)) {
				// Vampire, leech life
				ai.counter = 0;
			}
			break;
		case "W":
			if (ai.counter >= Math.floor(Math.random() * 50 + 100)) {
				// Waller, make wall
				ai.counter = 0;
			}
			break;
		case "X":
			if (ai.counter >= Math.floor(Math.random() * 50 + 100)) {
				// ???
				ai.counter = 0;
			}
			break;
		case "Y":
			if (ai.counter >= Math.floor(Math.random() * 50 + 100)) {
				// Yells, knockback
				ai.counter = 0;
			}
			break;
		case "Z":
			if (ai.counter >= Math.floor(Math.random() * 50 + 100)) {
				// Spawn lowercase Zzz, makes you sleep
				ai.counter = 0;
			}
			break;
	}

	// attacks
	switch (ai.alpha.toUpperCase()) {
		case "A":
			break;
	}


}

function update() {

  for (var ai = 0;ai < enemies.length; ai++) {
	  enemy_update(enemies[ai], ai);
  }

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
  
  // air movement
  if (!player.onFloor) {
	if (lastDir == 6)
		player.velocity.x = 3;
	else
		player.velocity.x = -3;
  }
  
  // running
  if (player.onFloor) {
	var run = ( ( (!!keys[39]) || (!!keys[68]) ) - ((!!keys[37]) || (!!keys[65]) ) );
	if ( (run > 0) || (run < 0) ) {
		player.runinc += 1;
	} else {
		player.runinc = 0;
	}
	if (player.runinc > 40) {
		if (player.runinc > 60) {
			player.runinc = 60;
		}
		player.velocity.x = (Math.floor(player.runinc / 10) * run); // right - left
	}
  }
  
  
  player.velocity.y += 1 // Acceleration due to gravity

  // Move the player and detect collisions
  var expectedY = player.y + player.velocity.y
  move(player, player.velocity.x, player.velocity.y)
  player.onFloor = (expectedY > player.y)
  if (expectedY != player.y) player.velocity.y = 0


  // Only jump when we're on the floor. 
  if (player.onFloor && (keys[38] || keys[87] ) ) {
    player.velocity.y = -13
    sndJump.play()
  }
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

function kill(eID) {
	enemies[eID].hp = 0;
	sndDie.play();

	// add killed letter
	if (isLetter(enemies[eID].alpha)) $("#kills").append(""+enemies[eID].alpha);

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
		// draw normal
		c.fillText(player.alpha, player.x, player.y + player.h); 
	} else {
		// draw mirrored
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
		c.fillStyle = e.col;
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
	c.fillStyle = r.col;
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



/******************************************************/

	$(".styl input").checkboxradio();
	$(function() {
		// set defaults
		player.col = "#00ff00";
		player.style = "normal";
		player.ital = "normal";
		player.alpha = "P";
		player.name = "Player1";
		player.fam = "Arial";

		// set from cookie
		if (typeof ($.cookie('player_col')) != "undefined") { player.col = $.cookie('player_col'); }
		if (typeof ($.cookie('player_fam')) != "undefined") { player.fam = $.cookie('player_fam'); }
		if (typeof ($.cookie('player_style')) != "undefined") { player.style = $.cookie('player_style'); }
		if (typeof ($.cookie('player_ital')) != "undefined") { player.ital = $.cookie('player_ital'); }
		if (typeof ($.cookie('player_alpha')) != "undefined") { player.alpha = $.cookie('player_alpha'); }
		if (typeof ($.cookie('player_name')) != "undefined") { player.name = $.cookie('player_name'); }

		// set name
		$("#myname").val(player.name);
		// set character
		$(".P").html(player.alpha);
		
		// sort font families
		var $divs = $("#fam option")
		var alphabeticallyOrderedDivs = $divs.sort(function (a, b) {
			return $(a).text() > $(b).text();
		});
		$("#fam").html(alphabeticallyOrderedDivs);
		
		// set font family
		$("#fam").val(player.fam);
		$(".P").css("font-family", player.fam);
		
		// set color
		$("#picker").drawrpalette();
		$("#picker").drawrpalette("set", player.col);
		$(".P").css("color", player.col);
		$("#picker").drawrpalette().on("preview.drawrpalette",function(event,hexcolor){
			// preview: don`t change
			/*player.col = hexcolor;
			$(".P").css("color", hexcolor);*/
		}).on("choose.drawrpalette",function(event,hexcolor){
			player.col = hexcolor;
			$(".P").css("color", hexcolor);
		});
		// set italic
		if (player.ital != "normal") $("#ital").prop( "checked", true);
		$('#ital').button( "refresh" );
		// set bold
		if (player.style != "normal") $("#wee").prop( "checked", true);
		$('#wee').button( "refresh" );
	});
	
	function selectChar() {
		if (player.name.trim() == "") {
			player.name = "Player1";
			player.alpha = "P";
		}
		player.col = $("#picker").val();
		player.fam = $("#fam").val();
		if ($("#wee").is(":checked")) {
			player.style = "bold";
		} else {
			player.style = "normal";
		}
		if ($("#ital").is(":checked")) {
			player.ital = "italic";
		} else {
			player.ital = "normal";
		}
		$("h1").fadeOut();
		$(".step2").fadeOut();
		$("#points").fadeIn();
		$("#canvas-wrap").fadeIn();
		world.gameon = true;
		
		// save configs
		$.cookie('player_col', player.col);
		$.cookie('player_fam', player.fam);
		$.cookie('player_style', player.style);
		$.cookie('player_ital', player.ital);
		$.cookie('player_alpha', player.alpha);
		$.cookie('player_name', player.name);
		jump_start();
	}
	function ital() {
		if ($("#ital").is(":checked")) {
			$(".P").css("font-style", "italic");
		} else {
			$(".P").css("font-style", "normal");
		}
	}
	function we() {
		if ($("#wee").is(":checked")) {
			$(".P").css("font-weight", "bold");
		} else {
			$(".P").css("font-weight", "normal");
		}
	}
	function famSel() {
		$(".P").css("font-family", $("#fam").val());
	}
	function setLetter() {
		player.name = $("#myname").val().trim();
		player.alpha = $("#myname").val().substr(0, 1).toUpperCase();
		$(".P").html(player.alpha);
	}

    // setup graphic EQ
    $( "#eq1 > span" ).each(function() {
      // read initial values from markup and remove that
      //var value = parseInt( $( this ).text(), 10 );
		var value = 0;
		if (typeof($.cookie('vol1')) != undefined) {
			var value = $.cookie('vol1');
		} else {
			var value = 10;
		}
      $( this ).empty().slider({
        value: value,
        min: 1,
		max: 100,
        animate: true,
        orientation: "vertical",
		slide: function( event, ui ) {
			$.cookie('vol1', ui.value);
			changeVolume(ui.value, 1);
		}
      });
    });

	// unable to get which bar control is used, putting this duplicate for now
    $( "#eq2 > span" ).each(function() {
      // read initial values from markup and remove that
		var value = 0;
		if (typeof($.cookie('vol2')) != undefined) {
			var value = $.cookie('vol2');
		} else {
			var value = 5;
		}
      $( this ).empty().slider({
        value: value,
        min: 1,
		max: 100,
        animate: true,
        orientation: "vertical",
		slide: function( event, ui ) {
			$.cookie('vol2', ui.value);
			changeVolume(ui.value, 2);
		}
      });
    });