function FlatBackground(){

//TODO generate flat circle
   var size = 512+1;
   var scale = 9;
   var rotationAng = 360/size;
   var angles = [];
   angles[0] = 0;
   var cs = Math.cos(Math.PI * rotationAng/180);
   var sn = Math.sin(Math.PI * rotationAng/180);
   var prevX = 1; //radius
   var prevZ = 0;
   var x, z;
   var flatCircleVerts = new Float32Array(size*3);
   flatCircleVerts[0] = prevX;
   flatCircleVerts[1] = 0;
   flatCircleVerts[2] = prevZ;
   var index = 1;
   for(var i=3; i < flatCircleVerts.length; i+=3){
      var x = prevX*cs - prevZ*sn;
      var z = prevX*sn + prevZ*cs;

      flatCircleVerts[i] = x;
      flatCircleVerts[i+1] = 0;
      flatCircleVerts[i+2] = z;

      angles[index] = angles[index-1] + rotationAng;
      index++;
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
   var max = 0;
   for(var octave=0; octave < scale; octave++){
      for(var i=start; i < size; i+=step){
         terrain[i] = (terrain[i-start]+terrain[i+start])/2 + Math.pow(2, -octave*smoothness) * (Math.random()*2 - 1.3);
	 if(terrain[i] < 0)
            terrain[i] = 0;
         if(terrain[i] > max)
            max = terrain[i];
         
      }
      start = start/2;
      step = step/2;
   }
   console.log("max : "+max);
   //for(var i=0; i < angles.length; i++)
      //console.log("angles["+i+"] = "+angles[i]);

   //TODO combine flatCircle and terrain in new array
   var terrainVerts = new Float32Array(size*3);
   
   for(var i=0; i < terrainVerts.length; i+=3){//go by 3 cause we load 3 vertices per loop
      terrainVerts[i] = flatCircleVerts[i];
      terrainVerts[i+1] = terrain[Math.floor(i/3)]; //force integer division, i/3 because we're loading from the terrain array which only contains height values, no position data
      terrainVerts[i+2] = flatCircleVerts[i+2];
   }

   var mtnTriangles = new Float32Array((size+1)*18);
   var tvIndex = 0;
   var mntIndex = 0;
   //prevX = 1;
   //prevZ = 0;
   for(var i=0; i < terrain.length; i++){
        //var x = prevX*cs - prevZ*sn;
        //var z = prevX*sn + prevZ*cs;
	//if(i % 2 === 0){//even, forward triangle -> |_
		//bottom left corner
		mtnTriangles[mntIndex++] = flatCircleVerts[tvIndex]
		mtnTriangles[mntIndex++] = 0;
		mtnTriangles[mntIndex++] = flatCircleVerts[tvIndex+2];

		//bottom right corner
		mtnTriangles[mntIndex++] = flatCircleVerts[tvIndex+3];
		mtnTriangles[mntIndex++] = 0;
		mtnTriangles[mntIndex++] = flatCircleVerts[tvIndex+5];

		//top left terrain point
		mtnTriangles[mntIndex++] = flatCircleVerts[tvIndex];
		mtnTriangles[mntIndex++] = terrain[i];
		mtnTriangles[mntIndex++] = flatCircleVerts[tvIndex+2];

		//tvIndex += 2; //skip height value
        //}else{ //odd, backward triangle -> -|
		//top left terrain point
		mtnTriangles[mntIndex++] = flatCircleVerts[tvIndex-3];
		mtnTriangles[mntIndex++] = terrain[i-1];
		mtnTriangles[mntIndex++] = flatCircleVerts[tvIndex-1];

		//bottom right
		mtnTriangles[mntIndex++] = flatCircleVerts[tvIndex];
		mtnTriangles[mntIndex++] = 0;
		mtnTriangles[mntIndex++] = flatCircleVerts[tvIndex+2];

		//top right terrain point
		mtnTriangles[mntIndex++] = flatCircleVerts[tvIndex];
		mtnTriangles[mntIndex++] = terrain[i];
		mtnTriangles[mntIndex++] = flatCircleVerts[tvIndex+2];
	//}
	tvIndex += 3; //goto next point along flat circle
        //prevX = x;
        //prevZ = z;
   }

   //one more to close the loop from n-1 -> 0
        fcvSize = size*3-1;
	//bottom left
	mtnTriangles[mntIndex++] = flatCircleVerts[fcvSize-2]
	mtnTriangles[mntIndex++] = 0;
	mtnTriangles[mntIndex++] = flatCircleVerts[fcvSize];

	//bottom right corner
	mtnTriangles[mntIndex++] = flatCircleVerts[0];
	mtnTriangles[mntIndex++] = 0;
	mtnTriangles[mntIndex++] = flatCircleVerts[2];

	//top left terrain point
	mtnTriangles[mntIndex++] = flatCircleVerts[fcvSize-2];
	mtnTriangles[mntIndex++] = terrain[size-1];
	mtnTriangles[mntIndex++] = flatCircleVerts[fcvSize];

	//tvIndex += 2; //skip height value
	//}else{ //odd, backward triangle -> -|
	//top left terrain point
	mtnTriangles[mntIndex++] = flatCircleVerts[fcvSize-2];
	mtnTriangles[mntIndex++] = terrain[size-1];
	mtnTriangles[mntIndex++] = flatCircleVerts[fcvSize];

	//bottom right
	mtnTriangles[mntIndex++] = flatCircleVerts[0];
	mtnTriangles[mntIndex++] = 0;
	mtnTriangles[mntIndex++] = flatCircleVerts[2];

	//top right terrain point
	mtnTriangles[mntIndex++] = flatCircleVerts[0];
	mtnTriangles[mntIndex++] = terrain[0];
	mtnTriangles[mntIndex++] = flatCircleVerts[2];
   console.log(tvIndex+"/"+flatCircleVerts.length+" -> tvIndex");
   

   var ind = binSearch(angles, 78.4);
   console.log("ind : "+ind+" lower: "+angles[Math.floor(ind)]+" upper: "+angles[Math.ceil(ind)]);
   

   //TODO generate stars throughout upper cube
   var numStars = 1024;
   var starArray = new Float32Array(numStars*3);
   for(var i=0; i< starArray.length; i+=3){

      //idea 2 get arc that x,z are between then force y to be y += y at higher terrain value

      //TODO doesnt work.....
      var x = Math.random()*2-1;
      var z = Math.random()*2-1;
      var y = Math.random()*2;

      var theta = Math.atan(z/x)*180/Math.PI; //careful TODO need to know offsets for atan when not in Q1
      //if( x <= 0 && z < 0) //q4
        // theta = (theta) + 90;
      //if( x <= 0 && z > 0)//q3
        //  theta = -theta + 180;
      //console.log(theta);
      var ind = binSearch(angles, theta);
      if( y < Math.max(terrain[Math.floor(ind)], terrain[Math.ceil(ind)]) )
         y += Math.max(terrain[Math.floor(ind)], terrain[Math.ceil(ind)]);

      //get distance from center circle (0,0) WILL BE CHANGED to (x,z)
     /* var dist = Math.sqrt( x*x + z*z );
      //console.log(dist);
      var ang1 = Math.asin( z / dist );
      var ang2 = Math.PI - ang1;
      var xp = Math.sin(ang2);
      var zp = Math.cos(ang2); 
      var xdex = Math.floor(xp / (360 / 512) );
      var zdex = Math.floor(zp / (360 / 512) );

      //console.log("x : "+xp+" realX : "+terrainVerts[3*xdex]);
      if( y < terrainVerts[xdex*3+1] )
         y = y + terrainVerts[xdex*3+1]; */

      //var y = Math.random()*2;
      //if(y < max)
      //   y += max;
      
      starArray[i] = Math.random()*2-1;
      starArray[i+1] = y;//Math.random()*2;
      starArray[i+2] = Math.random()*2-1;
   }

   this.draw = function(gl, program){
      if(this.vbo === undefined)
         this.vbo = gl.createBuffer();

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      gl.bufferData(gl.ARRAY_BUFFER, flatCircleVerts, gl.STATIC_DRAW);

      //gl.clearColor(0,0,0,1);
      //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.vertexAttribPointer(program.a_Position, 3, gl.FLOAT, gl.FALSE, 0, 0);
      gl.enableVertexAttribArray(program.a_Position);
      gl.drawArrays(gl.LINE_LOOP, 0, flatCircleVerts.length/3);

      gl.bufferData(gl.ARRAY_BUFFER, terrainVerts, gl.STATIC_DRAW);
      gl.drawArrays(gl.LINE_LOOP, 0 , terrainVerts.length/3);
   
      gl.bufferData(gl.ARRAY_BUFFER, starArray, gl.STATIC_DRAW);
      gl.drawArrays(gl.POINTS, 0, starArray.length/3);

      gl.bufferData(gl.ARRAY_BUFFER, mtnTriangles, gl.STATIC_DRAW);
      gl.drawArrays(gl.TRIANGLES, 0, mtnTriangles.length/3);

   }

   function binSearch(arr, val){
      var min = 0;
      var max = arr.length;
      
      if(val < arr[0])
         return 0;
      if(val > arr[arr.length-1])
         return arr.length-1;

      var mid = Math.floor(arr.length/2);
      while( max - min > 1){
         if(arr[mid] > val)
            max = mid;
         else
            min = mid;

         mid = min + (max - min)/2;
      }
      return mid;
   }
}

