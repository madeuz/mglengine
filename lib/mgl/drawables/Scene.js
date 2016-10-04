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
 * @class mgl.Scene
 * Scene class
 * @extends mgl.Drawable
 * @constructor
 * @param {mgl.Camera} camera Camera object
 */
mgl.Scene = function(config){
	var id = config && config.id || 'scene-' + mgl.createId();
	mgl.Drawable.prototype.constructor.call(this, id);
	
	if(config.camera)
		this.setCamera(config.camera);
	
	if(config.background)
		this.background = config.background;
	
	this.clearBackground = config.clearBackground || true;
	this.depthTest = config.depthTest || true;
	this.blend = config.blend || true;
	
	this.drawables = [];
}
mgl.extend(mgl.Scene, mgl.Drawable, {
	
//!	camera: undefined,
//!	drawables: [],
//!	background: undefined,
//! clearBackground: true,
//!	depthTest: true,
//!	blend: true,
		
	init: function(gl){
		mgl.Drawable.prototype.init.call(this, gl);
	
		var gl = this.gl;
		
		if(this.background){
			var bg = this.background;
			gl.clearColor(bg.r, bg.g, bg.b, bg.a);
		}
		
		if(this.depthTest)
			gl.enable(gl.DEPTH_TEST);
		if(this.blend){
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
			gl.enable(gl.BLEND);
		}
		
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
		
		for(var i = 0, length = this.drawables.length; i < length; i++){
			this.drawables[i].init(gl);
		}
		
		this.initialized = true;
	},
	
	load: function(url){
		var pathArray = url.split('/');
		pathArray.pop();
		var path = pathArray.join('/');
		
		var	loader = new mgl.Loader();
		loader.on('load', function(data){
			var scenePackage = JSON.parse(data);
			
			var staticMeshPath = path;
			if(scenePackage.staticMeshPath)
				staticMeshPath += '/' + scenePackage.staticMeshPath;
			else
				staticMeshPath += '/StaticMesh';
			
			if(scenePackage.staticMesh){
				var mesh;
				for(var i = 0, length = scenePackage.staticMesh.length; i < length; i++){
					mesh = scenePackage.staticMesh[i];
					this.loadStaticMesh({
						name: mesh.name || scenePackage.name, 
						type: mesh.type || scenePackage.type,
						translation: mesh.translation || undefined,
						rotation: mesh.rotation || undefined,
						scale: mesh.scale || undefined,
						frontface: mesh.frontface || undefined,
						instances: mesh.instances || undefined,
						ambientColor: mesh.ambientColor || scenePackage.ambientColor,
						lightingDirection: mesh.lightingDirection || scenePackage.lightingDirection,
						directionalColor: mesh.directionalColor || scenePackage.directionalColor,
						textureUrl: mesh.textureUrl || scenePackage.textureUrl
					}, staticMeshPath);
				}
			}
		}, this);
		loader.loadTextFile(url);
	},
	
	loadStaticMesh: function(meshParams, path){
		if(meshParams.type == 'psk'){
			var loader = new mgl.Loader();
			loader.on('load', function(data){
				var reader = new mgl.PskReader(data);
				
				var mesh = new mgl.Mesh(meshParams.name);

				mesh.vertices = reader.vertices;
				mesh.texCoords = reader.texCoords;
				mesh.indices = reader.indices;
				
				mesh.calculateNormals();
				
				mesh.ambientColor = new mgl.Color(meshParams.ambientColor);
				mesh.lightingDirection = vec3.create(meshParams.lightingDirection);
				mesh.directionalColor = new mgl.Color(meshParams.directionalColor);
				
				mesh.textureUrl = meshParams.textureUrl;
				
				if(meshParams.frontface)
					mesh.frontface = meshParams.frontface;
				
				if(meshParams.scale)
					mesh.scale(meshParams.scale);
				
				if(meshParams.rotation)
					mesh.rotate(meshParams.rotation.angle, meshParams.rotation.axis);
				
				if(meshParams.translation)
					mesh.translate(meshParams.translation);
									
				if(meshParams.instances)
					mesh.instances = meshParams.instances;
										
				this.add(mesh);
				
			}, this);
			loader.loadBinaryFile((path || '') + '/' + meshParams.name + '.' + meshParams.type);
		}
	},
	
	draw: function(){
		var gl = this.gl;
        gl.clear( (this.clearBackground ? gl.COLOR_BUFFER_BIT : 0) | gl.DEPTH_BUFFER_BIT);
	
		for(var i = 0, length = this.drawables.length; i < length; i++){
			this.drawables[i].pMatrix = mat4.create();
			this.drawables[i].camMVMatrix = this.camera.mvMatrix;//do zmiany
			mat4.multiply(this.camera.mvMatrix, this.camera.pMatrix, this.drawables[i].pMatrix);
			this.drawables[i].draw();
		}
	},
	
	setBackground: function(color){
		var gl = this.gl, bg = this.bg = color;
		gl.clearColor(bg.r, bg.g, bg.b, bg.a);
	},
	
	setCamera: function(camera){
		mgl.Console.message('adding camera: ' + camera.id);
		this.camera = camera;
	},
		
	add: function(drawable){
		if(this.initialized && !drawable.initialized)
			drawable.init(this.gl);
			
		this.drawables.push(drawable);
	},
	
	remove: function(index){
		var drawable = this.drawables[index];
		this.drawables.splice(index,1);
		drawable.clear();
	}
});