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
 * @class mgl.Renderer
 * Renderer class
 * @constructor
 * @param {HTMLCanvasElement} canvas The canvas element
 */
mgl.Renderer = function(canvas, attributes){
	this.canvas = canvas;
	this.attributes = attributes;
	this.init();
}
mgl.extend(mgl.Renderer, {
	/**
	 * WebGL Rendering Context
	 * @type WebGLRenderingContext
	 */
//!	gl: undefined,
	
	/**
	 * Canvas element to draw
	 * @type HTMLCanvasElement
	 */
//!	canvas: undefined,

//! attributes: undefined,

	/**
	 * Scene object
	 * @type mgl.Scene
	 */
//!	scene: undefined,

	/**
	 * Current shader program
	 */
//! currentShader: undefined,

	/**
	 * Context inforamtions
	 */
	info: {},
	
	init: function(){
		this.gl = this.get3DContext(this.canvas, this.attributes);
		
		this.setInfo();
		
		this.createRequestAnimationFrame();		
		
		if (!this.gl) {  
			mgl.Console.error("Unable to initialize WebGL. Your browser may not support it.");
		}
	},
	
	/**
	 * Gets a webgl context.
	 * @param HTMLCanvasElement canvas The canvas element to get context from.
	 * @return WebGLRenderingContext The webgl context.
	 */
	get3DContext: function(canvas, attributs) {
		var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
		var context = null;
		for (var i = 0; i < names.length; ++i) {
			try {
				context = canvas.getContext(names[i], attributs);
			} catch(e) {}
			if (context) {
				break;
			}
		}
		return context;
	},
	
	setScene: function(scene){
		scene.init(this.gl);
		this.scene = scene;
	},
	
	drawScene: function(){
		this.scene.draw();
	},
	
	afterDraw: function(){},
	
	animate: function(){
		this.drawScene();
		this.afterDraw();
		window.requestAnimationFrame(this.animate.bind(this));
	},
	
	setInfo: function(){
		var gl = this.gl;
		mgl.Renderer.info = {
			cacheSize: 32,	//how to get it?
			vendor: gl.getParameter(gl.VENDOR),
			version: gl.getParameter(gl.VERSION),
			renderer: gl.getParameter(gl.RENDERER),
			shading_language_version: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
			red_bits: gl.getParameter(gl.RED_BITS),
			green_bits: gl.getParameter(gl.GREEN_BITS),
			blue_bits: gl.getParameter(gl.BLUE_BITS),
			alpha_bits: gl.getParameter(gl.ALPHA_BITS),
			depth_bits: gl.getParameter(gl.DEPTH_BITS),
			max_vertex_attribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
			max_vertex_texture_image_units: gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
			max_varying_vectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
			max_vertex_uniform_vectors: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
			max_combined_texture_image_units: gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
			max_texture_size: gl.getParameter(gl.MAX_TEXTURE_SIZE),
			max_cube_map_texture_size: gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
			max_renderbuffer_size: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
			max_viewport_dims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
			aliased_line_width_range: gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE),
			aliased_point_size_range: gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE),
			supported_extensions: gl.getSupportedExtensions()
		}
	},
	
	/**
	 * Provides requestAnimationFrame in a cross browser way.
	 */	
	createRequestAnimationFrame: function(){
		window.requestAnimationFrame = (function() {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
					window.setTimeout(callback, 1000/60);
				};
		})();
	}
});