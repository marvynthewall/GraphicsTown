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

function imagecoffee(i){
   i.crossOrigin='anonymous';
   i.src = "https://farm6.staticflickr.com/5581/31101469160_7993ee6ab6_m.jpg";
}
function imagevolcano(i){
   i.crossOrigin='anonymous';
   i.src="https://farm6.staticflickr.com/5503/31331287382_1be4451d83_b.jpg";
}

function tCylinder1(h){
   return 0.3;
}
function tCylinder2(h){
   return 0.2;
}
function tCvolcano1(h){
   return (-0.2) + 1 /( h + 0.4);
}

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

     var TexturedCylinder = function (name = null, func = null, imagefunc = null, side = null, cut = null, height = null) {
        this.name = name || "TexturedCylinder";
        this.position = new Float32Array([0, 0, 0]);
        this.scale = new Float32Array([1, 1, 1]);
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
        this.image = new Image();
        this.imagefunc = imagefunc;
    }
    TexturedCylinder.prototype.vertexnum = function(n){
      var num = 2 * n * this.cut;
      num = num + 2 * (n-2);
      num = num * 3;
      console.log(num);
      return num;
    }

    TexturedCylinder.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
        var vertexSource = document.getElementById("texturecylinder-vs").text;
        var fragmentSource = document.getElementById("texturecylinder-fs").text;

        this.program = createGLProgram(gl, vertexSource, fragmentSource);
        this.attributes = findAttribLocations(gl, this.program, ["vPosition", "vNormal", "aTexCoord"]);
        this.uniforms = findUniformLocations(gl, this.program, ["pMatrix", "vMatrix", "mMatrix", "normalMatrix", "uTexture", "lightdir"]);

        this.imagefunc(this.image);

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

})();
