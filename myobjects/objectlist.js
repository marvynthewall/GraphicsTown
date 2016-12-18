// Create by Marvyn Hsu 2016/12/09


// Buildings
var deep = 100.0;
var bnum = 10; // centerbuilding: positionmap(bnum, bnum);
var sidenum = bnum * 2 + 1;
var centergrid = 15.0;
var positionmap = setupbuildings(deep, bnum, centergrid);

// Volcano
var imagevolcano="https://farm6.staticflickr.com/5503/31331287382_1be4451d83_b.jpg";
var tCvolcano = new TexturedCylinder("tC-volcano1", tCvolcano1, imagevolcano, 15, 8, 2);
tCvolcano.position = positionmap[bnum - 1][bnum - 1];
grobjects.push(tCvolcano);

grobjects.push(new logcylinder("logcylinder1",[2, 0, -2],1, [1, 1, 0]) );
grobjects.push(new logcylinder("logcylinder2",[-2, 0, -2], 0.8, [0.5, 1, 1]) );
coffeeshop();


