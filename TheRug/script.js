/*
-----------------------------------------------
			BOZHKOV PROJECTS
			-WebGL projects-
-----------------------------------------------
*/

(function()
{

  var canvas = document.getElementById('canvas');
  var gl = canvas.getContext('webgl');
  if(!gl)
  {
    gl = canvas.getContext("experimental-webgl");
  }
  if(!gl)
  {
    alert("Could not create context in JS");
  }

  var vSource = document.getElementById('vShader').text;
  var fSource = document.getElementById('fShader').text;

  var vShader = gl.createShader(gl.VERTEX_SHADER);
  var fShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vShader,vSource);
  gl.shaderSource(fShader, fSource);

  gl.compileShader(vShader);
  gl.compileShader(fShader);
  if(!gl.getShaderParameter(vShader,gl.COMPILE_STATUS))
  {
    alert(gl.getShaderInfoLog(vShader));
  }
  if (!gl.getShaderParameter(fShader,gl.COMPILE_STATUS))
  {
    alert(gl.getShaderInfoLog(fShader));
  }

  var program = gl.createProgram();
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program,gl.LINK_STATUS))
  {
      alert(gl.getProgramInfoLog(program));
  }
  gl.useProgram(program);

  gl.clearColor(0,0,0,1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  aMidpoint_x_y = gl.getAttribLocation(program, "aMidpoint_x_y");
  aRGB = gl.getAttribLocation(program, "aRGB");
/*
 Define variables which assign first and last 
 point from Bezier Curve and other two points
 for the curve
*/
var firstPoint_x,
    firstPoint_y,
    t1_x,
    t1_y,
    t2_x,
    t2_y,
    lastPoint_x,
    lastPoint_y;
var midpoint_x;
var midpoint_y;
var data = [];
var N = 300;
/*
Additional variable for control 
space between lines
*/
var width = -0.2;
for (var i = 0; i < 11; i++)
{
  firstPoint_x = -1+width;
  firstPoint_y = -1*(6/4);
  t2_y = 0;
  lastPoint_x = -1+width;
  lastPoint_y = 0.9*(6/4);
  if (i!=0)
  {
    t1_x = random(-1+width,-0.5+width);
    t1_y = 0;
    t2_x = random(-1+width,-0.5+width);
  }
  else
  {
    t1_x = -1;
    t1_y = 0;
    t2_x = -1;
    t2_y = 0;
  }
  //N points for every curve
  for (var j = 0; j < N; j++)
  {
    midpoint_x = bezier(firstPoint_x, t1_x, t2_x, lastPoint_x, j/N);
    midpoint_y = bezier(firstPoint_y, t1_y,t2_y, lastPoint_y, j/N);
    data.push(midpoint_x,midpoint_y);
  }
  width = width + 0.3;
}


var newData = [];
var newData2 = [];
var newData3 =[];
var newData4 =[];
var newData5 =[];
var newData6 =[];
var newData7 =[];
var newData8 =[];
var newData9 =[];
var newData10 =[];


for (var i = 0; i < 2*N; i = i + 2)
{
  newData.push(data[i],data[i+1]);
  newData.push(data[2*N+i],data[2*N+i+1]);
  newData2.push(data[2*N+i],data[2*N+i+1]);
  newData2.push(data[4*N+i],data[4*N+i+1]);
  newData3.push(data[4*N+i],data[4*N+i+1]);
  newData3.push(data[6*N+i],data[6*N+i+1]);
  newData4.push(data[6*N+i],data[6*N+i+1]);
  newData4.push(data[8*N+i],data[8*N+i+1]);
  newData5.push(data[8*N+i],data[8*N+i+1]);
  newData5.push(data[10*N+i],data[10*N+i+1]);
  newData6.push(data[10*N+i],data[10*N+i+1]);
  newData6.push(data[12*N+i],data[12*N+i+1]);
  newData7.push(data[12*N+i],data[12*N+i+1]);
  newData7.push(data[14*N+i],data[14*N+i+1]);
  newData8.push(data[14*N+i],data[14*N+i+1]);
  newData8.push(data[16*N+i],data[16*N+i+1]);
  newData9.push(data[16*N+i],data[16*N+i+1]);
  newData9.push(data[18*N+i],data[18*N+i+1]);
  newData10.push(data[18*N+i],data[18*N+i+1]);
  newData10.push(data[20*N+i],data[20*N+i+1]);
}


  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  gl.enableVertexAttribArray(aMidpoint_x_y);
  gl.vertexAttribPointer( aMidpoint_x_y,2,gl.FLOAT,false,0,0);

  
  gl.vertexAttrib3f(aRGB,0.2,0,0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newData), gl.STATIC_DRAW);
  gl.drawArrays(gl.POINTS, 0, 2*N);
  gl.vertexAttrib3f(aRGB,random(0,0.5),random(0,0.5),random(0,0.5));
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 2*N);

  gl.vertexAttrib3f(aRGB,0.2,0,0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newData2), gl.STATIC_DRAW);
  gl.drawArrays(gl.POINTS, 0, 2*N);
  gl.vertexAttrib3f(aRGB,random(0,1),random(0,1),random(0,1));
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 2*N);

  gl.vertexAttrib3f(aRGB,0.2,0,0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newData3), gl.STATIC_DRAW);
  gl.drawArrays(gl.POINTS, 0, 2*N);
  gl.vertexAttrib3f(aRGB,random(0,1),random(0,1),random(0,1));
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 2*N);

  gl.vertexAttrib3f(aRGB,0.2,0,0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newData4), gl.STATIC_DRAW);
  gl.drawArrays(gl.POINTS, 0, 2*N);
  gl.vertexAttrib3f(aRGB,random(0,1),random(0,1),random(0,1));
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 2*N);

  gl.vertexAttrib3f(aRGB,0.2,0,0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newData5), gl.STATIC_DRAW);
  gl.drawArrays(gl.POINTS, 0, 2*N);
  gl.vertexAttrib3f(aRGB,random(0,1),random(0,1),random(0,1));
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 2*N);

  gl.vertexAttrib3f(aRGB,0.2,0,0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newData6), gl.STATIC_DRAW);
  gl.drawArrays(gl.POINTS, 0, 2*N);
  gl.vertexAttrib3f(aRGB,random(0,1),random(0,1),random(0,1));
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 2*N);

  gl.vertexAttrib3f(aRGB,0.2,0,0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newData7), gl.STATIC_DRAW);
  gl.drawArrays(gl.POINTS, 0, 2*N);
  gl.vertexAttrib3f(aRGB,random(0,1),random(0,1),random(0,1));
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 2*N);

  gl.vertexAttrib3f(aRGB,0.2,0,0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newData8), gl.STATIC_DRAW);
  gl.drawArrays(gl.POINTS, 0, 2*N);
  gl.vertexAttrib3f(aRGB,random(0,1),random(0,1),random(0,1));
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 2*N);

  gl.vertexAttrib3f(aRGB,0.2,0,0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newData9), gl.STATIC_DRAW);
  gl.drawArrays(gl.POINTS, 0, 2*N);
  gl.vertexAttrib3f(aRGB,random(0,1),random(0,1),random(0,1));
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 2*N);

  gl.vertexAttrib3f(aRGB,0.2,0,0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newData10), gl.STATIC_DRAW);
  gl.drawArrays(gl.POINTS, 0, 2*N);
  gl.vertexAttrib3f(aRGB,random(0,1),random(0,1),random(0,1));
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 2*N);
})();

//return random number between min and max
function random (min,max)
{
  return min+(max-min)*Math.random();
}

//Bezier curve
function bezier(p0,p1,p2,p3,t)
{
  var point = (Math.pow((1.0-t), 3.0) * p0) +
    (3.0 * Math.pow((1-t),2.0) * t * p1) +
    (3.0 * (1.0-t) * t * t * p2) +
    (Math.pow(t, 3.0) * p3);
    return point;
}
