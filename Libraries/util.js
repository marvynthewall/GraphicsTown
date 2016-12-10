"use strict"
function findnormal(p1, p2, p3){
   var v1 = [ p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
   var v2 = [ p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]];
   var per = [ v1[1] * v2[2] - v1[2] * v2[1], v1[2] * v2[0] - v1[0] * v2[2], v1[0] * v2[1] - v1[1] * v2[0] ];
   var norm = Math.sqrt(per[0] * per[0] + per[1] * per[1] + per[2] * per[2]);
   var normal = [per[0] / norm, per[1]/norm, per[2]/norm];
   return normal;
}
function normalize(v){
   var L = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
   return [v[0]/L, v[1]/L, v[2]/L];
}
