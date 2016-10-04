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
 * @class mgl.Terrain
 * Terrain class
 * @extends mgl.Geometry
 * @constructor
 */
mgl.Terrain = function(config){
	mgl.Geometry.prototype.constructor.call(this, config && config.id);
	
	this.dimension = config && config.dimension || 127;
	this.clipmapLevels = config && config.clipmapLevels || 4;
	this.blockSize = (this.dimension + 1) / 4;
	
	this.normalMatrix = mat3.create();
	
	this.createFineBlock();
	this.createOffsets();
	this.createBlockMxM();
	this.createBlockMx3();
	this.createBlock3xM();
	this.createBlockMx1();
	this.createDegenerates();
}
mgl.extend(mgl.Terrain, mgl.Geometry, {
	
	/**
	 * @integer number of clipmap levels to generate (default value: 5) <br />
	 * more about method at <a href="http://http.developer.nvidia.com/GPUGems2/gpugems2_chapter02.html">GPUGems2 chapter 2</a>
	 */
//!	clipmapLevels: 5,
	
//!	dimension: 127,

//!	heightMapUrl: undefined,
//!	heightScale: undefined,

//!	lowTextureUrl: undefined,
//!	middleTextureUrl: undefined,
//!	highTextureUrl: undefined,
//! textureScales: undefined,
//! textureRanges: undefined,

//! residualTextureUrl: undefined,
	
	//private
	shaderName: 'per-vertex-lighting-directional-terrain',
	
//!	blockSize: undefined,

//!	mxmOffsets: undefined,
//!	mx3Offsets: undefined,
//!	m3xmOffsets: undefined,

//!	fineVdata: undefined,
//!	fineIdata: undefined,	
//!	mxmVdata: undefined,
//!	mxmIdata: undefined,
//!	mx3Vdata: undefined,
//!	mx3Idata: undefined,
//!	m3xmVdata: undefined,
//!	m3xmIdata: undefined,
//!	mx1Vdata: undefined,
//!	mx1Idata: undefined,
//!	degVdata: undefined,
//!	degIdata: undefined,

//!	fineVbo: undefined,
//!	fineIbo: undefined,	
//!	mxmVbo: undefined,
//!	mxmIbo: undefined,
//!	mx3Vbo: undefined,
//!	mx3Ibo: undefined,
//!	m3xmVbo: undefined,
//!	m3xmIbo: undefined,
//!	mx1Vbo: undefined,
//!	mx1Ibo: undefined,
//!	degVbo: undefined,
//!	degIbo: undefined,

//!	lowTexture: undefined,
//!	middleTexture: undefined,
//!	highTexture: undefined,
//!	residualTexture: undefined,

//!	normalTexture: undefined,
//! normalFramebuffer: undefined,
	
	init: function(gl){
		mgl.Drawable.prototype.init.call(this, gl);
		
		var loader = new mgl.Loader();
		
		loader.on('load', function(shader){//////////////////////////////////////////write shader load() method
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
	
	setHeightMapImage: function(image){
		this.heightMapImage = image;
	},
	
	setHeightMapData: function(image){
		var context = document
			.createElement('canvas')
			.setAttribute('width', this.dimension)
			.setAttribute('height', this.dimension)
			.getContext('2d');
			
		context.drawImage(image, 0, 0);
		this.heightMapData = context.getImageData(0, 0, this.dimension, this.dimension).data;
	},
	
	initData: function(){
		this.createBuffers();
		this.initElevation();
		this.initTextures();
	},
	
	createBuffers: function(){
		var gl = this.gl;
		
		//create buffers
		this.fineVbo = this.createBuffer(gl.ARRAY_BUFFER, this.fineVdata);///////////////////////////write mgl.Buffer class
		this.fineIbo = this.createBuffer(gl.ELEMENT_ARRAY_BUFFER, this.fineIdata);
		
		this.mxmVbo = this.createBuffer(gl.ARRAY_BUFFER, this.mxmVdata);
		this.mxmIbo = this.createBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mxmIdata);
		
		this.mx3Vbo = this.createBuffer(gl.ARRAY_BUFFER, this.mx3Vdata);
		this.mx3Ibo = this.createBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mx3Idata);
		
		this.m3xmVbo = this.createBuffer(gl.ARRAY_BUFFER, this.m3xmVdata);
		this.m3xmIbo = this.createBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m3xmIdata);
		
		this.mx1Vbo = this.createBuffer(gl.ARRAY_BUFFER, this.mx1Vdata);
		this.mx1Ibo = this.createBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mx1Idata);
		
		this.degVbo = this.createBuffer(gl.ARRAY_BUFFER, this.degVdata);
		this.degIbo = this.createBuffer(gl.ELEMENT_ARRAY_BUFFER, this.degIdata);
	},
	
	initElevation: function(){
		var gl = this.gl;
		
		this.heightMapTexture = new mgl.Texture2D(gl, {
			url: this.heightMapUrl,
			format: gl.LUMINANCE,
			type: gl.UNSIGNED_BYTE,
			mag_filter: gl.NEAREST,
			min_filter: gl.NEAREST,
			wrap_s: gl.CLAMP_TO_EDGE,
			wrap_t: gl.CLAMP_TO_EDGE,
			onload: {
				fn: function(){
					this.initialized = true;
				}, 
				scope: this
			}
		});
	},
	
	initTextures: function(){
		var gl = this.gl;
		
		this.lowTexture = new mgl.Texture2D(gl, {
			url: this.lowTextureUrl,
			format: gl.RGB,
			type: gl.UNSIGNED_BYTE,
			mipmaps: true,
			mag_filter: gl.LINEAR,
			min_filter: gl.LINEAR_MIPMAP_NEAREST,
		});
		
		this.middleTexture = new mgl.Texture2D(gl, {
			url: this.middleTextureUrl,
			format: gl.RGB,
			type: gl.UNSIGNED_BYTE,
			mipmaps: true,
			mag_filter: gl.LINEAR,
			min_filter: gl.LINEAR_MIPMAP_NEAREST
		});
		
		this.highTexture = new mgl.Texture2D(gl, {
			url: this.highTextureUrl,
			format: gl.RGB,
			type: gl.UNSIGNED_BYTE,
			mipmaps: true,
			mag_filter: gl.LINEAR,
			min_filter: gl.LINEAR_MIPMAP_NEAREST
		});
		
		this.residualTexture = new mgl.Texture2D(gl, {
			url: this.residualTextureUrl,
			format: gl.RGB,
			type: gl.UNSIGNED_BYTE,
			mipmaps: true,
			mag_filter: gl.LINEAR,
			min_filter: gl.LINEAR_MIPMAP_NEAREST
		});
	},
	
	createFineBlock: function(){
		var m = this.blockSize;
		
		this.fineVdata = this.createVertexArray(m * 2, m * 2);
		this.fineIdata = this.createIndexArray(m * 2, m * 2);
	},
	
	createBlockMxM: function(){
		var m = this.blockSize;
		
		this.mxmVdata = this.createVertexArray(m, m);
		this.mxmIdata = this.createIndexArray(m, m);
	},
	
	createBlockMx3: function(){
		var m = this.blockSize;
	
		this.mx3Vdata = this.createVertexArray(m, 3);
		this.mx3Idata = this.createIndexArray(m, 3);
	},
	
	createBlock3xM: function(){
		var m = this.blockSize;
	
		this.m3xmVdata = this.createVertexArray(3, m);
		this.m3xmIdata = this.createIndexArray(3, m);
	},
	
	createBlockMx1: function(){
		var m = this.blockSize;
		
		var vboArray = new Float32Array( 16 * m );
		for(var y = -m + 1, r = 0, x, c; y < m + 2; y++, r++){
			for(x = m, c = 0; x < m + 2; x++, c++){
				vboArray[r * 4 + c * 2] = x;
				vboArray[r * 4 + c * 2 + 1] = y;
			}
		}
		
		var offset = (2 * m + 1) * 4;
		for(var x = m - 1, r = 0, y, c; x >= -m ; x--, r++){
			for(y = m, c = 0; y < m + 2; y++, c++){
				vboArray[offset + r * 4 + c * 2] = x;
				vboArray[offset + r * 4 + c * 2 + 1] = y;
			}
		}
		this.mx1Vdata = vboArray;
		
		this.indices = [];
		var indexNum = (8 * m - 2) * 3, idx = 0;
		for(var i = 0; i < 2 * m; i++, idx += 2){
			this.indices.push(idx, idx+2, idx+1, idx+2, idx+3, idx+1);
		}
		this.indices.push(idx, idx + 2, idx + 3, idx + 2, idx, idx - 2);
		idx+=2;
		for(var i = 0; i < 2 * m - 2; i++, idx += 2){
			this.indices.push(idx, idx+2, idx+1, idx+2, idx+3, idx+1);
		}
		this.mx1Idata = new Uint16Array(this.indices);
	},
	
	createDegenerates: function(){
		var m = this.blockSize;
		
		var vboArray = new Float32Array( 96*m-48 );
		for(var i = 0, x = -2*m+2; i < 4*m-2; i++, x++)
			vboArray.set([x, -2*m+2, x+1, -2*m+2, x+2, -2*m+2], i*6);
		var offset = i*6;
		for(var i = 0, x = -2*m+2; i < 4*m-2; i++, x++)
			vboArray.set([x+1, 2*m, x, 2*m, x+2, 2*m], i*6 + offset);
		offset += i*6;
		for(var i = 0, y = -2*m+2; i < 4*m-2; i++, y++)
			vboArray.set([-2*m+2, y+1, -2*m+2, y, -2*m+2, y+2], i*6 + offset);
		offset += i*6;
		for(var i = 0, y = -2*m+2; i < 4*m-2; i++, y++)
			vboArray.set([2*m, y, 2*m, y+1, 2*m, y+2], i*6 + offset);
			
		this.degVdata = vboArray;
		
		this.indices = [];
		for(var i = 0, idx = 0; i < 16*m-8; i++){
			this.indices.push(idx, idx + 1, idx + 2);
			idx += 3;
		}
		
		this.degIdata = new Uint16Array(this.indices);
	},
	
	createVertexArray: function(width, height){
		var vboArray = new Float32Array(width * height * 2);
		for(var i = 0, j; i < height; i++){
			for(j = 0; j < width; j++){
				vboArray[i * width * 2 + j * 2] = j;
				vboArray[i * width * 2 + j * 2 + 1] = i;
			}
		}
		return vboArray;
	},
	
	createIndexArray: function(width, height){
		this.indices = [];
		this.gridGen(0, width - 1, 0, height - 1, width, mgl.Renderer.info.cacheSize);
		return new Uint16Array(this.indices);
	},
	
	/**
	 * Optimal Grid Rendering
	 * Original at:
	 * http://www.ludicon.com/castano/blog/2009/02/optimal-grid-rendering/
	 */
	gridGen: function(x0, x1, y0, y1, width, cacheSize){
		if(x1 - x0 + 1 < cacheSize){
			if(2 * (x1 - x0) + 1 > cacheSize){
				for(var x = x0; x < x1; x++){
					this.indices.push(x + 0);
					this.indices.push(x + 0);
					this.indices.push(x + 1);
				}
			}

			for(var y = y0; y < y1; y++){
				for (var x = x0; x < x1; x++){
					this.indices.push(width * y + x);
					this.indices.push(width * (y + 1) + x);
					this.indices.push(width * y + x + 1);

					this.indices.push(width * y + x + 1);
					this.indices.push(width * (y + 1) + x);
					this.indices.push(width * (y + 1) + x + 1);
				}
			}
		}
		else {
			var xm = x0 + cacheSize - 2;
			this.gridGen(x0, xm, y0, y1, width, cacheSize);
			this.gridGen(xm, x1, y0, y1, width, cacheSize);
		}
	},
	
	createOffsets: function(){
		var m = this.blockSize - 1;
			
		this.mxmOffsets = [
			-2*m,-2*m,   -m,-2*m,   2,-2*m,   m+2,-2*m,
			-2*m,  -m,                        m+2,  -m,
			-2*m,   2,                        m+2,   2,
			-2*m, m+2,   -m, m+2,   2, m+2,   m+2,  m+2
		];
		
		this.mx3Offsets = [
			m+2, 0,   -2*m, 0, 
		];
		
		this.m3xmOffsets = [
			0, -2*m, 
			0, m+2
		];
	},
	
	setShaderLocations: function(){
		var shader = this.shader;
	
		shader.attribLocation('aVertexPosition');
		
		shader.uniformLocation('uMVMatrix');
		shader.uniformLocation('uPMatrix');
		
		shader.uniformLocation('uViewerPos');
				
		shader.uniformLocation('uScaleFactor');
		shader.uniformLocation('uFineBlockOrig');
		
		shader.uniformLocation('uElevationSampler');
		shader.uniformLocation('uZScaleFactor');
		
		shader.uniformLocation('uAmbientColor');
		shader.uniformLocation('uLightingDirection');
		shader.uniformLocation('uDirectionalColor');
		
		shader.uniformLocation('uLowSampler');
		shader.uniformLocation('uMiddleSampler');
		shader.uniformLocation('uHighSampler');
		shader.uniformLocation('uTextureScales');
		shader.uniformLocation('uTextureRanges');
		
		shader.uniformLocation('uResidualSampler');
	},
	
	draw: function(){
		if(!this.initialized) return;
	
		var gl = this.gl,
			shader = this.shader;
			
		shader.use();
		
		//elevation
		this.heightMapTexture.bind(0);
        gl.uniform1i(shader.uElevationSampler, 0);
		
		//textures
		this.lowTexture.bind(1);
		gl.uniform1i(shader.uLowSampler, 1);
		
		this.middleTexture.bind(2);
		gl.uniform1i(shader.uMiddleSampler, 2);
		
		this.highTexture.bind(3);
		gl.uniform1i(shader.uHighSampler, 3);
		
		this.residualTexture.bind(4);
		gl.uniform1i(shader.uResidualSampler, 4);
		
		gl.uniform4fv(shader.uTextureScales, this.textureScales);
		gl.uniform3fv(shader.uTextureRanges, this.textureRanges);
				
		//uniforms
		shader.uniform3fv(shader.uAmbientColor, this.ambientColor.RGB());
		shader.uniform3fv(shader.uLightingDirection, this.lightingDirection);
		shader.uniform3fv(shader.uDirectionalColor, this.directionalColor.RGB());
		
		shader.uniformMatrix4fv(shader.uPMatrix, this.pMatrix);
		shader.uniformMatrix4fv(shader.uMVMatrix, this.camMVMatrix);
		
		var m = mat4.create(this.camMVMatrix);
		mat4.inverse(m);
		shader.uniform2f(shader.uViewerPos, m[12], m[14]);
		shader.uniform1f(shader.uZScaleFactor, this.heightScale);
				
		//finest level
		var width = this.heightMapTexture.width, height = this.heightMapTexture.height;
		
		shader.attribPointer2f(shader.aVertexPosition, this.fineVbo);
		
		shader.uniform4f(shader.uScaleFactor, 1, 1, -this.blockSize + 1, -this.blockSize + 1);
		
		shader.uniform4f(shader.uFineBlockOrig, width, height, 
			width / 2 - this.blockSize + 1, height / 2 - this.blockSize + 1);
			
		shader.drawElements(gl.TRIANGLES, this.fineIbo, this.fineIdata.length);

		//clipmap levels
		var i, scale = 1;
		for(var lvl = 1; lvl <= this.clipmapLevels; lvl++){
						
			//drawing MxM blocks
			shader.attribPointer2f(shader.aVertexPosition, this.mxmVbo);
			
			for(i = 0; i < 24; i += 2){
			
				shader.uniform4f(shader.uScaleFactor, scale, scale, this.mxmOffsets[i], this.mxmOffsets[i+1]);
				
				shader.uniform4f(shader.uFineBlockOrig, width, height,
					width / 2 + this.mxmOffsets[i] * scale, height / 2 + this.mxmOffsets[i+1] * scale);
					
				shader.drawElements(gl.TRIANGLES, this.mxmIbo, this.mxmIdata.length);
			}
			
			//drawing Mx3 blocks
			shader.attribPointer2f(shader.aVertexPosition, this.mx3Vbo);
			
			for(i = 0; i < 4; i += 2){
			
				shader.uniform4f(shader.uScaleFactor, scale, scale, this.mx3Offsets[i], this.mx3Offsets[i+1]);
				
				shader.uniform4f(shader.uFineBlockOrig, width, height,
					width / 2 + this.mx3Offsets[i] * scale, height / 2 + this.mx3Offsets[i+1] * scale);
				
				shader.drawElements(gl.TRIANGLES, this.mx3Ibo, this.mx3Idata.length);
			}
			
			//drawing 3xM blocks
			shader.attribPointer2f(shader.aVertexPosition, this.m3xmVbo);
			
			for(i = 0; i < 4; i += 2){
				shader.uniform4f(shader.uScaleFactor, scale, scale, this.m3xmOffsets[i], this.m3xmOffsets[i+1]);
				
				shader.uniform4f(shader.uFineBlockOrig, width, height,
					width / 2 + this.m3xmOffsets[i] * scale, height / 2 + this.m3xmOffsets[i+1] * scale);
				
				shader.drawElements(gl.TRIANGLES, this.m3xmIbo, this.m3xmIdata.length);
			}
			
			//interior trim
			shader.attribPointer2f(shader.aVertexPosition, this.mx1Vbo);
			shader.uniform4f(shader.uScaleFactor, scale, scale, 0, 0);
			shader.uniform4f(shader.uFineBlockOrig, width, height,
					width / 2 , height / 2 );
			
			shader.drawElements(gl.TRIANGLES, this.mx1Ibo, this.mx1Idata.length);
			
			
			//degenerate triangles
			shader.attribPointer2f(shader.aVertexPosition, this.degVbo);
			shader.uniform4f(shader.uScaleFactor, scale, scale, 0, 0);
			shader.uniform4f(shader.uFineBlockOrig, width, height,
					width / 2 , height / 2 );
					
			shader.drawElements(gl.TRIANGLES, this.degIbo, this.degIdata.length);
	
	
			scale *= 2;
		}
	}
});