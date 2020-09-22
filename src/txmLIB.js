// Library of helper functions for use in IGME-330

"use strict";

(function (){
   let txmLIB = {
      createCity(ctx, citySize){
         switch (citySize) {
            case "large":
               break;
         }
      },

      doExport(canvas) {
         const data = canvas.toDataURL();
         const newWindow = window.open();
         newWindow.document.write('<iframe src="' + data  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
      },

      clearCanvas(ctx, windowParams) {
         ctx.clearRect(0,0,windowParams.canvasWidth,windowParams.canvasHeight);
      },

      // firstDigit(inNumber) {
      //    let num = inNumber;
      //    while (num >= 10)
      //       num /= 10;
      //    return num;
      // },



   };

   if(window) {
      window['txmLIB'] = txmLIB;
   } else {
      throw "'window' is not defined";
   }

})();
