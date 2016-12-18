//Create by Marvyn Hsu 2016/12/07

var grobjects = grobjects || [];

var buildings = undefined;

(function(){
   "use strict";
   
   var shaderProgram = undefined;
   var buffers = undefined;

   // only need to control the size to accomplish all the different size of buildings
   buildings = function buildings(name, position = [ 0.0, 0.0, 0.0], size=[ 1.0, 1.0, 1.0], color = [ 1.0, 1.0, 1.0]){
      this.name = name;
      this.position = position;
      this.size = size;
      this.color = color;
   }

   buildings.prototype.init = function(drawingState){
      var gl = drawingState.gl;
      
      if(!shaderProgram){
         shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
      }
      if(!buffers){
         var arrays = {
            vpos : { numComponents: 3, data: [
               -.5,0.0,-.5,  .5,0.0,-.5,  .5,1.0,-.5,        -.5,0.0,-.5,  .5,1.0,-.5, -.5,1.0,-.5,    // z = 0
               -.5,0.0, .5,  .5,0.0, .5,  .5,1.0, .5,        -.5,0.0, .5,  .5,1.0, .5, -.5,1.0, .5,    // z = 1
               -.5,0.0,-.5,  .5,0.0,-.5,  .5,0.0, .5,        -.5,0.0,-.5,  .5,0.0, .5, -.5,0.0, .5,    // y = 0
               -.5,1.0,-.5,  .5,1.0,-.5,  .5,1.0, .5,        -.5,1.0,-.5,  .5,1.0, .5, -.5,1.0, .5,    // y = 1
               -.5,0.0,-.5, -.5,1.0,-.5, -.5,1.0, .5,        -.5,0.0,-.5, -.5,1.0, .5, -.5,0.0, .5,    // x = 0
               .5,0.0,-.5,  .5,1.0,-.5,  .5,1.0, .5,         .5,0.0,-.5,  .5,1.0, .5,  .5,0.0, .5     // x = 1
                  ] },
            vnormal : {numComponents:3, data: [
               0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
               0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
               0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
               0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
               -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
               1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
               ]}
         };
         buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
      }
   };

   buildings.prototype.draw = function(drawingState){
      var modelM = twgl.m4.scaling(this.size);
      twgl.m4.setTranslation(modelM, this.position, modelM);
      
      var gl = drawingState.gl;
      gl.useProgram(shaderProgram.program);
      twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);
      twgl.setUniforms(shaderProgram, {view: drawingState.view, proj: drawingState.proj, lightdir: drawingState.sunDirection, cubecolor: this.color, model: modelM, tod: drawingState.timeOfDay});
      twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
   
   };

   buildings.prototype.center = function(drawingState){
      return this.position;
   };

   
})();


function setupbuildings(d, bnum, centergrid){
   // generate a lot of buildings
   // d = deep: the ground level of the building
   // bnum = building numbers extending in one direction
   // centergrid: the center of the building
   var low = d - 20.0;         // the lowest building
   var high = d;           // the highest building
   var minW = 5.0;         // the min of width
   var maxW = 6.0;         // the max of width
   
   var sidenum = 2 * bnum + 1;
   // create the 2D array
   var heightmap = [];
   for ( i = 0; i < sidenum; ++i){
      heightmap[i] = [];
      for (j = 0 ; j < sidenum ; ++j)
         heightmap[j] = [];
   }

   var name;
   var position;
   var height;
   var width;

   for ( i = -bnum ; i <= bnum; i += 1)
      for( j = -bnum ; j <= bnum ; j += 1){
         name = "building-" + i.toString() + "-" + j.toString();
         position = [centergrid * i, -d, centergrid * j];
         if ( i == 0 && j == 0){
            // the Center building!!
            height = d;
            width = 6.0;
         }
         else if(i == -1 && j == -1){ // put the sinbuilding
            // just give a value to keep safe
            heightmap[i+bnum][j+bnum] = [centergrid * i, 0, centergrid * j];
            continue;
         }
         else{
            height = low + Math.random() * (high-low);
            width = minW + Math.random() * (maxW - minW);
         }
         grobjects.push(new buildings(name, position, [width, height, width]));
         heightmap[i+bnum][j+bnum] = [centergrid * i, height - d, centergrid * j];
      }
   return heightmap;

}

