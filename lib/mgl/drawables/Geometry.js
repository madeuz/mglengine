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
 * @class mgl.Geometry
 * Geometry class
 * @extends mgl.Drawable
 * @constructor
 */
mgl.Geometry = function(name){
	mgl.Drawable.prototype.constructor.call(this, name);
	
	this.frontface = 'ccw';
}
mgl.extend(mgl.Geometry, mgl.Drawable, {

//!	vertices: undefined,
//!	indices: undefined,
//!	normals: undefined,

//!	frontface: 'ccw',

//!	boundingBox: undefined,
//!	middlePoint: undefined,
//!	boundingSphere: undefined,

//! shader: undefined,

	/**
	 * Initializes WebGL context
	 * @param {WebGLRenderingContext} gl WebGL context
	 */
	init: function(gl){
		mgl.Drawable.prototype.init.call(this, gl);
	},

	/**
	 * Creates WebGL buffer
	 * @param {GLenum} type Buffer type
	 * @param {Mixed} data Data to store in buffer
	 * @returns {WebGLBuffer} WebGL buffer object
	 */
	createBuffer: function(type, data, drawType){
		var gl = this.gl;
		var buffer = gl.createBuffer();
		
		gl.bindBuffer(type, buffer);
		gl.bufferData(type, data, drawType || gl.STATIC_DRAW);
				
		return buffer;
	},
	
	calculateNormals: function(){
		var vertices = this.vertices, 
			indices = this.indices,
			normals = new Float32Array(this.vertices.length),
			v0, v1, v2, 
			a = vec3.create(),
			b = vec3.create(),
			normal = vec3.create();
			
		for(var i = 0, length = indices.length; i < length; i += 3){
		   v0 = vertices.subarray(indices[i] * 3, indices[i] * 3 + 9);
		   v1 = vertices.subarray(indices[i+1] * 3, indices[i+1] * 3 + 9);
		   v2 = vertices.subarray(indices[i+2] * 3, indices[i+2] * 3 + 9);

		   vec3.subtract(v1, v0, a);
		   vec3.subtract(v2, v0, b);
		   vec3.cross(a, b, normal);
		   vec3.normalize(normal);

		   vec3.add(normals.subarray(indices[i] * 3, indices[i] * 3 + 9), normal);
		   vec3.add(normals.subarray(indices[i+1] * 3, indices[i+1] * 3 + 9), normal);
		   vec3.add(normals.subarray(indices[i+2] * 3, indices[i+2] * 3 + 9), normal);
		}
		
		for(var i = 0, length = normals.length; i < length; i += 3){
			vec3.normalize(normals.subarray(i, i + 3));
		}
		
		this.normals = normals;
	},

	getBoundingBox: function(){
		if(!this.boundingBox)
			this.computeBoundingBox();
		return this.boundingBox;
	},
	
	getMiddlePoint: function(){
		if(!this.middlePoint)
			this.computeMiddlePoint();
		return this.middlePoint;
	},
	
	getBoundingSphere: function(){
		if(!this.boundingSphere)
			this.computeBoundingSphere();
		return this.boundingSphere;
	},	
	
	computeBoundingBox: function(){
		if(!this.vertices) return;

		this.boundingBox = { 
			x: [this.vertices[0], this.vertices[0]],
			y: [this.vertices[1], this.vertices[1]],
			z: [this.vertices[2], this.vertices[2]] 
		};

		for(var i = 3, length = this.vertices.length / 3; i < length; i+=3){

			if(this.vertices[i] < this.boundingBox.x[0]){
				this.boundingBox.x[0] = this.vertices[i];
			} 
			else if(this.vertices[i] > this.boundingBox.x[1]){
				this.boundingBox.x[1] = this.vertices[i];
			}

			if(this.vertices[i+1] < this.boundingBox.y[0]){
				this.boundingBox.y[0] = this.vertices[i+1];
			} 
			else if(this.vertices[i+1] > this.boundingBox.y[1]){
				this.boundingBox.y[1] = this.vertices[i+1];
			}

			if(this.vertices[i+2] < this.boundingBox.z[0]){
				this.boundingBox.z[0] = this.vertices[i+2];
			} 
			else if(this.vertices[i+2] > this.boundingBox.z[1]){
				this.boundingBox.z[1] = this.vertices[i+2];
			}
		}
	},
	
	computeMiddlePoint: function(){
		if(!this.boundingBox)
			this.computeBoundingBox();
		
		this.middlePoint = new Float32Array([
			this.boundingBox.x[0] + (this.boundingBox.x[1] - this.boundingBox.x[0]) / 2,
			this.boundingBox.y[0] + (this.boundingBox.y[1] - this.boundingBox.y[0]) / 2,
			this.boundingBox.z[0] + (this.boundingBox.z[1] - this.boundingBox.z[0]) / 2
		]);
	},
	
	computeBoundingSphere: function(){
		if(!this.middlePoint)
			this.computeMiddlePoint();
			
		var radius = 0, 
			x = this.middlePoint[0],
			y = this.middlePoint[1],
			z = this.middlePoint[2];
		
		for(var i = 1, length = this.vertices.length / 3; i < length; i+=3){
			var vector = vec3.create(this.vertices[i] - x, this.vertices[i+1] - y, this.vertices[i+2] - z);
			radius = Math.max(radius, vector.length());
		}
		
		this.boundingSphere = { 
			origin: this.middlePoint,
			radius: radius 
		};
	}
});