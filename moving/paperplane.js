
/**
 * Created by Marvyn on 2016/11/23
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var paperplane = undefined;
//var SpinningCube = undefined;

function drawplane(){
   var vposition = [
      [-23, 0, 20], [-22, 0, 0],
      [-3, 0, 20], [0, 0, -40],
      [-3, 0, 20], [0, 0, -40], [0, -20, 15], 
      [3, 0, 20], [0, -20, 15], [0, 0, -40], 
      [3, 0, 20], [23, 0, 20], [22, 0, 0]
      ];
   var nup = [0, 1, 0];
   var n1 = findnormal(vposition[4], vposition[5], vposition[6]);
   var n2 = findnormal(vposition[7], vposition[8], vposition[9]);
   var vnormal = [
      nup, nup,
      nup, nup,
      n1, n1, n1,
      n2, n2, n2,
      nup, nup, nup 
      ];
   var index = [
      0, 1, 2, 1, 2, 3,
      4, 5, 6, 7, 8, 9,
      10, 11, 12, 10, 12, 3
      ];
   var posarr = [];
   var normalarr = [];
   for(var i = 0 ; i < index.length ; ++i){
      posarr = posarr.concat(vposition[index[i]]);
      normalarr = normalarr.concat(vnormal[index[i]]);
   }
   var array = {
      vpos: {numComponents: 3, data: posarr},
      vnormal: {numComponents: 3, data: normalarr}
   };
   return array;
}

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
   "use strict";

   var shaderProgram = undefined;
   var buffers = undefined;
   paperplane = function paperplane(name, size, color, position, pathheight, h, radius, speed) {
      this.name = name;
      this.position = position || [0,0,0];
      this.pathheight = pathheight;
      this.h = h;
      this.radius = radius;
      this.speed = speed;
      this.size = size || 1.0;
      this.color = color || [.7,.8,.9];
      this.spiralpath = new spiralpath(this.position, this.pathheight, this.h, this.radius, this.speed);
   }
   paperplane.prototype.init = function(drawingState) {
      var gl=drawingState.gl;
      if (!shaderProgram) {
         shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
      }
      if (!buffers) {
         var arrays = drawplane();
         buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
      }

   };
   paperplane.prototype.draw = function(drawingState) {
      var Tmodel_size = twgl.m4.scaling([this.size,this.size,this.size]);
      var info = this.spiralpath.accessinfo(drawingState.realtime / 1000);
      var Tmodel_trans = twgl.m4.translation(info.position);
      var Tmodel_rot = twgl.m4.lookAt([0, 0, 0], info.tangent, [0, 1, 0]);
      var modelM = twgl.m4.multiply(twgl.m4.multiply(Tmodel_size, Tmodel_rot), Tmodel_trans);
      

      // the drawing coce is straightforward - since twgl deals with the GL stuff for us
      var gl = drawingState.gl;
      gl.useProgram(shaderProgram.program);
      twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
      twgl.setUniforms(shaderProgram,{
         view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
         cubecolor:this.color, model: modelM, tod: drawingState.timeOfDay });
      twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
   };
   paperplane.prototype.center = function(drawingState) {
      return this.position;
   }

})();


function randomcolor(){
   var r = Math.random();
   var g = Math.random();
   var b = Math.random();
   return [r, g, b];
}

function drawingpaperplanes(deep, sidenum, positionmap){
   var name;
   var size;
   var color;
   var position;
   var pathheight;
   var h;
   var radius;
   var speed;

   // help var
   var buildingheight;
   var startheight;
   for(var i = 0 ; i < sidenum ; ++i ){
      for (var j = 0 ; j < sidenum ; ++j){
         name = 'paperplane-'+i.toString()+'-'+j.toString();
         buildingheight = positionmap[i][j][1] + deep;
         var startheight = -deep + Math.random() * 0.8 * deep;
         position = [positionmap[i][j][0], startheight, positionmap[i][j][2]];
         size = 0.01 + Math.random() * 0.05;
         color = randomcolor();
         pathheight = buildingheight + Math.random() * 15.0;
         h = 0.8 + Math.random() * 1.0;
         radius = 4.5 + Math.random() * 1.5;
         speed = 0.2 + Math.random() * 1.0;
         grobjects.push(new paperplane(name, size, color, position, pathheight, h, radius, speed));
      }
   }
}
