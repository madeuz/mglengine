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
 * @class mgl.Drawable
 * Drawable class
 * @extends mgl.Observable
 * @constructor
 */
mgl.Drawable = function(id){
	mgl.Observable.prototype.constructor.call(this);
	
	this.mvMatrix = mat4.create();
	mat4.identity(this.mvMatrix);
	
	this.id = id || 'drawable-' + mgl.createId();
	
	this.initialized = false;
}
mgl.extend(mgl.Drawable, mgl.Observable, {


//!	id: undefined;

	/**
	 * WebGL Rendering Context
	 * @type WebGLRenderingContext
	 */
//!	gl: undefined,
	
	/**
	 * Projection matrix. It is usually set by camera.
	 * @type mat4
	 */
//!	pMatrix: undefined,

	/**
	 * Camera transform matrix. It is usually set by camera.
	 * @type mat4
	 */
//!	camMVMatrix: undefined,

	/**
	 * Model-view matrix
	 * @type mat4
	 */
//!	mvMatrix: undefined,
		
	initialized: false,
		
	/**
	 * Initializes WebGL context
	 * @param {WebGLRenderingContext} gl WebGL context
	 */
	init: function(gl){
		this.gl = gl;
		mgl.Console.message('initializing object: ' + this.id);
	},
	
	/**
	 * Draws object
	 */
	draw: function(){},
	
	/**
	 * Clears shaders, buffers and other stuff
	 */
	clear: function(){},
	
	resetMV: function(){
		mat4.identity(this.mvMatrix);
	},
	
	translate: function(vector){
		mat4.translate(this.mvMatrix, vector);
	},
	
	scale: function(vector){
		mat4.scale(this.mvMatrix, vector);
	},
	
	rotate: function(angle, axis){
		mat4.rotate(this.mvMatrix, angle, axis);
	},
	
	rotationX: 0,
	rotationY: 0,
	rotationZ: 0,
	
	rotateX: function(angle){
		this.rotationX+=angle;
		mat4.rotateX(this.mvMatrix, angle);
	},
	
	rotateY: function(angle){
		this.rotationY+=angle;
		mat4.rotateY(this.mvMatrix, angle);
	},
	
	rotateZ: function(angle){
		this.rotationZ+=angle;
		mat4.rotateZ(this.mvMatrix, angle);
	}
});