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
 * @class mgl.Shader
 * Shader class
 * @constructor
 */
mgl.Shader = function(vSource, fSource, id){
	this.vShaderSource = vSource;
	this.fShaderSource = fSource;
	
	this.id = id || 'shader-' + mgl.createId();
	
	this.initialized = false;
}
mgl.extend(mgl.Shader, {

//!	id: undefined;

	/**
	 * WebGL Rendering Context
	 * @type WebGLRenderingContext
	 */
//!	gl: undefined,

	/**
	 * Vertex shader source
	 * @type String
	 */
//!	vShaderSource: undefined,

	/**
	 * Fragment shader source
	 * @type String
	 */
//!	fShaderSource: undefined,
	
	/**
	 * Vertex shader object
	 * @type WebGLShader
	 */
//!	vShader: undefined,

	/**
	 * Fragment shader object
	 * @type WebGLShader
	 */
//!	fShader: undefined,

	/**
	 * Shader program used to draw object
	 * @type WebGLProgram
	 */
//!	shaderProgram: undefined,
	
//!	initialized: false,

	init: function(gl){
		this.gl = gl;
		
		mgl.Console.message('compiling vertex shader: ' + this.id);
		this.vShader = this.compile(this.vShaderSource, gl.VERTEX_SHADER);
		
		mgl.Console.message('compiling fragment shader: ' + this.id);
		this.fShader = this.compile(this.fShaderSource, gl.FRAGMENT_SHADER);
		
		mgl.Console.message('linking shader program: ' + this.id);
		this.link();
				
		this.initialized = this;
	},
	
	use: function(){
		if(mgl.Renderer.currentShader != this){
			mgl.Renderer.currentShader = this;
			this.gl.useProgram(this.shaderProgram);
		}
	},
	
	load: function(name){
		
	},
	
	compile: function(source, type){
		var shader, gl = this.gl;
		
		shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			mgl.Console.error('shader ' + this.name + ' compile error: ' + gl.getShaderInfoLog(shader));
		}
		
		var hlsl = gl.getExtension("WEBGL_debug_shaders").getTranslatedShaderSource(shader);
		mgl.Console.error("Your shader's HLSL code:", hlsl);
		return shader;
	},
	
	link: function(){
		var gl = this.gl;
	
		var shaderProgram = this.shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, this.vShader);
		gl.attachShader(shaderProgram, this.fShader);
		gl.linkProgram(shaderProgram);
		
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			mgl.Console.error("Invalid shader : " + gl.getProgramInfoLog(shaderProgram));
			mgl.Console.error('shader ' + this.name + ' link error');
			gl.deleteProgram(shaderProgram);
		}
	},
	
	
	attribLocation: function(location){
		var gl = this.gl;
		this[location] = gl.getAttribLocation(this.shaderProgram, location);
		gl.enableVertexAttribArray(this[location]);
	},
	
	attrib1f: function(location, x){
		this.gl.vertexAttrib1f(location, x);
	},
	
	attrib1fv: function(location, values){
		this.gl.vertexAttrib1fv(location, values);
	},
	
	attrib2f: function(location, x, y){
		this.gl.vertexAttrib2f(location, x, y);
	},
	
	attrib2fv: function(location, values){
		this.gl.vertexAttrib12v(location, values);
	},
	
	attrib3f: function(location, x, y, z){
		this.gl.vertexAttrib3f(location, x, y, z);
	},
	
	attrib3fv: function(location, values){
		this.gl.vertexAttrib3fv(location, values);
	},
	
	attrib4f: function(location, x, y, z, w){
		this.gl.vertexAttrib4f(location, x, y, z, w);
	},
	
	attrib4fv: function(location, values){
		this.gl.vertexAttrib4fv(location, values);
	},
	
	attribPointer1f: function(location, buffer){
		var gl = this.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(location, 1, gl.FLOAT, false, 0, 0);
	},
	
	attribPointer2f: function(location, buffer){
		var gl = this.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
	},
	
	attribPointer3f: function(location, buffer){
		var gl = this.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
	},
	
	attribPointer4f: function(location, buffer){
		var gl = this.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(location, 4, gl.FLOAT, false, 0, 0);
	},
		
	uniformLocation: function(location){
		if(typeof location == 'string')
			this[location] = this.gl.getUniformLocation(this.shaderProgram, location);
		else if(typeof location == 'object'){
			this[location.name] = [];
			for(var i = 0; i < location.length; i++)
				this[location.name][i] = this.gl.getUniformLocation(this.shaderProgram, location.name+'['+i+']');
		}
	},
	
	uniform1f: function(location, x){
		this.gl.uniform1f(location, x);
	},
	
	uniform1fv: function(location, values){
		this.gl.uniform1fv(location, values);
	},
	
	uniform1i: function(location, x){
		this.gl.uniform1i(location, x);
	},
	
	uniform1iv: function(location, values){
		this.gl.uniform1iv(location, values);
	},
	
	uniform2f: function(location, x, y){
		this.gl.uniform2f(location, x, y);
	},
	
	uniform2fv: function(location, values){
		this.gl.uniform2fv(location, values);
	},
	
	uniform2i: function(location, x, y){
		this.gl.uniform2i(location, x, y);
	},
	
	uniform2iv: function(location, values){
		this.gl.uniform2iv(location, values);
	},
	
	uniform3f: function(location, x, y, z){
		this.gl.uniform3f(location, x, y, z);
	},
	
	uniform3fv: function(location, values){
		this.gl.uniform3fv(location, values);
	},
	
	uniform3i: function(location, x, y, z){
		this.gl.uniform3i(location, x, y, z);
	},
	
	uniform3iv: function(location, values){
		this.gl.uniform3iv(location, values);
	},
	
	uniform4f: function(location, x, y, z, w){
		this.gl.uniform4f(location, x, y, z, w);
	},
	
	uniform4fv: function(location, values){
		this.gl.uniform4fv(location, values);
	},
		
	uniform4i: function(location, x, y, z, w){
		this.gl.uniform4i(location, x, y, z, w);
	},
	
	uniform4iv: function(location, values){
		this.gl.uniform4iv(location, values);
	},
	
	uniformMatrix2fv: function(location, values){
		this.gl.uniformMatrix2fv(location, false, values);
	},
		
	uniformMatrix3fv: function(location, values){
		this.gl.uniformMatrix3fv(location, false, values);
	},
	
	uniformMatrix4fv: function(location, values){
		this.gl.uniformMatrix4fv(location, false, values);
	},
	
	drawArrays: function(mode, first, count){
		this.gl.drawArrays(mode, first, count);
	},
	
	drawElements: function(mode, buffer, count){
		var gl = this.gl;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
		gl.drawElements(mode, count, gl.UNSIGNED_SHORT, 0);
	},
	
	valueOf: function(){
		return true;
	}
});