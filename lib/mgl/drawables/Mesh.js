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
 * @class mgl.Mesh
 * Mesh class
 * @extends mgl.Geometry
 * @constructor
 */
mgl.Mesh = function(id){
	mgl.Geometry.prototype.constructor.call(this, id);
	
	this.normalMatrix = mat3.create();
}
mgl.extend(mgl.Mesh, mgl.Geometry, {

	shaderName: 'per-vertex-lighting-directional',
	
//!	texCoords: undefined,
//!	textureUrl: undefined,

//!	ambientColor: undefined,
//!	lightingDirection: undefined,
//!	directionalColor: undefined,

//!	instances: undefined,

	//private
//!	vertexBuffer: undefined,
//!	indexBuffer: undefined,
//!	normalBuffer: undefined,
//!	texCoordBuffer: undefined,
//!	texture: undefined,
//!	normalMatrix: undefined,
		
	init: function(gl){
		mgl.Geometry.prototype.init.call(this, gl);
				
		var loader = new mgl.Loader();
		
		loader.on('load', function(shader){
			this.shader = shader;
			if(!shader.initialized){
				shader.init(gl);
				this.setShaderLocations();
			}
			this.initData();
		},
		this);
		loader.loadShader(this.shaderName);
	},
	
	initData: function(){
		this.createBuffers();
		this.initTexture();
		
		this.initialized = true;
	},
	
	createBuffers: function(){
		var gl = this.gl;
		
		//create buffers
		this.vertexBuffer = this.createBuffer(gl.ARRAY_BUFFER, this.vertices);
		this.normalBuffer = this.createBuffer(gl.ARRAY_BUFFER, this.normals);
		this.texCoordBuffer = this.createBuffer(gl.ARRAY_BUFFER, this.texCoords);
		this.indexBuffer = this.createBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
	},
	
	initTexture: function(){
		var gl = this.gl;
		
		this.texture = new mgl.Texture2D(gl, {
			url: this.textureUrl,
			element: this.textureElement,
			flipY: true,
			format: gl.RGBA,
			type: gl.UNSIGNED_BYTE,
			mipmaps: true,
			mag_filter: gl.LINEAR,
			min_filter: gl.LINEAR_MIPMAP_NEAREST
		});
    },
	
	setShaderLocations: function(){
		var shader = this.shader;
	
		shader.attribLocation('aVertexPosition');
		shader.attribLocation('aVertexNormal');
		shader.attribLocation('aTextureCoord');
		
		shader.uniformLocation('uPMatrix');
		shader.uniformLocation('uMVMatrix');
		shader.uniformLocation('uNMatrix');
		shader.uniformLocation('uSampler');
		shader.uniformLocation('uAmbientColor');
		shader.uniformLocation('uLightingDirection');
		shader.uniformLocation('uDirectionalColor');
	},
	
	draw: function(){
		if(!this.initialized) return;
	
		var gl = this.gl,
			shader = this.shader;
			
		shader.use();
		
		//texture
		this.texture.bind(0);
        gl.uniform1i(shader.uSampler, 0);

		//attribs
		shader.attribPointer3f(shader.aVertexPosition, this.vertexBuffer);
		shader.attribPointer3f(shader.aVertexNormal, this.normalBuffer);
		shader.attribPointer2f(shader.aTextureCoord, this.texCoordBuffer);
		
		//uniforms
		shader.uniform3fv(shader.uAmbientColor, this.ambientColor.RGB());
		shader.uniform3fv(shader.uLightingDirection, this.lightingDirection);
		shader.uniform3fv(shader.uDirectionalColor, this.directionalColor.RGB());
		
		shader.uniformMatrix4fv(shader.uPMatrix, this.pMatrix);
				
		if(this.instances){
			for(var i = 0; i < this.instances.length; i++){
				mat4.identity(this.mvMatrix);
				
				if(this.instances[i].scale)
					this.scale(this.instances[i].scale);
				
				if(this.instances[i].rotation)
					this.rotate(this.instances[i].rotation.angle, this.instances[i].rotation.axis);
				
				if(this.instances[i].translation)
					this.translate(this.instances[i].translation);
													
				shader.uniformMatrix4fv(shader.uMVMatrix, this.mvMatrix);
				
				mat4.toInverseMat3(this.mvMatrix, this.normalMatrix);
				mat3.transpose(this.normalMatrix);
				shader.uniformMatrix3fv(shader.uNMatrix, this.normalMatrix);
				
				gl.frontFace(this.instances[i].frontface == 'cw' ? gl.CW : gl.CCW);
				
				shader.drawElements(gl.TRIANGLES, this.indexBuffer, this.indices.length);
			}
		} 
		else {
			shader.uniformMatrix4fv(shader.uMVMatrix, this.mvMatrix);
			
			mat4.toInverseMat3(this.mvMatrix, this.normalMatrix);
			mat3.transpose(this.normalMatrix);
			shader.uniformMatrix3fv(shader.uNMatrix, this.normalMatrix);
			
			gl.frontFace(this.frontface == 'cw' ? gl.CW : gl.CCW);
			gl.disable(gl.CULL_FACE);
			
			shader.drawElements(gl.TRIANGLES, this.indexBuffer, this.indices.length);
		}
	}
});