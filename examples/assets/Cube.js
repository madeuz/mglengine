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
 * @class mgl.Cube
 * Cube sample class
 * @extends mgl.Mesh
 * @constructor
 * @param {Number} width Cube width
 * @param {Number} height Cube height
 * @param {Number} depth Cube depth
 * @param {String} texture Texture URL
 */
mgl.Cube = function(width, height, depth, texture){
	mgl.Mesh.prototype.constructor.call(this);
	
	this.vertices = new Float32Array([
		//front
		-width, -height, depth, 
		width, -height, depth, 
		width, height, depth, 
		-width, height, depth,
		//right
		width, -height, depth, 
		width, -height, -depth, 
		width, height, -depth, 
		width, height, depth, 
		//top
		-width, height, -depth, 
		width, height, -depth, 
		width, height, depth, 
		-width, height, depth, 
		//back
		width, -height, -depth, 
		-width, -height, -depth, 
		-width, height, -depth, 
		width, height, -depth,
		//left
		-width, -height, -depth,
		-width, -height, depth, 
		-width, height, depth, 
		-width, height, -depth,
		//bottom
		-width, -height, depth,
		width, -height, depth, 
		width, -height, -depth,
		-width, -height, -depth
	]);
	
	this.ambientColor = new mgl.Color('020202');
	this.lightingDirection = vec3.create([0.0, 0.0, 1.0]);
	this.directionalColor = new mgl.Color('cccccc');
	
	this.textureUrl = texture;
}
mgl.extend(mgl.Cube, mgl.Mesh, {
	indices: new Uint16Array([
		//front
		0, 1, 2,
		0, 2, 3, 
		//right
		4, 5, 6,
		4, 6, 7,
		//top
		8, 9, 10,
		8, 10, 11,
		//back
		12, 13, 14, 
		12, 14, 15,
		//left
		16, 17, 18,
		16, 18, 19,
		//bottom
		20, 21, 22,
		20, 22, 23
	]),
	
	normals: new Float32Array([
		//front
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		//right
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		//top
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		//back
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		//left
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		//bottom
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0
	]),
	
	texCoords: new Float32Array([
		//front
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		//right
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		//top
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		//back
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		//left
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		//bottom
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0
	])
});