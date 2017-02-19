/*
-----------------------------------------------
			BOZHKOV PROJECTS
			-WebGL projects-
-----------------------------------------------
*/

(function ()
{
  var canvas = document.getElementById('canvas');
  var gl = canvas.getContext("webgl");
  if (!gl) {
    gl = canvas.getContext("experimental-webgl");
  }
  if (!gl) {
    alert("Could not create WebGL context");
  }

  var vSource = document.getElementById('vShader').text;
  var fSource = document.getElementById('fShader').text;

  var vShader = gl.createShader(gl.VERTEX_SHADER);
  var fShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vShader,vSource);
  gl.shaderSource(fShader,fSource);

  gl.compileShader(vShader);
  if (!gl.getShaderParameter(vShader,gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(vShader));
  }

  gl.compileShader(fShader);
  if (!gl.getShaderParameter(fShader,gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(fShader));
  }

  var program = gl.createProgram();
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program,gl.LINK_STATUS)) {
    alert(gl.getProgramInfoLog(program));
  }

  gl.useProgram(program);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //address of aXYZ in the shader
  var aXYZ = gl.getAttribLocation(program, "aXYZ");
  var uPerspectiveMatrix = gl.getUniformLocation(program, "uPerspectiveMatrix");
  var uScaleMatrix = gl.getUniformLocation(program, "uScaleMatrix");
  var uRotateMatrix = gl.getUniformLocation(program, "uRotateMatrix");
  // set projection (Frustum)
  var projection = perspMatrix(30,gl.canvas.width/gl.canvas.height,1,40000);
  //Values used by the shaders are passed in as uniform of vertex
  //attributes.
  gl.uniformMatrix4fv(uPerspectiveMatrix,false,projection);

  //set point of view
  var uPointOfViewMatrix = gl.getUniformLocation(program, "uPointOfViewMatrix");
  //eye(where we are), focus(where is the object), up(orientation)
  //var view = viewMatrix([random(-50,50), random(-50,50), random(-50,50)],[0,0,0],[0,0,1]);
  var view = viewMatrix([15, 10, 40],[0,0,0],[0,0,1]);
  gl.uniformMatrix4fv(uPointOfViewMatrix, false, view);

  //set model-translation
  var uModelMatrix = gl.getUniformLocation(program, "uModelMatrix");

  //vertices
  //cube 1x1x1
  var data = [ 	0.5,-0.5,0.5,	// front wall
  				 0.5,0.5,0.5,
  				-0.5,0.5,0.5,
  				-0.5,-0.5,0.5,
  				 0.5,-0.5,-0.5, // rear wall
  				 0.5,0.5,-0.5,
  				-0.5,0.5,-0.5,
  				-0.5,-0.5,-0.5,

  				 0.5,-0.5,0.5, // right horizontal еdge
  				 0.5,-0.5,-0.5,
  				 0.5,0.5,0.5,
  				 0.5,0.5,-0.5,
  				-0.5,0.5,0.5,	// left horizontal edge
  				-0.5,0.5,-0.5,
  				-0.5,-0.5,0.5,
  				-0.5,-0.5,-0.5
  				];
//heart curve
 var n = 11;
 var heartPoints = [ ];
  for(var i=-n; i<=n; i+=1){
    var x = i/(n/2);
    var y = (Math.acos(1-Math.abs(x))-Math.PI)/4;
    heartPoints.push(x,y);
  }
  for (var i = -n; i <= n; i+=1) {
    var x = i/(n/2);
    var y = Math.sqrt(1-Math.pow(Math.abs(x)-1,2))/4;
    heartPoints.push(x,y);
  }

  //create buffer
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

var model;
var scale;
var rotate;
for (var j = 0; j < 12; j++) {
        for(var i=0; i<heartPoints.length-1; i+=2) {
            model = translateMatrix([5*heartPoints[i],30*heartPoints[i+1],1.3*j]);
            gl.uniformMatrix4fv(uModelMatrix, false, model);
            scale = scaleMatrix([2,1,1]);
            gl.uniformMatrix4fv(uScaleMatrix, false, scale);
            rotate = rotateMatrix(100,"z");
            gl.uniformMatrix4fv(uRotateMatrix, false, rotate);
            //drowing
            gl.enableVertexAttribArray(aXYZ);
            gl.vertexAttribPointer(aXYZ, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.LINE_LOOP, 0, 4);
            gl.drawArrays(gl.LINE_LOOP, 4, 4);
            gl.vertexAttribPointer(aXYZ, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.LINES, 8, 8);
        }
    }
})();
//random number between values min and max
function random(min,max){
  return min + (max-min)*Math.random();
}
//angle is in degree, aspect is in relation with canvas height
//and width,near and far are values for represent deep
function perspMatrix(angle, aspect, near, far){
  var angleRadians = (angle/2)*(Math.PI/180);   //convert to radians
  var ctg = 1/Math.tan(angleRadians);
  var matrix = [
    ctg/aspect,0,0,0,
    0,ctg,0,0,
    0,0,(near+far)/(near-far),(2*far*near)/(near-far),
    0,0,-1,0];
    return new Float32Array(matrix);
}

/*
  Matrix for fix view point
  -vector-point eye is the place from where we watching
  -vector-point focus is the place where we watching
  -vector-point up is up direction
*/
function viewMatrix(eye, focus, up){
    //z represent deep between eye and focus
    var z = unitVector(vectorBetweenTwoPoints(eye, focus));
    //x is perpendicular of z that hellp us to create our new coordinate system
    var x = unitVector(vectorProduct(up,z));
    //y is perpendicular of z and x and the coordinate system is ready
    var y = unitVector(vectorProduct(z,x));
    //the last row of the matrix represent (0,0,0) in
    //our new coordinate system (projection of -eye)
    var matrix = [
      x[0], y[0], z[0], 0,
      x[1], y[1], z[1], 0,
      x[2], y[2], z[2], 0,
      -scalarProduct(x, eye),
      -scalarProduct(y, eye),
      -scalarProduct(z, eye),1];
      return new Float32Array(matrix);
}
//return unit vector by giving vector
function unitVector(v){
  var magnitude = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
  var coef = 1/magnitude;
  return [coef*v[0], coef*v[1],coef*v[2]];
}

//return vector ->ba
function vectorBetweenTwoPoints(a,b){
  return [ a[0]-b[0],a[1]-b[1],a[2]-b[2] ];
}
//scalar product of two vectors
function scalarProduct(a,b){
  return [a[0]*b[0] + a[1]*b[1] + a[2]*b[2]];
}
//vector(cross) product
function vectorProduct(a,b){
  return [ a[1] * b[2] - a[2]*b[1],
           a[2] * b[0] - a[0]*b[2],
           a[0] * b[1] - a[1]*b[0]];
}

//translate by vector v
function translateMatrix(v){
  var matrix = [
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				v[0], v[1], v[2], 1];
			return new Float32Array(matrix);
}

//function that return matrix for scaling
//some object,the parameter is vector
function scaleMatrix(v){
  var matrix = [v[0],0,0,0,
                0,v[1],0,0,
                0,0,v[2],0,
                0,0,0,1];
  return new Float32Array(matrix);
}
/*
function return rotation matrix
and accept parameters
a-for degree
axis-x, y, z
and rotate object a-degrees by x or y or z
*/
function rotateMatrix(a,axis){
			a = a*(Math.PI/180);
			var c = Math.cos(a);
			var s = Math.sin(a);
			var matrix = [];
      switch (axis) {
          case 'x':
          matrix = [1, 0, 0, 0,
                    0, c, s, 0,
                    0,-s, c, 0,
                    0, 0, 0, 1];break;
          case 'y':
          matrix = [c, 0, s, 0,
                    0, 1, 0, 0,
                   -s, 0, c, 0,
                    0, 0, 0, 1];break;
          case 'z':
          matrix = [c, s, 0, 0,
                   -s, c, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1];break;
        }
        console.log(matrix);
      return new Float32Array(matrix);
		}
