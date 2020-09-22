// IGME-330 Project 1

'use strict';
let canvas, ctx;
let paused = true;

const windowParams = {
   "fps" : 12,
   "fadeOut" : false,
   "fadeSpeed" : 5,
   "canvasWidth" :  800,
   "canvasHeight" : 600
}


let lifeWorld;
const lifeParams = {
   "cellSize" : 10,
   "numRows" : 80,
   "numCols" : 60,
   "percentAlive" : 0.2
}



window.onload = init;

function init() {
   canvas = document.querySelector('canvas');
   ctx = canvas.getContext('2d');

   canvas.width = windowParams.canvasWidth;
   canvas.height = windowParams.canvasHeight;

   // Assign event handlers to buttons
   setupUI();

   //Add click ability to canvasWidth
   canvas.onclick = canvasClicked;


   // Create the world
   lifeWorld = new Lifeworld(lifeParams.numRows,lifeParams.numCols,lifeParams.percentAlive);
   // lifeWorld.randomSetup();
   drawBackground();
   drawWorld();

   loop();

}

function setupUI() {
   // Export current state as photo
   document.querySelector("#exportButton").onclick = function(e) {
      txmLIB.doExport(canvas);
   };


   document.querySelector("#createNewObjectButton").onclick = function(e) {
      txmLIB.createCity(ctx, "large");
   };

   // Reset world
   document.querySelector("#clearButton").onclick = function(e) {
      txmLIB.clearCanvas(ctx);
   }

   document.querySelector("#randomSetupButton").onclick = function(e) {
      lifeWorld.randomSetup();
   }

   document.querySelector("#stepButton").onclick = function(e) {
      drawBackground();
      drawWorld();
      lifeWorld.step();
   }

   document.querySelector("#fadeOutCheckbox").onchange = function() {
      windowParams.fadeOut = !windowParams.fadeOut;
   }



   document.querySelector('#percentAliveSlider').oninput = function() {
      document.querySelector("#currentPercentAlive").innerHTML = `Current: ${this.value}%`;

      let percentValue = this.value / 100;
      console.log("New value: " + percentValue);
      lifeParams.percentAlive = percentValue;
      // resetWorld();
   }

   document.querySelector('#fpsSlider').oninput = function() {
      windowParams.fps = this.value;
      document.querySelector("#currentFps").innerHTML = `Current: ${this.value}`;
   }

   document.querySelector('#fadeSpeedSlider').oninput = function() {
      windowParams.fadeSpeed = this.value;
   }



   document.querySelector('#rebuildWorld').onclick = function(e) {
      resetWorld();
      // randomSetup();
   }

   document.querySelector('#pauseButton').onclick = function() {
      if (paused) { return }
      paused = true;
   }
   document.querySelector('#playButton').onclick = function() {
      if (!paused) { return }
      paused = false;
   }

}

function canvasClicked(e){
   let rect = e.target.getBoundingClientRect();
   let mouseX = Math.round((e.clientX - rect.x) / 10) - 1;
   let mouseY = Math.round((e.clientY - rect.y) / 10) - 1;
   if (document.querySelector("#shapeType").value == "gun") {
      console.log("Drawing gun");
      lifeWorld.changeCell(mouseX - 1, mouseY - 1, 1);
      lifeWorld.changeCell(mouseX, mouseY - 1, 1);
      lifeWorld.changeCell(mouseX + 1, mouseY - 1, 1);
      lifeWorld.changeCell(mouseX - 1, mouseY, 1);
      lifeWorld.changeCell(mouseX, mouseY + 1, 1);
      drawCell(mouseX - 1, mouseY - 1, lifeParams.cellSize, 1);
      drawCell(mouseX, mouseY - 1, lifeParams.cellSize, 1);
      drawCell(mouseX + 1, mouseY - 1, lifeParams.cellSize, 1);
      drawCell(mouseX - 1, mouseY, lifeParams.cellSize, 1);
      drawCell(mouseX, mouseY + 1, lifeParams.cellSize, 1);


   } else {
      lifeWorld.changeCell(mouseX, mouseY, 1);
      drawCell(mouseX, mouseY, lifeParams.cellSize, 1);
   }
   console.log(mouseX,mouseY);
}

function createGlider(mouseX, mouseY) {

}


function resetWorld() {
   txmLIB.clearCanvas(ctx);
   lifeWorld = new Lifeworld(lifeParams.numRows,lifeParams.numCols,lifeParams.percentAlive);
   // lifeWorld.randomSetup();
   paused = false;
}

function loop(){
   setTimeout(loop,1000/windowParams.fps);
   // TODO: update lifeworld
   if (!paused) {
      drawBackground();
      drawWorld();
      lifeWorld.step();
   }
}

function drawBackground(){
	ctx.save();
	ctx.fillStyle = "black";
	if (windowParams.fadeOut == true) { ctx.globalAlpha = windowParams.fadeSpeed/windowParams.fps; }
	ctx.fillRect(0,0,windowParams.canvasWidth,windowParams.canvasHeight);
	ctx.restore();
}

function drawWorld(){
	// TODO: implement
   ctx.save();
   for (let col = 0; col < lifeWorld.numCols; col++) {
      for(let row = 0; row < lifeWorld.numRows; row++) {
         drawCell(col, row, lifeParams.cellSize, lifeWorld.world[col][row]);
      }
   }
   ctx.restore();
}

function drawCell(col,row,dimensions,alive) {
	// TODO: implement
   if (alive == 1) {
      ctx.beginPath();
      let img = document.querySelector("#emoji");
      ctx.drawImage(img, col*dimensions, row*dimensions);
      ctx.fill();
   }

   if (alive == 2) {
      ctx.beginPath();
      ctx.rect(col*dimensions, row*dimensions, dimensions, dimensions);
      ctx.fillStyle = alive ? "red" : "rgba(0,0,0,0)";
      ctx.fill();
   }

   // ctx.rect(col*dimensions, row*dimensions, dimensions, dimensions);
   // ctx.fillStyle = alive ? "red" : "rgba(0,0,0,0)";
}
