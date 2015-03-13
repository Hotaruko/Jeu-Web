var intervalID;
var timer;
var comptage=10;
var elem = document.getElementById("Carre");
var left = [];
var SensG = [];
var compt=document.getElementById("leCompteur");
var i=0;
var nouveauCarre=[];
var j=0;
var lancement=false;
var time=0;


function Compteur() {
  	intervalID = setInterval(Compte, 1000);
}


function Compte(){
	if (comptage>0){
		comptage--;
	}
	else {
		//comptage=10;
		stopCompt();
	}
	compt.innerHTML=comptage.toString();
}


function stopCompt() {
  	clearInterval(intervalID);
}

function resetCompt(){
	comptage=10;
	compt.innerHTML=comptage.toString();
}

document.getElementById("startcpt").addEventListener("click", Compteur);
document.getElementById("stopcpt").addEventListener("click", stopCompt);
document.getElementById("RaZ").addEventListener("click", resetCompt);


function CarreMove(){
	timer = setInterval(Mouvement, 16);
}
/*
function Mouvement(){
	if (left > 1200 && SensG==true) {
		inverse();
	}
	if (left<10 && SensG==false){
		inverse();
	}
	if (SensG==true){		
		elem.style.left = ( left += 5 ) + "px";
	}
	else {
		elem.style.left = ( left -= 5 ) + "px";
	}
}*/

function inverse(z){
	SensG[z]=!SensG[z];
}

function inverseTout(){
	var z=0;
	while (z<i){
		SensG[z]=!SensG[z];
		z++;		
	}
}

function stopCarre() {
 	clearInterval(timer);
	lancement=false;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function CreateCarre(){
	nouveauCarre[i] = document.createElement("div");
	nouveauCarre[i].id = "carre" + i;
	nouveauCarre[i].style.width = 50 + "px";
	nouveauCarre[i].style.height = 50 + "px";
	nouveauCarre[i].style.backgroundColor = getRandomColor();
	nouveauCarre[i].style.position = "relative";
	document.body.appendChild(nouveauCarre[i]);
	SensG[i]=true;
	left[i]=0;
	i++;
}


function CarreMovev2(){
	if (lancement==false){
		time=0;
		timer = setInterval(Mouvementv2, 16);
		lancement=true;	
	}
}

function Mouvementv2(){
	j=0;
	while (j<i){
		if (time>2000+j*1000) {// départ différé
			if (left[j] > window.innerWidth-50 && SensG[j]==true) {
				inverse(j);
			}
			if (left[j]<10 && SensG[j]==false){
				inverse(j);
			}
			if (SensG[j]==true){		
				nouveauCarre[j].style.left = ( left[j] += j+1 ) + "px";
			}
			else {
				nouveauCarre[j].style.left = ( left[j] -= j+1 ) + "px";
			}
		}
		j++;
	}
	time = time+16;
}



document.getElementById("startcarre").addEventListener("click", CarreMovev2);
document.getElementById("stopcarre").addEventListener("click", stopCarre);
document.getElementById("inversecarre").addEventListener("click", inverseTout);
document.getElementById("creation").addEventListener("click", CreateCarre);
























