/**
 * Created by Marvyn on 2016/11/23
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var eight = undefined;
var Spinningeight = undefined;
function funceight(h){
   if(h > 0 && h <= 1)
      return h;
   if(h > 1 && h <= 2)
      return 2 - h;
   return 0;
}

(function() {
   "use strict";

   // i will use this function's scope for things that will be shared
   // across all cubes - they can all have the same buffers and shaders
   // note - twgl keeps track of the locations for uniforms and attributes for us!
   var shaderProgram = undefined;
   var buffers = undefined;


   eight = function eight(name, position, size, color) {
      this.name = name;
      this.position = position || [0,0,0];
      this.size = size || 1.0;
      this.color = color || [.7,.8,.9];
   }
   eight.prototype.init = function(drawingState) {
      var gl=drawingState.gl;
      // create the shaders once - for all cubes
      if (!shaderProgram) {// TODO modify shader
         shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
      }
      if (!buffers) {
         /*
         var numcir = 12;
         var func = func1;
         var high = 2;
         */
         var numcir = 4;
         var func = funceight;
         var high = 2;
         var cut = 2;
         
         var arrays = computearrays(numcir, func, high, cut);
         buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
      }

   };
   eight.prototype.draw = function(drawingState) {
      // we make a model matrix to place the cube in the world
      var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
      twgl.m4.setTranslation(modelM,this.position,modelM);
      // the drawing coce is straightforward - since twgl deals with the GL stuff for us
      var gl = drawingState.gl;
      gl.useProgram(shaderProgram.program);
      twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
      twgl.setUniforms(shaderProgram,{
         view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
         cubecolor:this.color, model: modelM });
      twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
   };
   eight.prototype.center = function(drawingState) {
      return this.position;
   }


   /////////
   // constructor for eights
   Spinningeight = function Spinningeight(name, position, size, color, axis) {
      eight.apply(this,arguments);
      this.axis = axis || 'X';
   }
   Spinningeight.prototype = Object.create(eight.prototype);
   Spinningeight.prototype.draw = function(drawingState) {
      // we make a model matrix to place the cube in the world
      var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
      var theta = Number(drawingState.realtime)/200.0;
      if (this.axis == 'X') {
         twgl.m4.rotateX(modelM, theta, modelM);
      } else if (this.axis == 'Z') {
         twgl.m4.rotateZ(modelM, theta, modelM);
      } else {
         twgl.m4.rotateY(modelM, theta, modelM);
      }
      twgl.m4.setTranslation(modelM,this.position,modelM);
      // the drawing coce is straightforward - since twgl deals with the GL stuff for us
      var gl = drawingState.gl;
      gl.useProgram(shaderProgram.program);
      twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
      twgl.setUniforms(shaderProgram,{
         view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
         cubecolor:this.color, model: modelM });
      twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
   };
   Spinningeight.prototype.center = function(drawingState) {
      return this.position;
   }


})();

//grobjects.push(new eight("eight1",[4, 0, 4],1, [1, 1, 0]) );
//grobjects.push(new eight("eight2",[-4, 0, 4], 0.8, [0.5, 1, 1]) );

//grobjects.push(new Spinningeight("scube 1",[0.5, 0, -3],1,[0.2, 0.9, 0.3], 'Y'));
   
