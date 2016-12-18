// Create by Marvyn Hsu 2016/12/09


// Buildings
var deep = 100.0;
var bnum = 5; // centerbuilding: positionmap(bnum, bnum);
var sidenum = bnum * 2 + 1;
var centergrid = 15.0;
var positionmap = setupbuildings(deep, bnum, centergrid);

// paperplanes
drawingpaperplanes(deep, sidenum, positionmap);

// PaperPlane
grobjects.push(new paperplane("hugeplane", 1.0, [0.0, 0.8, 0.0], [0, 30, 0], 40, 20, 100, 0.2, 30));

// a lot of volcano
drawingrooftops(sidenum, bnum, positionmap);

// Volcano

var imagevolcano="https://farm6.staticflickr.com/5503/31331287382_1be4451d83_b.jpg";
var tCvolcano = new TexturedCylinder("tC-volcano1", tCvolcano1, imagevolcano, 50, 15, 2, [250, 250, 250], Math.PI);
tCvolcano.position = [500, -150, -1000];
grobjects.push(tCvolcano);

// SinBuilding
var imagepink = "https://farm1.staticflickr.com/385/30925701163_07f0ac2b0a_b.jpg";
var tsinBuilding = new TexturedCylinder("sinbuilding", sinbuilding, imagepink, 5, 200, 195, [1, 1, 1], Math.PI / 4);
tsinBuilding.position = [ -centergrid , -deep, -centergrid];
grobjects.push(tsinBuilding);


grobjects.push(new logcylinder("logcylinder1",[2, 0, -2],1, [1, 1, 0]) );
grobjects.push(new logcylinder("logcylinder2",[-2, 0, -2], 0.8, [0.5, 1, 1]) );
coffeeshop();


