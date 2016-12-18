// Create by Marvyn Hsu
// 2016/12/18
// Spiralpath goes up and down
function SMM(a, A){
   // Scalar-Matrix Multiplication
   var C = new Array(A.length);
   for (i = 0 ; i < A.length ; ++i){
      C[i] = new Array(A[0].length);
      for (j = 0 ; j < A[0].length ; ++j)
         C[i][j]  = a * A[i][j];
   }
   return A;
}

function SVM(a, V){
   // Scalar-Vector Multiplication
   var VV = new Array(V.length);
   for (i = 0 ; i < V.length ; ++i)
      VV[i] = a * V[i];
   return VV;
}

function VA(V1, V2){
   // Vector Addition
   var V3 = new Array(V1.length);
   for (i = 0 ; i < V1.length ; ++i)
      V3[i] = V1[i] + V2[i];
   return V3;
}

function MA(A, B){
   // Matrix Addition
   var m = A.length;
   var n = A[0].length;
   var m2 = B.length;
   var n2 = B[0].length;
   if(m != m2 || n != n2){
      console.log("Matrix Addition Fail!!")
      return;
   }
   var C = new Array(m);
   for (var i = 0 ; i < m ; ++i){
      C[i] = new Array(n);
      for(var j = 0 ; j < n ; ++j)
         C[i][j] = A[i][j] + B[i][j];
   }
   return C;
}

function MM(A, B){
   // Matrix Multiplication
   // A: m by k
   // B: k by n
   // C: m by n
   var m = A.length;
   var k = A[0].length;
   var k2 = B.length;
   if (k != k2){
      console.log(k);
      console.log(k2);
      console.log("Matrix Multiplication Fail!!");
      return;
   }
   var n = B[0].length;
   var C = new Array(m);
   for(var i = 0 ; i < m; ++i){
      C[i] = new Array(n);
      for(var j = 0 ; j < n ; ++j){
         C[i][j] = 0;
      }
   }
   for(i = 0; i < m; ++i)
      for(j = 0; j < n; ++j)
         for(a = 0 ; a < k ; ++a)
            C[i][j] += A[i][a] * B[a][j];
   return C ;
}
var bezier = function (P){
   this.Bmatrix = [[1, 0, 0, 0], [-3, 3, 0, 0], [3, -6, 3, 0], [-1, 3, -3, 1]];
   this.Tmatrix = [[-3, 3, 0, 0], [6, -12, 6, 0], [-3, 9, -9, 3], [0, 0, 0, 0]];
   this.P = P; // points
}
bezier.prototype.position = function (t){
   var u = [[1, t, t*t, t*t*t]];
   var position = MM(u, MM(this.Bmatrix, this.P)); // u * B * P
   return position;
}
bezier.prototype.tangent = function (t){
   var u = [[1, t, t*t, t*t*t]];
   var tangent = MM(u, MM(this.Tmatrix, this.P)); // u * T * P
   return tangent;
}
var spiralpath = function (base, H){
   this.base = base;
   this.H = H;
   this.h = 1;
   this.r = 5;
   this.speed = 1;
   this.path = this.createpath();
   this.time = this.path.length;
}
spiralpath.prototype.createpath = function(){
   var D = [[0, 0, 1], [1, 0, 0], [0, 0, -1], [-1, 0, 0]];
   // tangent
   // flat tangent
   var F = [[2, 0, 0], [0, 0, -2], [-2, 0, 0], [0, 0, 2]];
   // modify bar
   var sbar = 1;
   // side tangent
   var SU = [[2, 1, 0], [0, 1, -2], [-2, 1, 0], [0, 1, 2]];
   var SD = [[-2, 1, 0], [0, 1, 2], [2, 1, 0], [0, 1, -2]];
   var Plist = [];
   var Tlist = [];
   // Create point list and tangent list
   var h = 0;
   var up = 1;
   for(var i = 0; h >= 0 ; i += 1){
      var dir = i % 4;  // direction
      var p = VA(this.base, VA([0, h, 0] ,SVM(this.r, D[dir]))); // base + h + sbar*Direction
      Plist.push(p);
      if ( (dir == 0 || dir == 2) && (this.H-h) < this.h * 2){
         // End!!
         Tlist.push(F[dir]);
         up = 0;
      }
      else if(h == 0){
         // start!!
         Tlist.push(F[dir]);
      }
      else {
         if(up == 1)
            Tlist.push(SU[dir]);
         else 
            Tlist.push(SD[dir]);
      }
      if (up == 1)
         h += this.h;
      else 
         h -= this.h;
   }
   var path = [];
   // create bezier paths
   for(var i = 0 ; i <= Plist.length - 2 ; ++i){
      var p0 = Plist[i];
      var p3 = Plist[i+1];
      var p1 = VA(p0, SVM(sbar, Tlist[i]));  // p0 + sbar * tangent
      var p2 = VA(p3, SVM(-sbar, Tlist[i+1]));  // p3 + (-sbar) * tangent
      var P = [p0, p1, p2, p3];
      var newpath = new bezier(P);
      path.push(newpath);
   }
   return path;
}
spiralpath.prototype.accessinfo = function(t){
   var realt = this.speed * t;
   for( ; realt > this.time; realt -= this.time);
   var pathnum = Math.floor(realt);
   var patht = realt - pathnum;
   var position = this.path[pathnum].position(patht);
   var tangent = this.path[pathnum].tangent(patht);
   return {position: position, tangent: tangent};
}

//var yoyo = new spiralpath([0, 0, 0], 3.5);
//console.log(yoyo.path);
//console.log(yoyo.accessinfo(40.5));
