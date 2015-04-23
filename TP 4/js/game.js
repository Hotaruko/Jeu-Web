var animFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            null;

var tics = 0;
var _timeToBeAlive = 30;

//Canvas
var divArena;
var canArena;
var canScore;
var conArena;
var conScore;
var ArenaWidth = 1000;
var ArenaHeight = 600;

//Background
var imgBackground;
var xBackgroundOffset = 0;
var xBackgroundSpeed = 1;
var backgroundWidth = 1782;
var backgroundHeight = 600;
//une modification

///////////////////////////////////
//Keys
var keys = {
    UP: 38,
    DOWN: 40,
    SPACE: 32,
    ENTER: 13
};

var keyStatus = {};

function keyDownHandler(event) {
    "use strict"; 
    var keycode = event.keyCode, 
        key; 
    for (key in keys) {
        if (keys[key] === keycode) {
            keyStatus[keycode] = true;
            event.preventDefault();
        }
    }
}
function keyUpHandler(event) {
   var keycode = event.keyCode,
            key;
    for (key in keys) 
        if (keys[key] == keycode) {
            keyStatus[keycode] = false;
        }
        
    }
///////////////////////////////////


///////////////////
// une collection de projectiles
function ProjectileSet(tabTarget){
  this.tabTarget = tabTarget;
  this.score = 0;
  this.tabProjectiles = new Array();
  this.add = function (projectile) {
    this.tabProjectiles.push(projectile);  
  };
  this.remove = function () {  

       this.tabProjectiles.map(function(obj,index,array){
            if(obj.exists == false ||obj.x >ArenaWidth || obj.x<0){
                  delete array[index];
            }
        });

  };


 this.update = function(){
        this.remove();
        var score = 0;
        this.tabProjectiles.map(function(obj){
            obj.update();
            if(obj.exists == false) {//hit
                score = score +1;
            }
        });
        this.score = this.score + score;
    };
 this.clear = function(){
    this.tabProjectiles.map(function(obj){
         obj.clear();
    });
 };
 this.draw = function(){
    this.tabProjectiles.map(function(obj){
        obj.draw();
    });
     //console.log(this.tabProjectiles.length);
 };
    
};

////////////////////
// un objet Projectile
function Projectile(x,y,speed,width,height,color,PlayerProject,Diag,Haut){
    this.x = x;
    this.y = y;
    this.xSpeed = speed;
    this.width = width;
    this.height = height;
    this.color = color;
    this.exists = true;
    this.playerProj=PlayerProject;
	this.diagonale=Diag;
	this.direction=Haut;
    this.collision = function(tabOfObjects){
        var hits = null;
        var index;
        for(index in tabOfObjects){
            if (this.x < tabOfObjects[index].x + tabOfObjects[index].width &&
                this.x + this.width > tabOfObjects[index].x &&
                this.y < tabOfObjects[index].y + tabOfObjects[index].height &&
                this.height + this.y > tabOfObjects[index].y &&
			 tabOfObjects[index].cptExplosion == 0) {
                    // collision detected!
			if ((this.playerProj && tabOfObjects[index]!=player) || (this.playerProj == false && tabOfObjects[index]==player)){
		          hits = tabOfObjects[index];
		          break;
			}
            }
        }
        return hits;  
    };
    this.draw = function(){
        if(this.exists){
            conArena.fillStyle = this.color;
            conArena.fillRect(this.x,this.y,this.width,this.height);
        }
    };
    this.clear = function(){
        if(this.exists){
            conArena.clearRect(this.x-1,this.y-1,this.width+2,this.height+2);
        }
    };
    this.update = function(){
        if(this.exists){
		if (this.diagonale){
			if (this.direction){
				this.y -= this.xSpeed/2;
			}
			else {
				this.y += this.xSpeed/2;
			}
		}
            this.x +=   this.xSpeed ;
            var tmp = this.collision([player].concat(enemies.tabEnemies));
            if(tmp != null){
                tmp.explodes();
                this.exists = false;
            }
        }
    };
}
/////////////////////////////////

/////////////////////////////////
// Enemy
var enemies = {
    init : function(){
        this.tabEnemies = new Array();
    },
    add : function (enemy) {
        this.tabEnemies.push(enemy);  
    },
    remove : function () {  
        this.tabEnemies.map(function(obj,index,array){
            if(obj.exists == false ||obj.x >ArenaWidth || obj.x<0){
                  delete array[index];
            }
        });
    },
    draw : function(){ 
        this.tabEnemies.map(function(obj){
            obj.draw();
        });
    },
    clear : function(){
       this.tabEnemies.map(function(obj){
            obj.clear();
        });
    },
    update : function(){

        this.tabEnemies.map(function(obj){
            obj.update();
        });
         this.remove();
    }
    
};
//test
function Enemy(x,y,speed){
    this.x = x;
    this.yOrigine = 100*y;
    this.y = this.yOrigine;
    this.xSpeed = speed*2-1;
    this.exists = true;
    this.height = 30;
    this.width = 40;
	this.pattern=y;
    this.img = new Image();
    this.img.src = "./assets/Enemy/eSpritesheet_40x30.png";
    this.cpt = 0;
	this.offscreenCanvas = new Array();
	while (this.cpt<6){
		this.offscreenCanvas[this.cpt] = document.createElement("canvas");
		this.offscreenCanvas[this.cpt].width = this.width;
		this.offscreenCanvas[this.cpt].height = this.height;
		this.offscreenContext = this.offscreenCanvas[this.cpt].getContext("2d");
		this.offscreenContext.drawImage(this.img,0,this.height*this.cpt,this.width,this.height,0,0,this.width,this.height);
		this.cpt++;
	}
	this.cpt=0;

    this.cptExplosion =  0;//10 images
    this.imgExplosion = new Image();
    this.imgExplosionHeight = 128;
    this.imgExplosionWidth = 128;
    this.imgExplosion.src = "./assets/E10*Math.sin(this.pattern)xplosion/explosionSpritesheet_1280x128.png";
	this.offscreenExplosion = new Array();
	while (this.cptExplosion<10){
		this.offscreenExplosion[this.cptExplosion] = document.createElement("canvas");
		this.offscreenExplosion[this.cptExplosion].width = this.imgExplosionWidth;
		this.offscreenExplosion[this.cptExplosion].height = this.imgExplosionHeight;
		this.offscreenContext = this.offscreenExplosion[this.cptExplosion].getContext("2d");
		this.offscreenContext.drawImage(this.imgExplosion,this.imgExplosionWidth*this.cptExplosion,0,this.imgExplosionWidth,this.imgExplosionHeight,0,0,this.imgExplosionWidth,this.imgExplosionHeight);
    		this.cptExplosion++;
	}
	this.cptExplosion=0;
	this.projectileSet = new ProjectileSet();
    this.explodes = function(){
        this.cptExplosion = 1;
    };
    this.collision = function(tabOfObjects){
        var hits = null;
        var index;
        for(index in tabOfObjects){
            if (this.x < tabOfObjects[index].x + tabOfObjects[index].width &&
                this.x + this.width > tabOfObjects[index].x &&
                this.y < tabOfObjects[index].y + tabOfObjects[index].height &&
                this.height + this.y > tabOfObjects[index].y) {
                    // collision detected!
                    hits = tabOfObjects[index];
				console.log("bang");
                    break;
            }
        }
        return hits;
    };
    this.fire = function (){
        var tmp = new Projectile(this.x-10,this.y+this.height/2,-4,10,5,"rgb(0,200,0)",false,false,false);
        this.projectileSet.add(tmp);
    };
    this.draw = function(){ 

        this.projectileSet.draw();
	if (this.cptExplosion<100){
		   if(this.cptExplosion!=0){
			if(this.cptExplosion<10){
		          conArena.drawImage(this.offscreenExplosion[this.cptExplosion],this.x-44,this.y-49);
			}
		   }else{
		       conArena.drawImage(this.offscreenCanvas[this.cpt],this.x,this.y);
		   }
	}
	else	{
		this.exists=false;
	}
    };
    this.clear = function(){
        if(this.exists){
		if (this.cptExplosion!=0){
			conArena.clearRect(this.x-44,this.y-49,this.imgExplosionWidth,this.imgExplosionHeight);
		}
		else {
           	conArena.clearRect(this.x,this.y,this.width,this.height);
		}
        }
        this.projectileSet.clear();
    };
    this.update = function(){
       if(this.cptExplosion==0){//is not exploding
            this.x +=   this.xSpeed ;
			switch(this.pattern) {
			    case 0:
           			this.y += 0.5*-this.xSpeed;
				  	break;
			    case 1:
           			this.y += 0.35*-this.xSpeed;
				   break;
			    case 2:
           			this.y +=  -this.xSpeed*ArenaHeight/200 * Math.sin(this.x / 50);
				   break;
			    case 3:
           			this.y +=  -this.xSpeed*ArenaHeight/200 * Math.sin(this.x / 50);
				   break;
			    case 4:
           			this.y += 0.35*this.xSpeed;
				   break;
			    case 5:
           			this.y += 0.5*this.xSpeed;
				   break;
				}	 
            var tmp = this.collision([player]);
                if(tmp != null){
                    tmp.explodes();
				this.cptExplosion++;
                }

            if(tics % 5 == 1) {
                    this.cpt = (this.cpt + 1) % 6;
            }
            if(tics % 20 == 1) this.fire();
       }else{
            if(tics % 3 == 1) {
                this.cptExplosion++;
            }
            if(this.cptExplosion>100){//end of animation
                this.cptExplosion=0;
           	 this.exists = false;
            }
        }
        this.projectileSet.update();
    };
}
/////////////////////////////////

/////////////////////////////////
// Hero Player
var player = {
    init : function(){
        this.img = new Image();
        this.img.src = "./assets/Ship/ship.png";
        this.cpt = 0;
        this.cptExplosion =  0;//10 images
        this.imgExplosion = new Image();
        this.imgExplosionHeight = 128;
        this.imgExplosionWidth = 128;
        this.imgExplosion.src = "./assets/Explosion/explosionSpritesheet_1280x128.png";
        this.projectileSet = new ProjectileSet();
	this.offscreenExplosion = new Array();
		while (this.cptExplosion<10){
			this.offscreenExplosion[this.cptExplosion] = document.createElement("canvas");
			this.offscreenExplosion[this.cptExplosion].width = this.imgExplosionWidth;
			this.offscreenExplosion[this.cptExplosion].height = this.imgExplosionHeight;
			this.offscreenContext = this.offscreenExplosion[this.cptExplosion].getContext("2d");
			this.offscreenContext.drawImage(this.imgExplosion,this.imgExplosionWidth*this.cptExplosion,0,this.imgExplosionWidth,this.imgExplosionHeight,0,0,this.imgExplosionWidth,this.imgExplosionHeight);
	    		this.cptExplosion++;
		}
        this.cptExplosion =  0;
	this.offscreenCanvas = new Array();
	while (this.cpt<4){
		this.offscreenCanvas[this.cpt] = document.createElement("canvas");
		this.offscreenCanvas[this.cpt].width = this.width;
		this.offscreenCanvas[this.cpt].height = this.height;
		this.offscreenContext = this.offscreenCanvas[this.cpt].getContext("2d");
		this.offscreenContext.drawImage(this.img,0,this.height*this.cpt,this.width,this.height,0,0,this.width,this.height);
		this.cpt++;
	}
	this.cpt=0;
    },
    x : 20,
    ySpeed : 10,
    y : 100,
    height : 29,
    width : 64,
    nbOfLives : 42,
    timeToBeAlive : 0,
    fires : function(){
		var tmp;
		tmp = new Projectile(this.x+this.width,this.y+(this.height/2),4,10,3,"rgb(200,0,0)",true,true,true);
        this.projectileSet.add(tmp);
		tmp = new Projectile(this.x+this.width,this.y+(this.height/2),4,10,3,"rgb(200,0,0)",true,true,false);
        this.projectileSet.add(tmp);
		tmp = new Projectile(this.x+this.width,this.y+(this.height/2),4,10,3,"rgb(200,0,0)",true,false,false);
        this.projectileSet.add(tmp);
    },
    explodes : function(){
        if(this.timeToBeAlive == 0) {
            this.nbOfLives--;
            if(this.nbOfLives>0){
                this.timeToBeAlive = _timeToBeAlive;
                this.cptExplosion = 1;
            }else{
                //Game Over
                console.log("GAME OVER");
            }
        }
    },
    clear : function(){
	if (this.cptExplosion!=0){
        conArena.clearRect(this.x-32,this.y-49,this.imgExplosionWidth,this.imgExplosionHeight);
	}
	else {
        conArena.clearRect(this.x,this.y,this.width,this.height);
	}
        this.projectileSet.clear();
    },
    update :  function(){
        var keycode;
        if(tics % 10 == 1) {
                this.cpt = (this.cpt + 1) % 4;
            }
        if(this.timeToBeAlive>0) {
            this.timeToBeAlive --;
        }else{
            for (keycode in keyStatus) {
                if(keyStatus[keycode] == true){
                    if(keycode == keys.UP) {
                        this.y -= this.ySpeed;
                        if(this.y<0) this.y=0;
                    }
                    if(keycode == keys.DOWN) {
                        this.y += this.ySpeed;
                        if(this.y>ArenaHeight-this.height) this.y=ArenaHeight-this.height;
                    }	
                    if(keycode == keys.SPACE) {
                        //shoot
                        this.fires();
                    }
                }
             keyStatus[keycode] = false;
            }
        }
        this.projectileSet.update();
    },
    draw : function(){
        if(this.timeToBeAlive == 0) {
            conArena.drawImage(this.offscreenCanvas[this.cpt], this.x,this.y);
        }else{
            //exploding
            if(this.cptExplosion!=0){
			if (this.cptExplosion<10){
               	 conArena.drawImage(this.offscreenExplosion[this.cptExplosion], this.x-32,this.y-49);
			}
               if(tics % 3 == 1) {this.cptExplosion++;}
                if(this.cptExplosion>10) this.cptExplosion=0;
            }
        }
        this.projectileSet.draw();
    }
};



function updateScene() {
    "use strict"; 
    xBackgroundOffset = (xBackgroundOffset - xBackgroundSpeed) % backgroundWidth;
}
function updateItems() {
    "use strict"; 
    player.update();
    tics++;
     if(tics % 30 == 1) {
         var rand = Math.floor(Math.random() *6);
         var randSp = Math.ceil(Math.random() *-2);

        enemies.add(new Enemy(ArenaWidth, rand,randSp));
    }
    enemies.update();
}
function drawScene() {
    "use strict"; 
    canArena.style.backgroundPosition = xBackgroundOffset + "px 0px" ;
}
function drawItems() {
    "use strict"; 
    player.draw();
    enemies.draw();
}
function clearItems() {
    "use strict"; 
    player.clear(); 
    enemies.clear();
}
function clearScore() {
    conScore.clearRect(0,0,300,50);
}
function drawScore() {
    conScore.fillText("life : "+player.nbOfLives, 10, 25);
    conScore.fillText("score : "+player.projectileSet.score, 150,25);
}
function updateGame() {
    "use strict"; 
    updateScene();
    updateItems();
}
function clearGame() {
    "use strict"; 
    clearItems();
    clearScore();
}

function drawGame() {
    "use strict"; 
    drawScene();
    drawScore();
    drawItems();    
}


function mainloop () {
    "use strict"; 
    clearGame();
    updateGame();
    drawGame();
}

function recursiveAnim () {
    "use strict"; 
    mainloop();
    animFrame( recursiveAnim );
}
 
function init() {
    "use strict";
    divArena = document.getElementById("arena");
    canArena = document.createElement("canvas");
    canArena.setAttribute("id", "canArena");
	canArena.width = ArenaWidth;
	canArena.height = ArenaHeight;
    conArena = canArena.getContext("2d");
    divArena.appendChild(canArena);
    canScore = document.createElement("canvas");
    canScore.setAttribute("id","canScore");
    canScore.height=ArenaHeight;
    canScore.width=ArenaWidth;
    conScore = canScore.getContext("2d");
    conScore.fillStyle = "rgb(200,0,0)";
    conScore.font = 'bold 12pt Courier';
    divArena.appendChild(canScore);
	canArena.addEventListener("mousemove", doMouseMove,false);
	canArena.addEventListener("mousedown", doMouseDown,false);
 
    player.init();
    enemies.init();
    
window.addEventListener("keydown", keyDownHandler, false);
window.addEventListener("keyup", keyUpHandler, false);
    
    animFrame( recursiveAnim );
    
}

function doMouseMove(event){
    player.clear(); 
	player.y=event.clientY-player.height;
	player.x=event.clientX-player.width;
    player.draw();
}

function doMouseDown(event){
	player.fires();
}

window.addEventListener("load", init, false);

