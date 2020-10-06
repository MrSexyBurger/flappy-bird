var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

var width = 480;
var height = 720;

canvas.width = width;
canvas.height = height;
canvas.style.position = 'absolute';
canvas.style.margin = 'auto';
canvas.style.left = '0';
canvas.style.right = '0';
canvas.style.top = '0';
canvas.style.bottom = '0';


var bird = document.createElement('img');
var sky = document.createElement('img');
var gameover = document.createElement('img');
var logo = document.createElement('img');


var rocks = [];
var clouds = [];
var tubes = [];

rocks[0] = document.createElement('img');
rocks[1] = document.createElement('img');

clouds[0] = document.createElement('img');
clouds[1] = document.createElement('img');

tubes[0] = document.createElement('img');
tubes[1] = document.createElement('img');

document.body.appendChild(canvas);

bird.src = 'bird.png';
sky.src = 'sky.png'
rocks[0].src = 'rocks_1.png';
rocks[1].src = 'rocks_2.png';
clouds[0].src = 'clouds_1.png';
clouds[1].src = 'clouds_2.png';
tubes[0].src = 'tubeTop.png';
tubes[1].src = 'tubeBottom.png';

gameover.src = 'gameOver.png';
logo.src = 'logo.png';



theme = document.createElement('audio');
theme.src = 'theme.mp3';
theme.volume = 0.1;
theme.loop = true;

jump = document.createElement('audio');
jump.src = 'jump.mp3';
jump.volume = 0.2;

/*///////////////////////////////////////////////////////////////////*/
var gameState = 'menu';
var fullscreen = false;




var bg = {
	position1 : 0,
	position2 : 0,
	speed1 : 0.25,
	speed2 : 0.5,
	update : function () {
		if (gameState == 'pause') {
			this.position1 = this.position1;
			this.position2 = this.position2;
		}else{
			this.position1 -= this.speed1;
			this.position2 -= this.speed2;
		}

		if (this.position1 <= -(height*1.77)) {
			this.position1 = 0;
		}

		if(this.position2 <= -(height*1.77)){
			this.position2 = 0;
		}
	},
	draw : function () {

		ctx.drawImage(sky, 0,0, height*1.77, height);
		
		ctx.drawImage(clouds[0], 0, 0, height*1.77, height);
		ctx.drawImage(clouds[1], 0, 0, height*1.77, height);

		ctx.drawImage(rocks[0], this.position1, 0, height*1.77, height);
		ctx.drawImage(rocks[0], this.position1 + height*1.77, 0, height*1.77, height);

		ctx.drawImage(rocks[1], this.position2, 0, height*1.77, height);
		ctx.drawImage(rocks[1], this.position2 + height*1.77, 0, height*1.77, height);
		
	}
}


var player = {
	alive : true,
	positionX : 70,
	positionY : height/2,
	speed : 0,
	gravity : 0.1,
	minSpeed : -5,
	maxHeight : 20,
	
	update : function(){

		if (gameState == 'pause'){
			this.speed == this.speed;
			this.positionY == this.positionY;
		}else{
			this.speed -= this.gravity;
			this.positionY -= this.speed;
		}

		if (this.speed < this.minSpeed) {
			this.speed = this.minSpeed;
		};

		if (this.positionY < this.maxHeight) {
			this.positionY = this.maxHeight;
			this.speed = 0;
		};
		if (this.positionY > height + 40) {
			this.alive = false;
		}
		
	},
	
	draw : function(){

		ctx.save();
		ctx.translate(this.positionX, this.positionY);
		ctx.rotate(-8*this.speed*(Math.PI/180));
	
		ctx.drawImage(bird, -40, -40, 80, 80);	

		ctx.translate(-this.positionX, -this.positionY);
		ctx.restore();

	}
}



var tube = {
	passed : false,
	positionX : width,
	positionY : 0,
	sizeX : 80,
	sizeY : 400,
	speed : 1,
	speedUp : 0.002,
		
	update : function () {

		if ( gameState == 'pause'){
			this.positionX = this.positionX;
			this.speed = this.speed;
		}else{
			this.positionX -= this.speed;
			this.speed += this.speedUp;
		}

		if (this.positionX < -this.sizeX) {
			this.positionX = width;
			this.positionY = Math.floor(Math.random()*(0 + 280) - 280);
			this.passed = false;
		}

		if (player.positionX > this.positionX + this.sizeX && this.passed == false &&
			player.positionY > this.positionY + this.sizeY && player.positionY < this.positionY + height - 120) {
			score.points++;
			this.passed = true;
		}

		if (player.positionX + 20 > this.positionX && player.positionX + 20 < this.positionX + this.sizeX &&
			player.positionY - 20 < this.positionY + this.sizeY) {
			player.alive = false;
		}

		if (player.positionX + 20 > this.positionX && player.positionX + 20 < this.positionX + this.sizeX &&
			player.positionY + 20> this.positionY + height - 120) {
			player.alive = false;
		}

	},
	
	draw : function () {
		ctx.drawImage(tubes[1], this.positionX , this.positionY, this.sizeX, this.sizeY);
		ctx.drawImage(tubes[0], this.positionX , this.positionY + height - 120, this.sizeX, this.sizeY);
		
	}
}

var pause = {
	positionX : 0,
	positionY : 0,
	sizeX : 40,
	sizeY : 40,

	draw : function(){
		if (player.alive) {
			ctx.fillStyle = 'red';
			ctx.fillRect(this.positionX, this.positionY, this.sizeX, this.sizeY);
			ctx.fillStyle = 'black';
			ctx.fillRect(this.positionX + 10, this.positionY+10, this.sizeX / 8, this.sizeY - 20);
			ctx.fillRect(this.positionX + this.sizeX - this.sizeX /8 - 10, this.positionY+10, this.sizeX / 8, this.sizeY - 20);
		}
	}
}


var score = {
	positionX : width - 170,
	positionY : 35,
	points : 0,
	draw : function(){
		if (player.alive) {
			ctx.beginPath();
			ctx.font = "40px Arial";
			ctx.fillStyle = 'white';
			ctx.fillText('score: ' + this.points, this.positionX, this.positionY);
		}
	}
}


/*///////////////////////////////buttons////////////////////////////////////////////////////////*/

var restart = {
	positionX : width/2 - 100,
	positionY : 350,
	sizeX : 200,
	sizeY : 50,

	draw : function(){
		ctx.beginPath();
		ctx.fillStyle = 'red';
		ctx.fillRect(this.positionX, this.positionY, this.sizeX, this.sizeY);

		ctx.beginPath();
		ctx.font = "40px Arial";
		ctx.fillStyle = 'white';
		ctx.fillText('Restart', this.positionX + 35, this.positionY + this.sizeY - 10);
	}

}


var menu = {
	positionX : width/2 - 100,
	positionY : 450,
	sizeX : 200,
	sizeY : 50,

	draw : function(){
		ctx.beginPath();
		ctx.fillStyle = 'red';
		ctx.fillRect(this.positionX, this.positionY, this.sizeX, this.sizeY);

		ctx.beginPath();
		ctx.font = "40px Arial";
		ctx.fillStyle = 'white';
		ctx.fillText('Menu', this.positionX + 50, this.positionY + this.sizeY - 10);
	}
}


var start = {
	positionX : width/2 - 100,
	positionY : 350,
	sizeX : 200,
	sizeY : 50,

	draw : function(){
		ctx.beginPath();
		ctx.fillStyle = 'red';
		ctx.fillRect(this.positionX, this.positionY, this.sizeX, this.sizeY);

		ctx.beginPath();
		ctx.font = "40px Arial";
		ctx.fillStyle = 'white';
		ctx.fillText('START', this.positionX + 35, this.positionY + this.sizeY - 10);
	}

}

var fullScreen = {
	positionX : width/2 - 100,
	positionY : 450,
	sizeX : 200,
	sizeY : 50,

	draw : function(){
		ctx.beginPath();
		ctx.fillStyle = 'red';
		ctx.fillRect(this.positionX, this.positionY, this.sizeX, this.sizeY);

		ctx.beginPath();
		ctx.font = "38px Arial";
		ctx.fillStyle = 'white';
		ctx.fillText('FullScreen', this.positionX + 10, this.positionY + this.sizeY - 10);
	}

}

var exit = {
	positionX : width/2 - 100,
	positionY : 550,
	sizeX : 200,
	sizeY : 50,

	draw : function(){
		ctx.beginPath();
		ctx.fillStyle = 'red';
		ctx.fillRect(this.positionX, this.positionY, this.sizeX, this.sizeY);

		ctx.beginPath();
		ctx.font = "40px Arial";
		ctx.fillStyle = 'white';
		ctx.fillText('EXIT', this.positionX + 55, this.positionY + this.sizeY - 10);
	}

}

/*/////////////////////////////////////////////////////////////////////////////////////////////////*/

function restore(){
		score.points = 0;
		
		player.alive = true;
		player.positionX = 70;
		player.positionY = height/2;
		player.speed = 0;

		bg.position1 = 0;
		bg.position2 = 0;

		tube.positionX = width;
		tube.speed = 1;
		
	}

function gameOver(){
	gameState = 'pause';
	ctx.drawImage(gameover, 0, -50, width, width/1.4);

	ctx.beginPath();
	ctx.font = "40px Arial";
	ctx.fillStyle = 'white';
	ctx.fillText('your score: ' + score.points + ' points', 50, 250);

	restart.draw();
	menu.draw();
}

function pauseSwitch(){
	if (gameState == "pause") {
		gameState = 'play';
	} else if (gameState == 'play'){
		gameState = 'pause';
	}
}


var mouse = {
	positionX : 0,
	positionY : 0,

	click : function(){

		if (this.positionX >= fullScreen.positionX && this.positionX <= fullScreen.positionX + fullScreen.sizeX && 
			this.positionY >= fullScreen.positionY && this.positionY <= fullScreen.positionY + fullScreen.sizeY &&
			gameState == 'menu'){
			if (!fullscreen) {
				document.body.requestFullscreen();
				fullscreen = true;
			}else{
				document.exitFullscreen();
				fullscreen = false;
			}
					
		}

		if (this.positionX >= pause.positionX && this.positionX <= pause.positionX + pause.sizeX && 
			this.positionY >= pause.positionY && this.positionY <= pause.positionY + pause.sizeY &&
			gameState == 'play'){
			if (player.alive) {
				pauseSwitch();
			}
			

		}else if(this.positionX >= pause.positionX && this.positionX <= pause.positionX + pause.sizeX && 
			this.positionY >= pause.positionY && this.positionY <= pause.positionY + pause.sizeY &&
			gameState == 'pause'){
			if (player.alive) {
				pauseSwitch();
			}

		}else if (player.alive == true && gameState == 'play'){
			player.speed = 5;
			jump.currentTime = 0;
			jump.play();
		}


		if (this.positionX >= restart.positionX && this.positionX <= restart.positionX + restart.sizeX && 
			this.positionY >= restart.positionY && this.positionY <= restart.positionY + restart.sizeY &&
			gameState == 'pause'){
			if (player.alive == false) {
				gameState = 'play';
				restore();
			}
		}

		if (this.positionX >= menu.positionX && this.positionX <= menu.positionX + menu.sizeX && 
			this.positionY >= menu.positionY && this.positionY <= menu.positionY + menu.sizeY &&
			gameState == 'pause'){
			if (player.alive == false) {
				gameState = 'menu';
			}
		}

		if (this.positionX >= start.positionX && this.positionX <= start.positionX + start.sizeX && 
			this.positionY >= start.positionY && this.positionY <= start.positionY + start.sizeY &&
			gameState == 'menu'){
			gameState = 'play';
			restore();			
		}

		if (this.positionX >= exit.positionX && this.positionX <= exit.positionX + exit.sizeX && 
			this.positionY >= exit.positionY && this.positionY <= exit.positionY + exit.sizeY &&
			gameState == 'menu'){
			window.close();			
		}
	}
}

function drawMenu(){

	ctx.drawImage(sky, 0,0, height*1.77, height);
		
	ctx.drawImage(clouds[0], 0, 0, height*1.77, height);
	ctx.drawImage(clouds[1], 0, 0, height*1.77, height);

	ctx.drawImage(rocks[0], 0, 0, height*1.77, height);
	ctx.drawImage(rocks[1], 0, 0, height*1.77, height);

	ctx.drawImage(logo, 0, 0, width, width/3);
	
	start.draw();
	fullScreen.draw();
	exit.draw();
}

function drawLevel(){
		bg.update();
		bg.draw();
		player.update();
		player.draw();
		tube.update();
		tube.draw();
		pause.draw();
		score.draw();
}
/*///////////////////////////////////////////////////////////////////////////////////////*/

tube.positionY = Math.floor(Math.random()*(0 + 280) - 280);

window.addEventListener('click', event => {
	mouse.click();
});

window.onmousemove = function(){
	mouse.positionX = event.clientX - canvas.getBoundingClientRect().left;
	mouse.positionY = event.clientY - canvas.getBoundingClientRect().top;
}

function gameEngine() {
	ctx.clearRect(0,0,width, height)
	
	if (gameState != 'menu'){
		drawLevel();
		
		if (player.alive == false) {
			gameOver();
		}
	}

	if (gameState == 'menu'){
		drawMenu();

	}

	requestAnimationFrame(gameEngine);
}

gameEngine();

theme.play();