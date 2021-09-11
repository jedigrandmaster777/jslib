var pjs = function(id){
	if(typeof id === "string"){
		this.canvas = document.getElementById(id);
	} else if(typeof id === "object"){
		this.canvas = id;
	}
	try{
		this.ctx = this.canvas.getContext("2d");
	} catch(error){
		throw new Error("Supplied element is not a canvas");
	}

	this.ctx.fillStyle = "#FFFFFF";
	
	this.dostroke = true;
	this.dofill = true;
}

pjs.createCanvas = function(){
	var newCanvas = document.createElement("canvas");
	newCanvas.height = 400;
	newCanvas.width = 400;
	newCanvas.style = "border:1px solid #000000;";

	document.body.appendChild(newCanvas);
	return new pjs(newCanvas);
}

//drawing 
pjs.prototype.ellipse = function(x, y, width, height){//should be optimized
	if(this.dostroke === false && this.dofill === false){
		console.log("Error: both stroke and fill are turned off");
		return;
	}
	this.ctx.beginPath();
	this.ctx.ellipse(x, y, width, height, Math.PI / 4, 0, 2 * Math.PI);
	if(this.dofill){
		this.ctx.fill();
	}
	if(this.dostroke){
		this.ctx.stroke();
	}
}
pjs.prototype.triangle = function(x1, y1, x2, y2, x3, y3){// should be optimized
	if(this.dostroke === false && this.dofill === false){
		console.log("Error: both stroke and fill are turned off");
		return;
	}
	this.ctx.beginPath();
	this.ctx.moveTo(x1, y1);
	this.ctx.lineTo(x2, y2);
	this.ctx.lineTo(x3, y3);
	this.ctx.lineTo(x1, y1);
	if(this.dofill){
		this.ctx.fill();
	}
	if(this.dostroke){
		this.ctx.stroke();
	}
}
pjs.prototype.rect = function(x, y, width, height){
	if(this.dostroke === false && this.dofill === false){
		console.log("Error: both stroke and fill are turned off");
		return;
	}
	if(this.dofill){
		this.ctx.fillRect(x, y, width, height);
	}
	if(this.dostroke){
		this.ctx.strokeRect(x, y, width, height);
	}
}
pjs.prototype.line = function(x1, y1, x2, y2){//should be optimized
	if(this.dostroke === false){
		console.log("Error: stroke is turned off but you are attempting to draw a line");
		return;
	}
	this.ctx.beginPath();
	this.ctx.moveTo(x1, y1);
	this.ctx.lineTo(x2, y2);
	this.ctx.stroke();
}
pjs.prototype.background = function(r, g, b){
	this.prevfill = this.ctx.fillStyle;
	this.ctx.fillStyle = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.ctx.fillStyle = this.prevfill;
}
pjs.prototype.fill = function(r, g, b){
	if(this.dofill !== true){
		this.dofill = true; 
	}
	this.ctx.fillStyle = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
pjs.prototype.stroke = function(r, g, b){
	if(this.dostroke !== true){
		this.dostroke = true;
	}
	this.ctx.strokeStyle = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
pjs.prototype.strokeWeight = function(weight){
	this.ctx.lineWidth = weight;
}
pjs.prototype.noStroke = function(){
	this.dostroke = false;
}
pjs.prototype.noFill = function(){
	this.dofill = false;
}

//utilities
pjs.random = function(min, max){
  min = Math.ceil(min);
	max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
pjs.setCookie = function(cname, cvalue, exdays){
 	const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
pjs.getCookie = function(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
//mouse event listeners
pjs.mouseX = 0;
pjs.mouseY = 0;
pjs.mouseButtons = [];
pjs.mouseMoved = function(){
	throw new Error("mouseMoved is not defined");
}
pjs.mouseClicked = function(e){
	throw new Error("mouseClicked is not defined");
}
pjs.mouseReleased = function(e){
	throw new Error("mouseReleased is not defined");	
}
pjs.mouseReleasedTemplate = pjs.mouseReleased;
pjs.mouseTemplate = pjs.mouseMoved;
pjs.mouseClickedTemplate = pjs.mouseClicked;
pjs.internalMouseListener = function(e){
	if(pjs.mouseTemplate !== pjs.mouseMoved){ 
		pjs.mouseMoved();
	}
	pjs.mouseX = e.clientX;
	pjs.mouseY = e.clientY;	
}
pjs.internalMouseClickListener = function(e){
	if(pjs.mouseClickedTemplate !== pjs.mouseClicked){
		pjs.mouseClicked(e);
	}
	if(pjs.mouseButtons[e.button] !== true){
		mouseButtons[e.button] = true;	
	}
}
pjs.internalMouseReleaseListener = function(e){
	if(pjs.mouseReleasedTemplate !== pjs.mouseReleased){
		pjs.mouseReleased(e);	
	}
	if(pjs.mouseButtons[e.button] !== false){
		pjs.mouseButtons[e.button] = false;
	}
}
pjs.getMouseButton = function(button){
	if(pjs.mouseButtons[button]){
		return true;
	} else {
		return false;
	}
}
document.addEventListener("mouseup", pjs.internalMouseReleaseListener);
document.addEventListener("mousedown", pjs.internalMouseClickListener);
document.addEventListener("mousemove", pjs.internalMouseListener);
pjs.prototype.getMouseOffset = function(){
	return {
		x: pjs.mouseX - this.canvas.offsetLeft,
		y: pjs.mouseY - this.canvas.offsetTop
	};
}
//keyboard event listeners:
pjs.keyPressed = function(e){
	throw new Error("keyPressed has not been defined"); //maybe remove
}
pjs.keyReleased = function(e){
	throw new Error("keyReleased has not been defined");
}
pjs.template = pjs.keyPressed;
pjs.template2 = pjs.keyReleased;

pjs.keys = [];

pjs.internalKeyPressListener = function(e){
	if(pjs.keyPressed !== pjs.template){
		pjs.keyPressed(e);
	}
	if(pjs.keys[e.key] !== true){
		pjs.keys[e.key] = true;
	}
}
pjs.internalKeyReleaseListener = function(e){
	if(pjs.keyReleased !== pjs.template2){
		pjs.keyReleased(e);
	}
	if(pjs.keys[e.key] !== false){
		pjs.keys[e.key] = false;
	}
}
document.addEventListener("keydown", pjs.internalKeyPressListener);
document.addEventListener("keyup", pjs.internalKeyReleaseListener);
pjs.getKey = function(key){
	if(pjs.keys[key] === true){
		return true;
	} else {
		return false;
	}
}

//Draw function

pjs.draw = function(){
	throw new Error("draw has not been defined");
}
pjs.template3 = pjs.draw;
pjs.drawId = null;

pjs.loadEventListenerIsActive = true;

pjs.loadEventListeners = function(){
	if(pjs.draw !== pjs.template3){
		pjs.drawId = setInterval(pjs.draw, 33);
	}
	window.removeEventListener("load", pjs.loadEventListeners); //these are probably not necessary 
	pjs.loadEventListenerIsActive = false;
}

window.addEventListener("load", pjs.loadEventListeners); //not the best way of doing things, but it works

//update this at some point
pjs.selfDestruct = function(){
	if(pjs.drawId !== null){
		clearInterval(pjs.drawId);
	}
	document.removeEventListener("mouseup", pjs.internalMouseReleaseListener);
	document.removeEventListener("mousedown", pjs.internalMouseClickListener);
	document.removeEventListener("mousemove", pjs.internalMouseListener);
	
	document.removeEventListener("keydown", pjs.internalKeyPressListener);
	document.removeEventListener("keyup", pjs.internalKeyReleaseListener);
	
	if(pjs.loadEventListenerIsActive === true){
		window.removeEventListener("load", pjs.loadEventListeners);
		pjs.loadEventListenerIsActive = false; //probably not necessary 
	}
	pjs = null;
}
