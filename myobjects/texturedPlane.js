// create by Marvyn Hsu
// 2016/12/09
// Textured Plane, to create cube like texture plane
// Can decide the basic six direction 
// Other direction can be achieved by transform matrix

var TexturedPlane;

function cubePlaneArray(side, tc){
   var normalarr = [];
   var posarr = [];
   var texarr = [];
   if(side == 'front'){
      posarr = [ 
         -.5, 0.0, 0.5,    0.5, 0.0, 0.5,    -.5, 1.0, 0.5,
         0.5, 0.0, 0.5,    0.5, 1.0, 0.5,    -.5, 1.0, 0.5
      ];
      for( var i = 0; i < 6; i += 1)
         normalarr = normalarr.concat([0.0, 0.0, 1.0]);
   }
   else if(side == 'back'){
      posarr = [
         0.5, 0.0, -.5,    -.5, 0.0, -.5,    0.5, 1.0, -.5,
         -.5, 0.0, -.5,    -.5, 1.0, -.5,    0.5, 1.0, -.5
      ];
      for (var i = 0 ; i < 6; i += 1)
         normalarr = normalarr.concat([0.0, 0.0, -1.0]);
   }
   else if(side == 'left'){
      posarr = [
         0.5, 0.0, 0.5,    0.5, 0.0, -.5,    0.5, 1.0, 0.5,
         0.5, 0.0, -.5,    0.5, 1.0, -.5,    0.5, 1.0, 0.5
      ];
      for (var i = 0 ; i < 6; i += 1)
         normalarr = normalarr.concat([1.0, 0.0, 0.0]);
   }
   else if(side == 'right'){
      posarr = [
         -.5, 0.0, -.5,    -.5, 0.0, 0.5,    -.5, 1.0, -.5,
         -.5, 0.0, 0.5,    -.5, 1.0, 0.5,    -.5, 1.0, -.5
      ];
      for (var i = 0 ; i < 6; i += 1)
         normalarr = normalarr.concat([-1.0, 0.0, 0.0]);
   }
   else if(side == 'top'){
      posarr = [
         0.5, 1.0, 0.5,    0.5, 1.0, -.5,    -.5, 1.0, 0.5,
         0.5, 1.0, -.5,    -.5, 1.0, -.5,    -.5, 1.0, 0.5
      ];
      for (var i = 0 ; i < 6; i += 1)
         normalarr = normalarr.concat([0.0, 1.0, 0.0]);
   }
   else if(side == 'bottom'){
      posarr = [
         0.5, 0.0, 0.5,    -.5, 0.0, 0.5,    0.5, 0.0, -.5,
         -.5, 0.0, 0.5,    -.5, 0.0, -.5,    0.5, 0.0, -.5
      ];
      for (var i = 0 ; i < 6; i += 1)
         normalarr = normalarr.concat([1.0, 0.0, 0.0]);
   }
   texarr = [
      tc[0], tc[1], tc[2], tc[1], tc[0], tc[3],
      tc[2], tc[1], tc[2], tc[3], tc[0], tc[3]
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

     TexturedPlane = function (name = null, side = null, scale = [1.0, 1.0, 1.0], imagesrc = null, texcoord = null) {
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
        this.texcoord = texcoord;
        this.triangleverticesnum = 6;
     }

     TexturedPlane.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
        var vertexSource = document.getElementById("texturecylinder-vs").text;
        var fragmentSource = document.getElementById("texturecylinder-fs").text;

        this.program = createGLProgram(gl, vertexSource, fragmentSource);
        this.attributes = findAttribLocations(gl, this.program, ["vPosition", "vNormal", "aTexCoord"]);
        this.uniforms = findUniformLocations(gl, this.program, ["pMatrix", "vMatrix", "mMatrix", "normalMatrix", "uTexture", "lightdir"]);

        if(this.imagesrc != null){
           this.image = new Image();
           this.image.crossOrigin = 'anonymous';
           this.image.src = this.imagesrc;

           this.texture = createGLTexture(gl, this.image, true);
        }
        this.array = cubePlaneArray(this.side, this.texcoord);

        this.buffers[0] = createGLBuffer(gl, new Float32Array(this.array.vpos.data), gl.STATIC_DRAW);
        this.buffers[1] = createGLBuffer(gl, new Float32Array(this.array.vnormal.data), gl.STATIC_DRAW);
        this.buffers[2] = createGLBuffer(gl, new Float32Array(this.array.vtexture.data), gl.STATIC_DRAW);


     }

    TexturedPlane.prototype.center = function () {
        return this.position;
    }

    TexturedPlane.prototype.draw = function (drawingState) {
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
   /*
    var test = new TexturedCylinder("t-cylinder1", tCylinder1, imagecoffee, 30, 1, 2);
    //var test = new TexturedCylinder("t-cylinder1", 24);
        test.position = [0, 3, 0];
    var newtest = new TexturedCylinder("t-cylinder2", tCylinder2, imagecoffee, 4, 1, 1);
    newtest.position = [0, 5 ,0];

    var tCvolcano = new TexturedCylinder("tC-volcano1", tCvolcano1, imagevolcano, 15, 8, 2);
    tCvolcano.position = [3, 0, 3];
    grobjects.push(test);
    grobjects.push(newtest);
    grobjects.push(tCvolcano);
   */
})();
