/*
 *  MglEngine - WebGL engine programming library
 *  Copyright (C) 2011  Mateusz Szczygielski
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */

/**
 * @class mgl.Triangle
 * Triangle sample class
 * @extends mgl.Geometry
 * @constructor
 * @param {mgl.Color} color1 Triangle vertex1 color
 * @param {mgl.Color} color2 Triangle vertex2 color
 * @param {mgl.Color} color3 Triangle vertex2 color
 */
mgl.Triangle = function(color1, color2, color3){
	mgl.Geometry.prototype.constructor.call(this);
	
	var c1 = new mgl.Color(color1);
	var c2 = new mgl.Color(color2);
	var c3 = new mgl.Color(color3);
	
	this.colors = new Float32Array(
		c1.RGBA().concat(c2.RGBA(),c3.RGBA())
	);
}
mgl.extend(mgl.Triangle, mgl.Geometry, {
	
//!	colors: undefined,

//! triangleVertexPositionBuffer,
//! triangleVertexColorBuffer,

	vShaderSource: 
		'attribute vec3 aVertexPosition;'+
		'attribute vec4 aVertexColor;'+

		'uniform mat4 uMVMatrix;'+
		'uniform mat4 uPMatrix;'+

		'varying vec4 vColor;'+

		'void main(void) {'+
			'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);'+
			'vColor = aVertexColor;'+
		'}',
	
	fShaderSource: 
		'precision mediump float;'+

		'varying vec4 vColor;'+

		'void main(void) {'+
			'gl_FragColor = vColor;'+
		'}',
	
	vertices: new Float32Array([
		 0.0,  1.0,  0.0,
		-1.0, -1.0,  0.0,
		 1.0, -1.0,  0.0
	]),
	
	/**
	 * Initializes all context depending variables
	 * @param {WebGLRenderingContext} gl WebGL context
	 */
	init: function(gl){
		mgl.Geometry.prototype.init.call(this, gl);
		
		this.createBuffers();
		this.shader = new mgl.Shader(this.vShaderSource, this.fShaderSource);
		this.shader.init(gl);
		this.setShaderLocations();
		
		this.initialized = true;
	},
	
	createBuffers: function(){
		var gl = this.gl;
		
		//create buffers
		this.triangleVertexPositionBuffer = this.createBuffer(gl.ARRAY_BUFFER, this.vertices);
		this.triangleVertexColorBuffer = this.createBuffer(gl.ARRAY_BUFFER, this.colors);
	},
	
	setShaderLocations: function(){
		var gl = this.gl,
			shader = this.shader;
	
		shader.attribLocation('aVertexPosition');
		shader.attribLocation('aVertexColor');
		
		shader.uniformLocation('uPMatrix');
		shader.uniformLocation('uMVMatrix');
	},
	
	draw: function(){
		if(!this.initialized) return;
		
		var gl = this.gl,
			shader = this.shader;
		
		shader.use();
		
		shader.attribPointer3f(shader.aVertexPosition, this.triangleVertexPositionBuffer);
		shader.attribPointer4f(shader.aVertexColor, this.triangleVertexColorBuffer);
		
		shader.uniformMatrix4fv(shader.uPMatrix, this.pMatrix);
        shader.uniformMatrix4fv(shader.uMVMatrix, this.mvMatrix);
		
		shader.drawArrays(gl.TRIANGLES, 0, 3);
	}
});