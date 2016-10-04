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
 * @class mgl.Loader
 * Loader class
 * @extends mgl.Observable
 * @constructor
 */
mgl.Loader = function(){
	mgl.Observable.prototype.constructor.call(this);
}
mgl.extend(mgl.Loader, mgl.Observable, {

	sharedShaders: {},
	
	loadImage: function(url){
		mgl.Console.message('loading image file: ' + url.split('/').pop());
		var image = new Image();
		var self = this;
		image.onload = function(){ 
			self.fireEvent('load', image);
		}
		image.src = url;
	},
	
	loadTextFile: function(url){
		mgl.Console.message('loading text file: ' + url.split('/').pop());
		var xhr = new XMLHttpRequest();
		var self = this;
		xhr.onreadystatechange=function(){
			if(xhr.readyState == 4 && xhr.status == 200){
				self.fireEvent('load', xhr.responseText);
			}
		}
		xhr.open('GET', url, true);
		xhr.send();
	},
	
	loadBinaryFile: function(url){
		mgl.Console.message('loading binary file: ' + url.split('/').pop());
		var xhr = new XMLHttpRequest();
		var self = this;
		xhr.onreadystatechange=function(){
			if(xhr.readyState == 4 && xhr.status == 200){
				self.fireEvent('load', xhr.responseText);
			}
		}
		xhr.open('GET', url, true);
		xhr.overrideMimeType('text\/plain; charset=x-user-defined');  
		xhr.send();
	},
	
	loadTexture: function(path){
		
	},
	
	loadShader: function(shaderName, shared){
		if(this.sharedShaders[shaderName] && this.sharedShaders[shaderName] != 'loading'){
			this.fireEvent('load', this.sharedShaders[shaderName]);
		}
		else if(this.sharedShaders[shaderName] == 'loading'){
			var self = this;
			var check = {}
			check.fn = function(){
				if(self.sharedShaders[shaderName] != 'loading')
					self.fireEvent('load', self.sharedShaders[shaderName]);
				else
					setTimeout(check.fn, 100);
			}
			setTimeout(check.fn, 100);
		} else {
			mgl.Console.message('loading shader source file: ' + shaderName);
			this.sharedShaders[shaderName] = 'loading';
			var xhr = new XMLHttpRequest();
			var self = this;
			xhr.onreadystatechange=function(){
				if(xhr.readyState == 4 && xhr.status == 200){
				
					var vertexRegExp = /[\u0000-\uffff]*?\/\/!vertex([\u0000-\uffff]+?)\/\/!/gim;
					var vertexSource = vertexRegExp.exec(xhr.responseText)[1] || null;
					var fragmentRegExp = /[\u0000-\uffff]*?\/\/!fragment([\u0000-\uffff]+)/gim;
					var fragmentSource = fragmentRegExp.exec(xhr.responseText)[1] || null;
					
					var shader = new mgl.Shader(vertexSource, fragmentSource, shaderName);
					
					self.sharedShaders[shaderName] = shader;
								
					self.fireEvent('load', shader);
				}
			}
			xhr.open('GET', mgl.shaderPath + shaderName + '.glsl', true);
			xhr.send();
		}
	}
});