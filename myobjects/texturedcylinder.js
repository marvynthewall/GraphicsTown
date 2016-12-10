/**
 * Created by Yusef.
 */

/**
 A Very Simple Textured Plane using native WebGL. 

 Notice that it is possible to only use twgl for math. 

 Also, due to security restrictions the image was encoded as a Base64 string. 
 It is very simple to use somthing like this (http://dataurl.net/#dataurlmaker) to create one
 then its as simple as 
     var image = new Image()
     image.src = <base64string>


 **/

var grobjects = grobjects || [];
var TexturedCylinder;



function texturecylinderarrays(n, f, high, cut){ 
   // n = vertex in a circle
   // f = function of radius to height
   var step = high/cut;
   var posarr = [];
   var normalarr = [];
   var texturearr = [];

   // create side triangles: 2n triangles per layer
   var prering = [];
   var nowring = [];
   var prer = 0;
   var r = 0;
   var theta = 0;
   var newv = [];
   var normal = 0;
   var s = 1;
   for(var h = 0 ; h <= high; h += step){
      prering = nowring;
      prer = r;
      r = f(h);
      nowring = [];
      for(var i = 0 ; i < n ; i += 1){
         theta = 2 * Math.PI * i / n;
         newv = [r * Math.sin(theta), h, r * Math.cos(theta)];
         nowring.push(newv);
      }
      if(h == 0) continue;
      
      // compute y of normal vector of this layer;
      // too complicated
      // TODO this is for compute the normal vector of curve function of radius
      // normaly = (prer - r) / step;

      for(var i = 0 ; i < n ; i += 1){
         var j = i+1;
         if(j == n) j = 0;
         // the first triangle
         posarr = posarr.concat(prering[i]);
         posarr = posarr.concat(prering[j]);
         posarr = posarr.concat(nowring[i]);
         // the second triangle
         posarr = posarr.concat(prering[j]);
         posarr = posarr.concat(nowring[j]);
         posarr = posarr.concat(nowring[i]);
         
         // theta = 2 * Math.PI * i / n;
         // TODO conpute the circle outward normal
         // here only do the simpliest
         normal = findnormal(prering[i], prering[j], nowring[i]);
         normalarr = normalarr.concat(normal);
         normalarr = normalarr.concat(normal);
         normalarr = normalarr.concat(normal);
         normal = findnormal(prering[j], nowring[j], nowring[i]);
         normalarr = normalarr.concat(normal);
         normalarr = normalarr.concat(normal);
         normalarr = normalarr.concat(normal);

         // texture 
         // first triangle
         texturearr = texturearr.concat([    i/n   , (s-1)/cut]);
         texturearr = texturearr.concat([(i+1)/n   , (s-1)/cut]);
         texturearr = texturearr.concat([    i/n   ,     s/cut]);
         // second triangle
         texturearr = texturearr.concat([(i+1)/n   , (s-1)/cut]);
         texturearr = texturearr.concat([(i+1)/n   ,     s/cut]);
         texturearr = texturearr.concat([    i/n   ,     s/cut]);
      }
      s += 1;
   }
   // create bottom triangles: n-2 trangles
   r = f(0);
   firstv = [0, 0, r];
   prev = [];
   nowv = [];
   normal = [0, -1, 0];
   for(var i = 1 ; i < n ; i += 1){
      prev = nowv;
      theta = 2*Math.PI * i / n;
      nowv = [r * Math.sin(theta), 0, r * Math.cos(theta)];
      if(i == 1)continue;
      posarr = posarr.concat(firstv);
      posarr = posarr.concat(prev);
      posarr = posarr.concat(nowv);
      normalarr = normalarr.concat(normal);
      normalarr = normalarr.concat(normal);
      normalarr = normalarr.concat(normal);
      texturearr = texturearr.concat([0.0, 0.0]);
      texturearr = texturearr.concat([0.0, 0.0]);
      texturearr = texturearr.concat([0.0, 0.0]);
   }
   // create top triangles: n-2 trangles
   r = f(high);
   firstv = [0, high, r];
   prev = [];
   nowv = [];
   normal = [0, 1, 0];
   for(var i = 1 ; i < n ; i += 1){
      prev = nowv;
      theta = 2*Math.PI * i / n;
      nowv = [r * Math.sin(theta), high, r * Math.cos(theta)];
      if(i == 1)continue;
      posarr = posarr.concat(firstv);
      posarr = posarr.concat(prev);
      posarr = posarr.concat(nowv);
      normalarr = normalarr.concat(normal);
      normalarr = normalarr.concat(normal);
      normalarr = normalarr.concat(normal);
      texturearr = texturearr.concat([1.0, 1.0]);
      texturearr = texturearr.concat([1.0, 1.0]);
      texturearr = texturearr.concat([1.0, 1.0]);
   }
   // in total 2 * (n-2) + 2n * 10 triangles
   var arrays = {
      vpos: {numComponents: 3, data: posarr},
      vnormal: {numComponents: 3, data: normalarr},
      vtexture: {numComponents: 2, data: texturearr}
   };
   return arrays;
}

(function() {
    // Textured Cylinder
    "use strict";

    TexturedCylinder = function (name = null, func = null, imagesrc = null, side = null, cut = null, height = null, theta = 0, spin = 0) {
       this.name = name || "TexturedCylinder";
       this.position = new Float32Array([0, 0, 0]);
       this.scale = new Float32Array([1, 1, 1]);
       this.theta = theta;
       this.program = null;
       this.array = null;
       this.attributes = null;
       this.uniforms = null;
       this.buffers = [null, null, null];
       this.texture = null;
       this.func = func;
       this.side = side;
       this.cut = cut;
       this.height = height;
       this.triangleverticesnum = this.vertexnum(side);
       this.image = null;
       this.imagesources = imagesrc;
       this.spin = spin;
    }
    TexturedCylinder.prototype.vertexnum = function(n){
       var num = 2 * n * this.cut;
       num = num + 2 * (n-2);
       num = num * 3;
       return num;
    }

    TexturedCylinder.prototype.init = function (drawingState) {
       var gl = drawingState.gl;
       var vertexSource = document.getElementById("texturecylinder-vs").text;
       var fragmentSource = document.getElementById("texturecylinder-fs").text;

       this.program = createGLProgram(gl, vertexSource, fragmentSource);
       this.attributes = findAttribLocations(gl, this.program, ["vPosition", "vNormal", "aTexCoord"]);
       this.uniforms = findUniformLocations(gl, this.program, ["pMatrix", "vMatrix", "mMatrix", "normalMatrix", "uTexture", "lightdir", "tod"]);

       this.image = new Image();
       this.image.crossOrigin = 'anonymous';
       this.image.src = this.imagesources;

       this.texture = createGLTexture(gl, this.image, true);

       this.array = texturecylinderarrays(this.side, this.func, this.height, this.cut );

       this.buffers[0] = createGLBuffer(gl, new Float32Array(this.array.vpos.data), gl.STATIC_DRAW);
       this.buffers[1] = createGLBuffer(gl, new Float32Array(this.array.vnormal.data), gl.STATIC_DRAW);
       this.buffers[2] = createGLBuffer(gl, new Float32Array(this.array.vtexture.data), gl.STATIC_DRAW);


    }

    TexturedCylinder.prototype.center = function () {
       return this.position;
    }

    TexturedCylinder.prototype.draw = function (drawingState) {
       var gl = drawingState.gl;

       gl.useProgram(this.program);
       gl.disable(gl.CULL_FACE);


       var modelM = twgl.m4.scaling([this.scale[0],this.scale[1], this.scale[2]]);
       twgl.m4.rotateY(modelM, this.theta, modelM);
       if(this.spin == 1){
         var theta = Number(drawingState.realtime)/200.0;
         twgl.m4.rotateY(modelM, theta, modelM);
       }
       twgl.m4.setTranslation(modelM,this.position, modelM);
       //var modelview = twgl.m4.multiply(modelM, drawingState.view);
       var normalMatrix = twgl.m4.inverse(twgl.m4.transpose(modelM));

       gl.uniformMatrix4fv(this.uniforms.pMatrix, gl.FALSE, drawingState.proj);
       gl.uniformMatrix4fv(this.uniforms.vMatrix, gl.FALSE, drawingState.view);
       gl.uniformMatrix4fv(this.uniforms.mMatrix, gl.FALSE, modelM);
       gl.uniformMatrix4fv(this.uniforms.normalMatrix, gl.FALSE, normalMatrix);
       gl.uniform3fv(this.uniforms.lightdir, drawingState.sunDirection);
       gl.uniform1i(this.uniforms.tod, drawingState.timeOfDay);

       gl.activeTexture(gl.TEXTURE0);
       gl.bindTexture(gl.TEXTURE_2D, this.texture);
       gl.uniform1i(this.uniforms.uTexture, 0);


       enableLocations(gl, this.attributes);

       gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[0]);
       //gl.vertexAttribPointer(this.attributes.vPosition, this.array.vpos.numComponents, gl.FLOAT, false, 0, 0);
       gl.vertexAttribPointer(this.attributes.vPosition, 3, gl.FLOAT, false, 0, 0);

       gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[1]);
       //gl.vertexAttribPointer(this.attributes.vNormal, this.array.vnormal.numComponents, gl.FLOAT, false, 0, 0);
       gl.vertexAttribPointer(this.attributes.vNormal, 3, gl.FLOAT, false, 0, 0);

       gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[2]);
       //gl.vertexAttribPointer(this.attributes.aTexCoord, this.array.vtexture.numComponents, gl.FLOAT, false, 0, 0);
       gl.vertexAttribPointer(this.attributes.aTexCoord, 2, gl.FLOAT, false, 0, 0);


       gl.drawArrays(gl.TRIANGLES, 0, this.triangleverticesnum);

       disableLocations(gl, this.attributes);
    }


})();
