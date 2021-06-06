var VSHADER_SRC =
'attribute vec4 a_Position;\n' +
'uniform mat4 u_Projection;\n' +
'uniform mat4 u_View;\n' +
'uniform mat4 u_Model;\n' +
'uniform vec4 u_Color;\n' +
'varying vec4 v_Color;\n' +
'void main(){\n' +
'   gl_PointSize = 2.0;\n'+
'   gl_Position = u_Projection * u_View * u_Model * a_Position;\n' +
'   v_Color = u_Color;\n' +
'}\n';

var FSHADER_SRC = 
'#ifdef GL_ES\n' +
'precision mediump float;\n' +
'#endif\n' +
'varying vec4 v_Color;\n' +
'void main(){\n' +
' gl_FragColor = v_Color;\n' +
'}\n';

window.onload = function(){

   var canvas = document.getElementById('canvas');
   var gl = canvas.getContext('webgl', {preserveDrawingBuffer : true});
   if(!gl){
      console.log("webgl unavailable");
      return;
   }

   //init shader program
   var program = compileShaderProgram(gl, VSHADER_SRC, FSHADER_SRC);
   gl.useProgram(program);
   //get Attrib locations
   program.a_Position = gl.getAttribLocation(program, 'a_Position');
   if(program.a_Position == null){console.log("a_Position not found");}
   //get Uniform locations
   program.u_Projection = gl.getUniformLocation(program, 'u_Projection');
   if(program.u_Projection == null){console.log("u_Projection not found");}
   program.u_View = gl.getUniformLocation(program, 'u_View');
   if(program.u_View == null){console.log("u_View not found");} 
   program.u_Model = gl.getUniformLocation(program, 'u_Model');
   if(program.u_Model == null){console.log("u_Model not found");} 
   program.u_Color = gl.getUniformLocation(program, 'u_Color');
   if(program.u_Color == null){console.log("u_Color not found");}

   //TODO generate flat circle
  /* var size = 512+1;
   var scale = 9;
   var rotationAng = 360/size;
   var cs = Math.cos(Math.PI * rotationAng/180);
   var sn = Math.sin(Math.PI * rotationAng/180);
   var prevX = 1; //radius
   var prevZ = 0;
   var x, z;
   var flatCircleVerts = new Float32Array(size*3);
   flatCircleVerts[0] = prevX;
   flatCircleVerts[1] = 0;
   flatCircleVerts[2] = prevZ;
   for(var i=3; i < flatCircleVerts.length; i+=3){
      var x = prevX*cs - prevZ*sn;
      var z = prevX*sn + prevZ*cs;

      flatCircleVerts[i] = x;
      flatCircleVerts[i+1] = 0;
      flatCircleVerts[i+2] = z;

      //angle += angleStep;
      prevX = x;
      prevZ = z;
   }

   //TODO generate a circular 1d terrain generator to run atop circles 
   var step = 1<<scale; //Math.pow(2, scale);
   var start = step>>1; //step/2;
   var terrain = new Float32Array(size);
   //set the endpoints equal (were forming a circle)
   terrain[0] = Math.random();
   terrain[size-1] = terrain[0];
   var smoothness = Math.random()+0.3;
   for(var octave=0; octave < scale; octave++){
      for(var i=start; i < size; i+=step){
         terrain[i] = (terrain[i-start]+terrain[i+start])/2 + Math.pow(2, -octave*smoothness) * (Math.random()*2 - 1.3);
	 if(terrain[i] < 0)
            terrain[i] = 0;
         
      }
      start = start/2;
      step = step/2;
   }
   for(var i=0; i < terrain.length; i++)
      console.log("t["+i+"] = "+terrain[i]);

   //TODO combine flatCircle and terrain in new array
   var terrainVerts = new Float32Array(size*3);
   for(var i=0; i < terrainVerts.length; i+=3){
      terrainVerts[i] = flatCircleVerts[i];
      terrainVerts[i+1] = terrain[Math.floor(i/3)]; //force integer division
      terrainVerts[i+2] = flatCircleVerts[i+2];
   }  

   //TODO generate stars throughout upper cube
   var numStars = 1024;
   var starArray = new Float32Array(numStars*3);
   for(var i=0; i< starArray.length; i+=3){
      starArray[i] = Math.random()*2-1;
      starArray[i+1] = Math.random()*2;
      starArray[i+2] = Math.random()*2-1;
   }*/

   var bg = new FlatBackground();

   //TODO camera init
   var eye = new Vector3(0,1,0)//Vector3(1,2,-2);
   var look = new Vector3(0, 0, 100);
   var up = new Vector3(0,1,0);
   var cam = new Camera(eye, look, up);
   cam.setShape(75, canvas.width/canvas.height, 0.06125, 20000);

   var model = Matrix4.scaleMatrix(500, 500, 500);
   gl.uniformMatrix4fv(program.u_Model, false, model.getFloat32Array());//new Matrix4().getFloat32Array());
   gl.uniformMatrix4fv(program.u_View, false, cam.View);
   gl.uniformMatrix4fv(program.u_Projection, false, cam.Projection);
   gl.uniform4f(program.u_Color, 0.5, 0.7, 0.3, 1);

   /*var vbo = gl.createBuffer();*/

   var turnLeft = false;
   var turnRight = false;
   var lookUp = false;
   var lookDown = false;
   var moveForward = false;
   var moveBackward = false;
   var t = 0;
   var prev = 0;

   var bullet = new Bullet(new Vector3(0,0,0), new Vector3(0,0,-1), 0.5);

   setInterval(function(){

      if(turnLeft)
         cam.FPSyaw(-5); 
      if(turnRight)
         cam.FPSyaw(5);
      if(lookUp)
         cam.pitch(5);
      if(lookDown)
         cam.pitch(-5);
      if(moveForward){
         cam.slide(0, -prev + Math.sin(t), -0.5);
         prev = Math.sin(t);
         t+=0.2;
         
      }
      if(moveBackward) 
         cam.slide(0,0, 0.5);

      gl.clearColor(0,0,0,1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(program.u_Model, false, model.getFloat32Array());
      gl.uniformMatrix4fv(program.u_View, false, cam.View);
      bg.draw(gl, program);
     /* gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, flatCircleVerts, gl.STATIC_DRAW);

      gl.clearColor(0,0,0,1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.vertexAttribPointer(program.a_Position, 3, gl.FLOAT, gl.FALSE, 0, 0);
      gl.enableVertexAttribArray(program.a_Position);
      gl.drawArrays(gl.LINE_LOOP, 0, flatCircleVerts.length/3);

      gl.bufferData(gl.ARRAY_BUFFER, terrainVerts, gl.STATIC_DRAW);
      gl.drawArrays(gl.LINE_LOOP, 0 , terrainVerts.length/3);
   
      gl.bufferData(gl.ARRAY_BUFFER, starArray, gl.STATIC_DRAW);
      gl.drawArrays(gl.POINTS, 0, starArray.length/3); */

      gl.uniformMatrix4fv(program.u_Model, false, new Matrix4().getFloat32Array());
      bullet.draw(gl, program);
      bullet.update();
   }, 1000/30);

   document.addEventListener("keydown", function(event){ 
      if(event.keyCode === 65)//a
         turnLeft = true;
      if(event.keyCode === 68)//d
         turnRight = true;
      if(event.keyCode === 87)//w
         lookUp = true;
      if(event.keyCode === 83)//s
         lookDown = true;
      if(event.keyCode === 82)//r
         moveForward = true;
      if(event.keyCode === 70)//f
         moveBackward = true;
   });

   document.addEventListener("keyup", function(event){
      if(event.keyCode === 65)//a
         turnLeft = false;
      if(event.keyCode === 68)//d
         turnRight = false;
      if(event.keyCode === 87)//w
         lookUp = false;
      if(event.keyCode === 83)//s
         lookDown = false;
      if(event.keyCode === 82)//r
         moveForward = false;
      if(event.keyCode === 70)
         moveBackward = false;
   });   
}
