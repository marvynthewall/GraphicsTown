// Created by Marvyn Hsu 2016/12/07
// Height Functions for Cylinders

function equalradius(h){
   return 0.5;
}
function tRoof(h){
   return (1-h) / Math.sqrt(2);
}
function tCylinder1(h){
   return 0.15;
}
function tCylinder2(h){
   return 0.2;
}
function tCvolcano1(h){
   return (-0.2) + 1 /( h + 0.4);
}
function funclog(h){
   return -0.2 * Math.log( h + 0.2) + 0.6;
}

function sinbuilding(h){
   return (1 - h / 200)*(3 + Math.cos( h * 2 * Math.PI / 10));
}
