// Create by Marvyn Hsu
// 2016/12/07
// Setup the coffeeshop


function coffeeshop(){
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

}

