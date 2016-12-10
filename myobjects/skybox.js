// create by Marvyn Hsu
// 2016/12/10
// Create Skybox
// set the normal vector of corner to be outside, use diffusion to create a fake model of sky ball

var grobjects = grobjects || [];
var skyboxplane;

function skyboxArray(side){
   var normalarr = [];
   var posarr = [];
   var texarr = [];
   var pv = [
      [0.5, 0.5, 0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5],
      [0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5]
      ];
   var nv = [
      normalize([1, 1, 1]),   normalize([1, 1, -1]), normalize([-1, 1, -1]), normalize([-1, 1, 1]),
      normalize([1, -1, 1]),   normalize([1, -1, -1]), normalize([-1, -1, -1]), normalize([-1, -1, 1]),
      ];
   var n = [];
   if(side == 'front')
      n = [4, 7, 0, 7, 3, 0];
   else if(side == 'back')
      n = [6, 5, 2, 5, 1, 2];
   else if(side == 'left')
      n = [5, 4, 1, 4, 0, 1];
   else if(side == 'right')
      n = [7, 6, 3, 6, 2, 3];
   else if(side == 'top')
      n = [0, 3, 1, 3, 2, 1];
   else if(side == 'bottom')
      n = [5, 6, 4, 6, 7, 4];
   for(var i = 0 ; i < 6; i += 1 ){
      posarr = posarr.concat(pv[n[i]]);
      normalarr = normalarr.concat(nv[n[i]]);
   }
   texarr = [
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      1.0, 0.0, 1.0, 1.0, 0.0, 1.0
          ];
   var arrays = {
      vpos: {numComponents: 3, data: posarr},
      vnormal: {numComponents: 3, data: normalarr},
      vtexture: {numComponents: 2, data: texarr}
   };
   return arrays;
}


(function() {
   // Textured Plane
   "use strict";

   skyboxplane = function (name = null, side = null, scale = [1.0, 1.0, 1.0], imagesrc = null) {
      this.name = name || "Coffeeshop";
      this.side = side;
      this.position = new Float32Array([0, 0, 0]);
      this.scale = new Float32Array(scale);
      this.program = null;
      this.array = null;
      this.attributes = null;
      this.uniforms = null;
      this.buffers = [null, null, null];
      this.texture = null;
      this.image = null;
      this.imagesrc = imagesrc;
      this.triangleverticesnum = 6;
   }

   skyboxplane.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
        var vertexSource = document.getElementById("skybox-vs").text;
        var fragmentSource = document.getElementById("skybox-fs").text;

        this.program = createGLProgram(gl, vertexSource, fragmentSource);
        this.attributes = findAttribLocations(gl, this.program, ["vPosition", "vNormal", "aTexCoord"]);
        this.uniforms = findUniformLocations(gl, this.program, ["pMatrix", "vMatrix", "mMatrix", "normalMatrix", "uTexture", "lightdir", "tod"]);

        if(this.imagesrc != null){
           this.image = new Image();
           this.image.crossOrigin = 'anonymous';
           this.image.src = this.imagesrc;

           this.texture = createGLTexture(gl, this.image, true);
        }
        this.array = skyboxArray(this.side);

        this.buffers[0] = createGLBuffer(gl, new Float32Array(this.array.vpos.data), gl.STATIC_DRAW);
        this.buffers[1] = createGLBuffer(gl, new Float32Array(this.array.vnormal.data), gl.STATIC_DRAW);
        this.buffers[2] = createGLBuffer(gl, new Float32Array(this.array.vtexture.data), gl.STATIC_DRAW);


     }

    skyboxplane.prototype.center = function () {
        return this.position;
    }

    skyboxplane.prototype.draw = function (drawingState) {
        var gl = drawingState.gl;

        gl.useProgram(this.program);
        gl.disable(gl.CULL_FACE);

        var modelM = twgl.m4.scaling([this.scale[0],this.scale[1], this.scale[2]]);
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


(function(){
   // skybox
   var imagesource1 = [
      "https://farm1.staticflickr.com/760/31418204382_06ddf018c5_b.jpg", //front
      "https://farm1.staticflickr.com/13/31418204242_8c954e2cce_b.jpg", //back 
      "https://farm1.staticflickr.com/60/31418204182_cc617a3237_b.jpg", //right
      "https://farm1.staticflickr.com/264/31418204312_fb41f1d023_b.jpg", //left
      "https://farm1.staticflickr.com/452/31418204012_0486818261_b.jpg", //top
      "https://farm1.staticflickr.com/752/31564638055_5cb2a94d92_b.jpg" //bottom
   ];
   var imagesource2 = [
      "https://farm6.staticflickr.com/5610/31191909440_eeb26b9843_b.jpg", //front
      "https://farm1.staticflickr.com/446/31191908640_e3ebcb517a_b.jpg", //back
      "https://farm1.staticflickr.com/662/31526330496_2792e82a2a_b.jpg", //right
      "https://farm1.staticflickr.com/622/31191909990_958e602d13_b.jpg", //left
      "https://farm1.staticflickr.com/754/31526330076_131919d7cb_b.jpg", //top
      "https://farm1.staticflickr.com/16/31191910090_d0507ee130_b.jpg"  //bottom
   ];
   var imagesource = imagesource1;
   var sc = 100000;
   var scale = [sc, sc, sc];
   var skyboxfront = new skyboxplane("skyboxfront", 'front', scale, imagesource[0]);
   var skyboxback = new skyboxplane("skyboxback", 'back', scale, imagesource[1]);
   var skyboxright = new skyboxplane("skyboxright", 'right', scale, imagesource[2]);
   var skyboxleft = new skyboxplane("skyboxleft", 'left', scale, imagesource[3]);
   var skyboxtop = new skyboxplane("skyboxtop", 'top', scale, imagesource[4]);
   var skyboxbottom = new skyboxplane("skyboxbottom", 'bottom', scale, imagesource[5]);
   
   grobjects.push(skyboxfront);
   grobjects.push(skyboxback);
   grobjects.push(skyboxright);
   grobjects.push(skyboxleft);
   grobjects.push(skyboxtop);
   grobjects.push(skyboxbottom);

})();
