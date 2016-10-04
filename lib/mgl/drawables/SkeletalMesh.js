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
 * @class mgl.SkeletalMesh
 * SkeletalMesh class
 * @extends mgl.Mesh
 * @constructor
 */
mgl.SkeletalMesh = function(id){
	mgl.Mesh.prototype.constructor.call(this, id);
	
	this.animationSpeed = 0.5;
	this.currentAnimationFrame = .5;
}
mgl.extend(mgl.SkeletalMesh, mgl.Mesh, {

//!	skeleton: undefined;
//!	links: undefined;
//!	weights: undefined;
//!	bindPose: undefined;
//!	animation: undefined;

//!	linkBuffer: undefined;
//!	weightBuffer: undefined;

//!	bindPoseMatrices: undefined;

//!	animationData: undefined;

//! animationLength;
//! animationSpeed;
//! currentAnimationFrame;

//! animationTimeout;

	shaderName: 'per-vertex-lighting-directional-animation',
	
	init: function(gl){
		if( !gl.getExtension("OES_texture_float") ){
			mgl.Console.error('Extension OES_texture_float not supported.');
			return false;
		}
		
		mgl.Mesh.prototype.init.call(this, gl);		
	},
	
	initData: function(){
		this.createBuffers();
		this.createAnimationBuffer();
		this.initTexture();
		
		this.animationLength = this.animation.data.length;
		
		this.initialized = true;
	},
	
	animFn: function(){
		if(this.currentAnimationFrame >= this.animationLength - 1.5)
			this.currentAnimationFrame = .5;
		else
			this.currentAnimationFrame += this.animationSpeed;
	},
	
	createAnimationBuffer: function(){
		if(mgl.ResourceManager.hasBuffer(this.animation.name)){
			this.animationBuffer = mgl.ResourceManager.getBuffer(this.animation.name);
			return;
		}
		
		//create animation buffers
		var width = mgl.Math.closestPowerOf2(this.animation.data[0].length * 4);
		var height = mgl.Math.closestPowerOf2(this.animation.data.length);
		
		var posBuffer = new Float32Array(width * height);
		var quatBuffer = new Float32Array(width * height);
		
		for(var i = 0, length = this.animation.data.length, j,nodes, n; i < length; i++){
			for(j = 0, nodes = this.skeleton.length; j < nodes; j++){
				n = this.animation.data[i][j];
				posBuffer.set([n.pos[0], n.pos[1], n.pos[2]], i * width + j * 4);
				quatBuffer.set([n.quat[0], n.quat[1], n.quat[2], n.quat[3]], i * width + j * 4);
			}
		}
		
		//create bind pose matrices
		this.calculateBindPose();
		
		//create bind pose buffer
		var heightBind = mgl.Math.closestPowerOf2(this.skeleton.length);
		var bindBuffer = new Float32Array(16 * heightBind);
		bindBuffer.set(this.bindPoseMatrices);
		
		var gl = this.gl;
		
		//create textures /////////////////////////////// SHOULD BE IN SOME INIT TO MAINTAIN CONTEXT LOST EVENT
		var posTexture = new mgl.Texture2D(gl, {
			data: posBuffer,
			unpack_alignment: 1,
			width: width/4, 
			height: height,
			type: gl.FLOAT,
			mag_filter: gl.NEAREST,
			min_filter: gl.NEAREST
		});
		
		var quatTexture = new mgl.Texture2D(gl, {
			data: quatBuffer,
			unpack_alignment: 1,
			width: width/4, 
			height: height,
			type: gl.FLOAT,
			mag_filter: gl.NEAREST,
			min_filter: gl.NEAREST
		});
		
		var bindTexture = new mgl.Texture2D(gl, {
			data: bindBuffer,
			unpack_alignment: 1,
			width: 4, 
			height: heightBind,
			type: gl.FLOAT,
			mag_filter: gl.NEAREST,
			min_filter: gl.NEAREST
		});
		
		this.animationBuffer = {
			posBuffer: posBuffer,
			quatBuffer: quatBuffer,
			bindBuffer: bindBuffer,
			posTexture: posTexture,
			quatTexture: quatTexture,
			bindTexture: bindTexture,
			width: width/4,
			height: height,
			heightBind: heightBind
		}
		
		mgl.ResourceManager.setBuffer(this.animation.name, this.animationBuffer);
	},
	
	calculateBindPose: function(){
		if(mgl.ResourceManager.hasBuffer(this.name+'_bindPose')){
			this.bindPoseMatrices = mgl.ResourceManager.getBuffer(this.name+'_bindPose');
			return;
		}
	
		var bindPoseMatrices = [];
		var m, p, q, q2;
		for(var i = 0, length = this.bindPose.length; i < length; i++){
			p = this.bindPose[i].pos;
			q = this.bindPose[i].quat;
			q2 = quat4.create([q[0]*q[0], q[1]*q[1], q[2]*q[2], q[3]*q[3]]);
			
			m = mat4.create([
				1-2*q2[1]-2*q2[2], 2*q[0]*q[1]-2*q[2]*q[3], 2*q[0]*q[2]+2*q[1]*q[3], 0,
				2*q[0]*q[1]+2*q[2]*q[3], 1-2*q2[0]-2*q2[2], 2*q[1]*q[2]-2*q[0]*q[3], 0,
				2*q[0]*q[2]-2*q[1]*q[3], 2*q[1]*q[2]+2*q[0]*q[3], 1-2*q2[0]-2*q2[1], 0,
				p[0], p[1], p[2], 1
			]);
						
			var p = this.skeleton[i];
			if( p != -1)
				mat4.multiply(m, bindPoseMatrices[p]);
			
			bindPoseMatrices.push(m);
		}
		this.bindPoseMatrices = new Float32Array(this.bindPose.length * 16);
		for(var i = 0, length = this.bindPose.length; i < length; i++){
			mat4.inverse(bindPoseMatrices[i]);
			this.bindPoseMatrices.set(bindPoseMatrices[i], i*16);
		}
		mgl.ResourceManager.setBuffer(this.name+'_bindPose', this.bindPoseMatrices);
	},
	
	createBuffers: function(){
		mgl.Mesh.prototype.createBuffers.call(this);
		var gl = this.gl;
		
		//create buffers
		this.linkBuffer = this.createBuffer(gl.ARRAY_BUFFER, this.links);
		this.weightBuffer = this.createBuffer(gl.ARRAY_BUFFER, this.weights);
	},
	
	initTexture: function(){
		mgl.Mesh.prototype.initTexture.call(this);
    },
	
	setShaderLocations: function(){
		mgl.Mesh.prototype.setShaderLocations.call(this);
		
		var shader = this.shader;
	
		shader.attribLocation('aVertexLinks');
		shader.attribLocation('aVertexWeights');
		
		shader.uniformLocation('uTimescale');
		shader.uniformLocation('uDataWidth');
		
		shader.uniformLocation({name: 'uSkeleton', length: this.skeleton.length});
		
		shader.uniformLocation('uAnimPos');
		shader.uniformLocation('uAnimQuat');
		shader.uniformLocation('uBindPose');
	},
	
	draw: function(){
		if(!this.initialized) return;
	
		var gl = this.gl,
			shader = this.shader;
		
		shader.use();
			
		//attribs
		shader.attribPointer3f(shader.aVertexPosition, this.vertexBuffer);
		shader.attribPointer3f(shader.aVertexNormal, this.normalBuffer);
		shader.attribPointer2f(shader.aTextureCoord, this.texCoordBuffer);
		shader.attribPointer4f(shader.aVertexLinks, this.linkBuffer);
		shader.attribPointer4f(shader.aVertexWeights, this.weightBuffer);
		
		//texture
		this.texture.bind(0);
        gl.uniform1i(shader.uSampler, 0);
				
		//animation
		var anim = this.animationBuffer;
		shader.uniform1f(shader.uTimescale, this.currentAnimationFrame / anim.height);
		shader.uniform3iv(shader.uDataWidth, [anim.width, anim.height, anim.heightBind]);
		
		for(var i = 0, length = this.skeleton.length; i < length; i++)
			shader.uniform1i(shader.uSkeleton[i], this.skeleton[i]);
		
        anim.posTexture.bind(1);
        gl.uniform1i(shader.uAnimPos, 1);
		
		anim.quatTexture.bind(2);
        gl.uniform1i(shader.uAnimQuat, 2);
		
		anim.bindTexture.bind(3);
        gl.uniform1i(shader.uBindPose, 3);

		//uniforms
		shader.uniform3fv(shader.uAmbientColor, this.ambientColor.RGB());
		shader.uniform3fv(shader.uLightingDirection, this.lightingDirection);
		shader.uniform3fv(shader.uDirectionalColor, this.directionalColor.RGB());
		
		shader.uniformMatrix4fv(shader.uPMatrix, this.pMatrix);
        shader.uniformMatrix4fv(shader.uMVMatrix, this.mvMatrix);
		
		mat4.toInverseMat3(this.mvMatrix, this.normalMatrix);
        mat3.transpose(this.normalMatrix);
		
		shader.uniformMatrix3fv(shader.uNMatrix, this.normalMatrix);
		
		shader.drawElements(gl.TRIANGLES, this.indexBuffer, this.indices.length);
	}
});