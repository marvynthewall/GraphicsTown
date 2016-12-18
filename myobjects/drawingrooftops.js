// Created by Marvyn Hsu
// 2016/12/18
// drawing the rooftops objects

function drawingrooftops(sidenum, bnum, positionmap){
   var imagevolcano="https://farm6.staticflickr.com/5503/31331287382_1be4451d83_b.jpg";
   var num;
   var name;
   for(var i = 0 ; i < sidenum ; ++i){
      for(var j = 0 ; j < sidenum ; ++j){
         num = Math.random();
         if (i == bnum && j == bnum)
            continue;
         if (i == (bnum - 1) && j == (bnum - 1))
            continue;
         if(num < 0.5){
            name = "tC-volcano-"+i.toString()+"-"+j.toString();
            var tCvolcano = new TexturedCylinder(name, tCvolcano1, imagevolcano, 15, 8, 2);
            tCvolcano.position = positionmap[i][j];
            grobjects.push(tCvolcano);
         }
      }
   }

}
