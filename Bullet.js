function Bullet(pos, dir, speed){
   var pos = new Vector3(pos.x, pos.y, pos.z);
   var len = 500;//0.5;
   var speed = 3;
   var dir = new Vector3(dir.x, dir.y, dir.z);

   var vertices = new Float32Array([pos.x, pos.y, pos.z, pos.x, pos.y, pos.z-len]);

   Bullet.prototype.draw = function(gl, program){
      gl.useProgram(program);
      if(this.buffer === undefined || this.buffer === null)
         this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(program.a_Position, 3, gl.FLOAT, gl.FALSE, gl.FALSE, 0, 0);
      gl.enableVertexAttribArray(program.a_Position);
      gl.drawArrays(gl.LINES, 0, vertices.length/3);
   }

   Bullet.prototype.update = function(){
      pos.z += speed;
      vertices = new Float32Array([pos.x, pos.y, pos.z, pos.x, pos.y, pos.z-len]);
   }
}
