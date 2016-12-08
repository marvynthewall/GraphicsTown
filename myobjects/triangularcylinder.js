/**
 * Created by Marvyn on 2016/11/23
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var triangularcylinder = undefined;
//var SpinningCube = undefined;

function equalradius(h){
   return 0.5;
}

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
   "use strict";

   // i will use this function's scope for things that will be shared
   // across all cubes - they can all have the same buffers and shaders
   // note - twgl keeps track of the locations for uniforms and attributes for us!
   var shaderProgram = undefined;
   var buffers = undefined;


   triangularcylinder = function triangularcylinder(name, position, size, color) {
      this.name = name;
      this.position = position || [0,0,0];
      this.size = size || 1.0;
      this.color = color || [.7,.8,.9];
   }
   triangularcylinder.prototype.init = function(drawingState) {
      var gl=drawingState.gl;
      // create the shaders once - for all cubes
      if (!shaderProgram) {// TODO modify shader
         shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
      }
      if (!buffers) {
         var numcir = 3;
         var func = equalradius;
         var high = 2;
         var cut = 1;
         
         var arrays = computearrays(numcir, func, high, cut);
         buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
      }

   };
   triangularcylinder.prototype.draw = function(drawingState) {
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
   triangularcylinder.prototype.center = function(drawingState) {
      return this.position;
   }

})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
//grobjects.push(new triangularcylinder("cylinder1",[-2, 0, 0],1) );
//grobjects.push(new triangularcylinder("cylinder2",[-2, 0, -3],2) );
