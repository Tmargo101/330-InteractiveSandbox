// Library of helper functions for use in IGME-330

"use strict";

(function (){
   let txmLIB = {

      doExport(canvas) {
         const data = canvas.toDataURL();
         const newWindow = window.open();
         newWindow.document.write('<iframe src="' + data  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
      },

      clearCanvas(ctx, windowParams) {
         ctx.clearRect(0,0,windowParams.canvasWidth,windowParams.canvasHeight);
      },

      drawCircleOnGrid(ctx, col, row, dimensions, inColor) {
         if (dimensions == 20) {
            col = col + 0.5;
            row = row + 0.5;
         } else {
            col = col + 0.85;
            row = row + 0.85;
         }
         let radius = dimensions / 2;
         ctx.save();
         ctx.beginPath();
         ctx.fillStyle = inColor;
         ctx.arc(col*dimensions, row*dimensions,radius, 0, Math.PI * 2, false)
         ctx.closePath();
         ctx.fill();
         ctx.restore();
      },

      drawSquareOnGrid(ctx, col, row, dimensions, inColor) {

         ctx.save();
         ctx.beginPath();
         ctx.fillStyle = inColor;
         ctx.rect(col*dimensions, row*dimensions, dimensions, dimensions);
         ctx.closePath();
         ctx.fill();
         ctx.restore();
      },

      drawImageOnGrid(ctx, col, row, dimensions, img) {
         ctx.drawImage(img, col*dimensions, row*dimensions);
      },

      drawGrid(ctx, lifeParams, windowParams, lifeWorld) {
            for(let row = 0; row < lifeWorld.numRows; row++) {
               ctx.save();
               ctx.beginPath();
               ctx.strokeWidth = 1;
               ctx.strokeStyle = "white";
               ctx.moveTo(0, row * lifeParams.cellSize);
               ctx.lineTo(windowParams.canvasWidth, row * lifeParams.cellSize);
               ctx.closePath();
               ctx.stroke();
               ctx.restore();
            }
            for (let col = 0; col < lifeWorld.numCols; col++) {
               ctx.save();
               ctx.beginPath();
               ctx.strokeWidth = 1;
               ctx.strokeStyle = "white";
               ctx.moveTo(col * lifeParams.cellSize, 0);
               ctx.lineTo(col * lifeParams.cellSize, windowParams.canvasHeight);
               ctx.closePath()
               ctx.stroke();
               ctx.restore();
            }
      }

   };

   if(window) {
      window['txmLIB'] = txmLIB;
   } else {
      throw "'window' is not defined";
   }

})();
