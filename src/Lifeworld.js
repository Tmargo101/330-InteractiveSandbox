class Lifeworld {

   constructor(numCols = 60, numRows = 40, percentAlive = 0.1) {
      this.numCols = numCols;
      this.numRows = numRows;
      this.percentAlive = percentAlive;
      this.world = this.buildArray();
      this.newWorld = this.buildArray();
      // this.randomSetup();
      //console.table(this.world);
   }

   buildArray() {
      let grid = [];
      for (let col = 0; col < this.numCols; col++) {
         let newColumn = new Array(this.numRows).fill(0);
         grid.push(newColumn);
      }
      return grid;
   }

   randomSetup() {
      for (let col = 0; col < this.numCols; col++) {
         for(let row = 0; row < this.numRows; row++) {
               this.world[col][row] = Math.random() < this.percentAlive ? 1 : 0;
         }
      }
   }

   getLivingNeighbors(x,y) {
      let thisWorld = this.world;
      if (x > 0 && y > 0 && x < this.numCols - 1 && y < this.numRows - 1) {
         let totalAlive =
            // Check the top row
            thisWorld[x - 1][y - 1] +
            thisWorld[x][y - 1] +
            thisWorld[x + 1][y - 1] +

            // Check to the left and right, but not ourselves
            thisWorld[x - 1][y] +
            thisWorld[x + 1][y] +

            // Check the bottom row
            thisWorld[x - 1][y + 1] +
            thisWorld[x][y + 1] +
            thisWorld[x + 1][y + 1];
            return totalAlive;
      } else {
         return 0;
      }
   }

   step() {
      for (let x = 0; x < this.numCols; x++) {
         for (let y = 0; y < this.numRows; y++) {
            let alives = this.getLivingNeighbors(x,y);
            let cell = this.world[x][y];

            // By default, kill the cell
            this.newWorld[x][y] = 0;

            // Determine if the cell gets to live
            if (cell == 1) {
               if (alives == 2 || alives == 3) {
                  this.newWorld[x][y] = 1;
               }
            } else if (cell == 0 && alives == 3) {
               this.newWorld[x][y] = 1;
            }
         }
      }

      // Now swap the newWorld array into the world Array
      let temp = this.world;
      this.world = this.newWorld;
      this.newWorld = temp;
   }

   changeCell(inX,inY, inValue) {
      this.world[inX][inY] = inValue;
   }

   getCell(inX, inY) {
      return this.world[inX][inY]
   }


}
