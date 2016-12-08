// copy the texturedcylinder here
// and also do the textureplane case
// do three different texture on different side
// top use the four corner no top pyramid

var grobjects = grobjects || [];
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
    "use strict";
   var vertexSource = "" +
   "precision highp float;" +
   "attribute vec3 vPosition;" +
   "attribute vec3 vNormal;" +
   "attribute vec2 aTexCoord;" +
   "varying vec2 TexCoord;" +
   "varying vec3 fNormal;" +
   "// MVP matrices" +
   "uniform mat4 pMatrix;" +
   "uniform mat4 vMatrix;" +
   "uniform mat4 mMatrix;" +
   "uniform mat4 normalMatrix;" +
   "void main(void){" +
   "   fNormal = normalize( mat3(normalMatrix) * vNormal);" +
   " // pass down directly" +
   "   TexCoord = aTexCoord;" +
   "   gl_Position = pMatrix * vMatrix * mMatrix * vec4(vPosition, 1.0);" +
   "}"
   var fragmentSource = "" + 
   "precision highp float;" +
   "varying vec2 TexCoord;" +
   "uniform sampler2D Textureimage;" +
   "uniform vec3 lightdir;" +
   "varying vec3 fNormal;" +
   "" +
   "void main(void){" +
   "   // control board" +
   "   float diffuseeffect = 0.4;" +
   "   float textureeffect = 0.8;" +
   "   float speculareffect = 0.2;" +
   "" +
   "   // diffusion" +
   "   vec3 diffusecolor = vec3(1.0, 1.0, 1.0);" +
   "   vec3 diffuse = diffuseeffect * max(0.0, dot(fNormal, lightdir)) * diffusecolor;" +
   "" +
   "   // texture" +
   "   vec4 TextureColor = textureeffect * texture2D(Textureimage, TexCoord);" +
   "" +
   "   vec4 finalcolor = vec4(diffuse + TextureColor.xyz, 1.0);" +
   "   // final color" +
   "   gl_FragColor = finalcolor;" +
   "}" 

    // image source
    //var image = new Image();
    //image.crossOrigin='anonymous';
    //image.src = "https://farm6.staticflickr.com/5581/31101469160_7993ee6ab6_m.jpg";

    //useful util function to simplify shader creation. type is either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
    var createGLShader = function (gl, type, src) {
        var shader = gl.createShader(type)
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            console.log("warning: shader failed to compile!")
            console.log(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }
    //useful util function to return a glProgram from just vertex and fragment shader source.
    var createGLProgram = function (gl, vSrc, fSrc) {
        var program = gl.createProgram();
        var vShader = createGLShader(gl, gl.VERTEX_SHADER, vSrc);
        var fShader = createGLShader(gl, gl.FRAGMENT_SHADER, fSrc);
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
            console.log("warning: program failed to link");
            return null;

        }
        return program;
    }

    //creates a gl buffer and unbinds it when done. 
    var createGLBuffer = function (gl, data, usage) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return buffer;
    }

    var findAttribLocations = function (gl, program, attributes) {
        var out = {};
        for(var i = 0; i < attributes.length;i++){
            var attrib = attributes[i];
            out[attrib] = gl.getAttribLocation(program, attrib);
        }
        return out;
    }

    var findUniformLocations = function (gl, program, uniforms) {
        var out = {};
        for(var i = 0; i < uniforms.length;i++){
            var uniform = uniforms[i];
            out[uniform] = gl.getUniformLocation(program, uniform);
        }
        return out;
    }

    var enableLocations = function (gl, attributes) {
        for(var key in attributes){
            var location = attributes[key];
            gl.enableVertexAttribArray(location);
        }
    }

    //always a good idea to clean up your attrib location bindings when done. You wont regret it later. 
    var disableLocations = function (gl, attributes) {
        for(var key in attributes){
            var location = attributes[key];
            gl.disableVertexAttribArray(location);
        }
    }

    //creates a gl texture from an image object. Sometiems the image is upside down so flipY is passed to optionally flip the data.
    //it's mostly going to be a try it once, flip if you need to. 
    var createGLTexture = function (gl, image, flipY) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        if(flipY){
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        }
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
   
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

(function(){
   // construct coffee shop
   var imagesources = [
      "https://farm1.staticflickr.com/30/31495688395_cd84dec686_b.jpg",
      "https://farm1.staticflickr.com/580/31495689395_a20fe0efd6_b.jpg",
      "https://farm1.staticflickr.com/283/31495687845_14e95c3b80_b.jpg",
      "https://farm6.staticflickr.com/5503/31331287382_1be4451d83_b.jpg",
      "https://farm6.staticflickr.com/5581/31101469160_7993ee6ab6_m.jpg"
      ];
   var scale = [2.0, 1.4, 2.0];
   var coffeeshopFront = new TexturedPlane("coffeeshopFront", 'front', scale, imagesources[2], [0.1, 0.25, 0.9, 0.8]);
   var coffeeshopBack = new TexturedPlane("coffeeshopBack", 'back', scale, imagesources[0], [0.0, 0.0, 1.0, 0.55]);
   var coffeeshopLeft = new TexturedPlane("coffeeshopLeft", 'left', scale, imagesources[1], [0.0, 0.0, 1.0, 0.55]);
   var coffeeshopRight = new TexturedPlane("coffeeshopRight", 'right', scale, imagesources[1], [0.0, 0.0, 1.0, 0.55]);
   var coffeeshopRoof = new TexturedCylinder("coffeeshopRoof", tRoof, imagesources[3], 4, 1, 0.5, Math.PI/4);
   coffeeshopRoof.scale = new Float32Array(scale);
   coffeeshopRoof.position = [0.0, 1.4, 0.0];

   var spinningcoffeesign1 = new TexturedCylinder("spinningcoffeesign1", tCylinder1, imagesources[4], 30, 1, 0.8, 0, 1);
   spinningcoffeesign1.position = [-1.07, 0.8, 1.07];
   var spinningcoffeesign2 = new TexturedCylinder("spinningcoffeesign2", tCylinder1, imagesources[4], 30, 1, 0.8, 0, 1);
   spinningcoffeesign2.position = [1.07, 0.8, 1.07];

   grobjects.push(coffeeshopFront);
   grobjects.push(coffeeshopBack);
   grobjects.push(coffeeshopLeft);
   grobjects.push(coffeeshopRight);
   grobjects.push(coffeeshopRoof);
   grobjects.push(spinningcoffeesign1);
   grobjects.push(spinningcoffeesign2);

})();