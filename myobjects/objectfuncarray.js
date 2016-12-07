function computearrays(n, f, high, cut){ 
   // n = vertex in a circle
   // f = function of radius to height
   var step = high/cut;
   var posarr = [];
   var normalarr = [];
   
   // create side triangles: 2n triangles per layer
   var prering = [];
   var nowring = [];
   var prer = 0;
   var r = 0;
   var theta = 0;
   var newv = [];
   var normal = 0;
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
      }
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
   }
   // in total 2 * (n-2) + 2n * 10 triangles
   var arrays = {
      vpos: {numComponents: 3, data: posarr},
      vnormal: {numComponents: 3, data: normalarr}
   };
   return arrays;
}
