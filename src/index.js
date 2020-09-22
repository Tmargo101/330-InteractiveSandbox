// IGME-330 Project 1
(function (){

'use strict';
let canvas, ctx;
let paused = true;

const windowParams = {
   "fps" : 10,
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
   "percentAlive" : 0.2,
   "randomSetupOnNext" : false
}

const UI = {
   // Controls added in method setupButtons()
}

window.onload = init;

function init() {
   // Grab canvas & set width / height
   canvas = document.querySelector('canvas');
   ctx = canvas.getContext('2d');
   canvas.width = windowParams.canvasWidth;
   canvas.height = windowParams.canvasHeight;

   // Select all buttons in the UI & set starting positions
   setupButtons();

   // Assign event handlers to buttons
   assignEventHandlers();

   //Add click ability to canvasWidth
   canvas.onclick = canvasClicked;

   // Create the world
   lifeWorld = new Lifeworld(lifeParams.numRows,lifeParams.numCols,lifeParams.percentAlive);
   if (lifeParams.randomSetupOnNext == true) {
      lifeWorld.randomSetup();
   }

   // Draw the first frame
   drawBackground();
   drawWorld();

   // Start the loop
   loop();
}

function setupButtons() {
   // Assign controls to values in the controls array

   // Play pause button
   UI.playPauseButton = document.querySelector('#playPauseButton');
   UI.fpsSlider = document.querySelector('#fpsSlider');
   UI.fpsDisplay = document.querySelector('#fpsDisplay')
   UI.stepButton = document.querySelector('#stepButton');

   // Creation Controls
   UI.shapeSelector = document.querySelector('#shapeType');

   // World controls
   UI.clearButton = document.querySelector('#clearButton');
   UI.exportButton = document.querySelector('#exportButton');
   UI.rebuildWorldButton = document.querySelector('#rebuildWorldButton');
   UI.fadeOutCheckbox = document.querySelector('#fadeOutCheckbox');
   UI.fadeSpeedSlider = document.querySelector('#fadeSpeedSlider');
   UI.randomSetupCheckbox = document.querySelector('#randomSetupCheckbox');
   UI.percentAliveSlider = document.querySelector('#percentAliveSlider');
   UI.percentAliveDisplay = document.querySelector('#percentAliveDisplay');
   UI.gridSizeSelector = document.querySelector('#gridSize');


   // Set controls to values from code
   UI.fpsSlider.value = windowParams.fps;
   UI.fpsDisplay.innerHTML = `Current: ${windowParams.fps}`;
   UI.fadeOutCheckbox.value = windowParams.fadeOut;
   UI.fadeSpeedSlider.value = windowParams.fadeSpeed;
   UI.randomSetupCheckbox.checked = lifeParams.randomSetupOnNext;

   // Disable controls
   UI.fadeSpeedSlider.disabled = true;
   UI.percentAliveSlider.disabled = true;
}

function assignEventHandlers() {

   // Play Pause Controls
   UI.playPauseButton.onclick = function() {
      paused = !paused;
      if (paused) {
         UI.playPauseButton.innerHTML = "Play";
         UI.stepButton.disabled = false;
      } else {
         UI.playPauseButton.innerHTML = "Pause";
         UI.stepButton.disabled = true;
      }
   }

   // Change FPS
   UI.fpsSlider.oninput = function() {
      windowParams.fps = this.value;
      UI.fpsDisplay.innerHTML = `Current: ${this.value}`;
   }

   // Step forward one frame
   UI.stepButton.onclick = function(e) {
      drawBackground();
      drawWorld();
      lifeWorld.step();
   }

   // Creation Controls

   // World Controls

   // Export current state as photo
   UI.exportButton.onclick = function(e) {
      txmLIB.doExport(canvas);
   };


   // Enable / disable fade out functionality
   UI.fadeOutCheckbox.onchange = function() {
      windowParams.fadeOut = !windowParams.fadeOut;
      UI.fadeSpeedSlider.disabled = !UI.fadeSpeedSlider.disabled;
   }

   // Change fade speed
   UI.fadeSpeedSlider.oninput = function() {
      windowParams.fadeSpeed = this.value;
   }


   // Enable / disable random generation on next world rebuild
   UI.randomSetupCheckbox.onchange = function() {
      lifeParams.randomSetupOnNext = !lifeParams.randomSetupOnNext;
      UI.percentAliveSlider.disabled = !UI.percentAliveSlider;
   }

   // Change percent of cells alive on next world rebuild
   UI.percentAliveSlider.oninput = function() {
      let percentValue = this.value / 100;
      lifeParams.percentAlive = percentValue;
      UI.percentAliveDisplay.innerHTML = `Current: ${this.value}%`;
   }

   // Rebuild the world with the new specifications
   UI.rebuildWorldButton.onclick = function(e) {
      resetWorld();
      if (lifeParams.randomSetupOnNext == true) { lifeWorld.randomSetup();}
      drawBackground();
      drawWorld();
   }
}

function canvasClicked(e){
   let rect = e.target.getBoundingClientRect();
   let offset = 1;
   switch (lifeParams.cellSize) {
      case 10:
         offset = 1;
         break;
      case 20:
         offset = 0;
         break;
   }
   // let sub = txmLIB.firstDigit(lifeParams.cellSize);
   console.log(`clientRectX: ${e.clientX}, rectX = ${rect.x}`)
   let mouseX = Math.round((e.clientX - rect.x) / lifeParams.cellSize) - 1;
   let mouseY = Math.round((e.clientY - rect.y) / lifeParams.cellSize) - 1;
   console.log(`mouseX: ${mouseX}, mouseY: ${mouseY}`);
   console.log(UI.shapeSelector.value);
   switch (UI.shapeSelector.value) {
      case "gun":
         createGlider(mouseX, mouseY);
         break;
      default:
         drawNewCell(mouseX, mouseY, 1)
         break;

   }
   // console.log(mouseX,mouseY);
}

function drawNewCell(x, y, cellStatus) {
   if (lifeWorld.getCell(x, y) == 1) {
      console.log("Cell occupied");
      lifeWorld.changeCell(x, y, 0);
      drawCell(x,y,lifeParams.cellSize, 0);
   } else {
      lifeWorld.changeCell(x, y, cellStatus);
      drawCell(x, y, lifeParams.cellSize, 2);
   }

}
function createGlider(mouseX, mouseY) {
   // TODO: Create shapes array to hold shape data?
   drawNewCell(mouseX - 1, mouseY - 1, 1);
   drawNewCell(mouseX, mouseY - 1, 1);
   drawNewCell(mouseX + 1, mouseY - 1, 1);
   drawNewCell(mouseX - 1, mouseY, 1);
   drawNewCell(mouseX, mouseY + 1, 1);
}


function resetWorld() {
   txmLIB.clearCanvas(ctx, windowParams);
   switch(UI.gridSizeSelector.value) {
      case "small":
         lifeParams.numRows = 80;
         lifeParams.numCols = 60;
         lifeParams.cellSize = 10;
         break;
      case "large":
         lifeParams.numRows = 40;
         lifeParams.numCols = 30;
         lifeParams.cellSize = 20;
         break;
   }
   lifeWorld = new Lifeworld(lifeParams.numRows,lifeParams.numCols,lifeParams.percentAlive);
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
	/// TODO: implement states
   /// Alive: 0 = dead, 1 = alive, 2 = newly created, 3 = dying

   switch (alive) {
      case 0:
         ctx.beginPath();
         ctx.rect(col*dimensions, row*dimensions, dimensions, dimensions);
         ctx.fillStyle = "black";
         ctx.fill();

         break;
      case 1:
         ctx.beginPath();
         let img = document.querySelector("#emoji");
         ctx.drawImage(img, col*dimensions, row*dimensions);
         ctx.fill();
         break;
      case 2:
         ctx.beginPath();
         ctx.rect(col*dimensions, row*dimensions, dimensions, dimensions);
         ctx.fillStyle = "red";
         ctx.fill();
         break;
      default:
         break;
   }

   // ctx.rect(col*dimensions, row*dimensions, dimensions, dimensions);
   // ctx.fillStyle = alive ? "red" : "rgba(0,0,0,0)";
}
})();
