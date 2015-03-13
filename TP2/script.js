var i=0;
var elem = document.getElementById("animatedElem");
var left = 0;
var timer;
var timerv2;
var leftv=false;
var datactu= new Date();
var lancement=false;
var animation = false;


document.getElementById("startcarre").addEventListener("click", CarreMoveV1);
document.getElementById("stopcarre").addEventListener("click", StopCarre);
document.getElementById("resetcarre").addEventListener("click", ResetCarre);

function CarreMoveV1(){
	if (lancement==false){
		timer = setInterval(MoveV1, 16);
		lancement=true;
	}
} 

function MoveV1() {
	elem.style.left = ( left += 10 ) + "px";
	// clear the timer at 400px to stop the animation
	if ( left > 390 ) {
		StopCarre();
	}
}

function ResetCarre(){
	left=0;
	elem.style.left = left  + "px";
}

function StopCarre(){
	clearInterval(timer);
	lancement=false;
}
	
function pausecomp(millis) {
	var date = new Date();
	var curDate = null;
	do { 
		curDate = new Date(); 
	} while(curDate-date < millis);
} 

document.getElementById("startcarre2").addEventListener("click", CarreMoveV2);
document.getElementById("stopcarre2").addEventListener("click", StopCarreV2);

function StopCarreV2(){
	clearInterval(timerv2);
	lancement=false;
}

function CarreMoveV2(){
	if (lancement==false){
		timerv2 = setInterval(MoveV2, 16);
		lancement=true;	
		datactu= new Date();
	}
} 

//vitesse constante
function MoveV2() {
	var datenow = new Date();
	elem.style.left = ( left += (10/16)*(datenow-datactu) ) + "px";
	// clear the timer at 400px to stop the animation
	if ( left > 390 ) {
		StopCarreV2();
	}
	datactu= new Date();
}


window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;


document.getElementById("startcarre3").addEventListener("click", CarreMoveV3);
document.getElementById("stopcarre3").addEventListener("click", StopCarreV3);

function CarreMoveV3(){
	lancement=true;
	datactu= new Date();
	requestAnimationFrame(step);
}

function StopCarreV3(){
	lancement=false;
}

function step() {
	var progress;
	var Now = new Date();
	progress = Now - datactu;
	if (progress<160){
		if(leftv==false){
			elem.style.left = ( left += (10/16)*progress ) + "px";
		}
		if(leftv==true){
			elem.style.left = ( left -= (10/16)*progress ) + "px";
		}
		//inverse le sens si le carré depasse du bord droite de la fenetre et remet au bord de la fenetre le carre
		if (left>window.innerWidth-400 && leftv == false){
			leftv=true;
			left=window.innerWidth-400;
		}
		//pareil dans l'autre sens
		if (left<0 && leftv ==true){
			leftv=false;
			left=0;
		}
	}
	datactu=Now;
	if (lancement){
    		requestAnimationFrame(step);
	} 
}


document.getElementById("startdraw").addEventListener("click", StartDraw);
document.getElementById("stopdraw").addEventListener("click", StopDraw);

function StartDraw(){
	if (animation==false){
		animation=true;
		requestAnimationFrame(draw);
	}
}

function StopDraw(){
	animation=false;
}

function draw() {
	if (i==10){
		i=0;
	}
  	var ctx = document.getElementById("canvas").getContext('2d');
	var img=document.getElementById("image");
	ctx.clearRect(0,0,1000,1000);
  	ctx.drawImage(img,i*100,0,100,100,0,0,100,100);
	i++;
	pausecomp(32);
	if (animation){
		requestAnimationFrame(draw);
	}
}
