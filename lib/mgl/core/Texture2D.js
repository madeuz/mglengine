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
mgl.Texture2D = function(gl, params){
	this.gl = gl;
	
	var params = params || {};
	
	this.id = params.id || 'texture-' + mgl.createId();
	
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, params.unpack_alignment || 4);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, params.flipY || false);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, params.premultiply_alpha || false);
	
	this.buffer = gl.createTexture();
	
	if(params.url)
		this.handleLoad(params);

	else if(params.data)
		this.handleData(params);

	else if(params.element)
		this.handleElement(params);
}
mgl.extend(mgl.Texture2D, {
	
//!	id: undefined;

	/**
	 * WebGL Rendering Context
	 * @type WebGLRenderingContext
	 */
//!	gl: undefined,

//!	image: undefined,

//! data: undefined,

//!	buffer: undefined,

//!	width: undefined,

//!	height: undefined,
	
	handleLoad: function(params){
		var gl = this.gl;
		
		var loader = new mgl.Loader();
		loader.on('load', function(image){

			this.image = image;
			
			this.width = image.width;
			this.height = image.height;
			
			gl.bindTexture(gl.TEXTURE_2D, this.buffer);
			
			gl.texImage2D(gl.TEXTURE_2D, 0, params.format || gl.RGBA, params.format || gl.RGBA, params.type || gl.UNSIGNED_BYTE, image);
			this.setParameters(params);
			
			gl.bindTexture(gl.TEXTURE_2D, null);
			
			if(params.onload)
				this.callOnLoad(params.onload);
		},
		this);
		loader.loadImage(params.url);
	},
	
	handleData: function(params){
		var gl = this.gl;
	
		gl.bindTexture(gl.TEXTURE_2D, this.buffer);
		
		this.width = params.width;
		this.height = params.height;
					
		gl.texImage2D(gl.TEXTURE_2D, 0, params.format || gl.RGBA, this.width, this.height, 
			0, params.format || gl.RGBA, params.type || gl.UNSIGNED_BYTE, params.data);
		this.setParameters(params);
		
		gl.bindTexture(gl.TEXTURE_2D, null);
		
		if(params.onload)
			this.callOnLoad(params.onload);
	},
	
	handleElement: function(params){
		var gl = this.gl,
			element = params.element;
		
		this.width = element.width;
		this.height = element.height;
						
		gl.bindTexture(gl.TEXTURE_2D, this.buffer);
		
		gl.texImage2D(gl.TEXTURE_2D, 0, params.format || gl.RGBA, 
			params.format || gl.RGBA, params.type || gl.UNSIGNED_BYTE, element);
		this.setParameters(params);
		
		gl.bindTexture(gl.TEXTURE_2D, null);
		
		if(params.onload)
			this.callOnLoad(params.onload);
	},
	
	setParameters: function(params){
		var gl = this.gl;
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, params.mag_filter || gl.NEAREST_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, params.min_filter || gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, params.wrap_s || gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, params.wrap_s || gl.REPEAT);
		
		if(params.mipmaps)
			gl.generateMipmap(gl.TEXTURE_2D);
	},

	getImage: function(){
		return this.image; // || create from data
	},
	
	getData: function(){
		return this.data; // || get from image
	},
	
	getBuffer: function(){
		return this.buffer;
	},
	
	bind: function(unit){
		var gl = this.gl;
		gl.activeTexture(gl.TEXTURE0 + unit);
		gl.bindTexture(gl.TEXTURE_2D, this.buffer);
	},
	
	callOnLoad: function(onload){
		if(typeof onload == 'function')
			onload();
		else if(onload.fn)
			onload.fn.call(onload.scope || this);
	}
});