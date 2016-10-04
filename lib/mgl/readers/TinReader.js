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
 * @class mgl.TinReader
 * TIN reader class
 * @constructor
 * @param {String} data TIN file data
 */
mgl.TinReader = function(data){
	var lines = data.split('\n');
	
	
	
	var triBuff = [];
	for(var i = 1, length = lines.length; i < length; i++){
		var d = lines[i].split(';');
		var triIndex = parseInt(d[8]);
		
		var x = parseFloat(d[2].replace(',','.'));
		var y = parseFloat(d[4].replace(',','.'));
		var z = parseFloat(d[3].replace(',','.'));
		
		if(triBuff[triIndex])
			triBuff[triIndex].push([x,y,z]);
		else
			triBuff[triIndex] = [[x,y,z]];
	}
	
	var i = 0;
	triBuff.forEach(function(el){
		if(el.length < 3) return;
		i++;
	});
	
	var iNum = i*3;
	var vertices = new Float32Array(iNum*3);
	var texCoords = new Float32Array(iNum*2);
	var indices = new Uint16Array(iNum);
	
	var k = 0;
	var l = 0;
	var m = 0;
	triBuff.forEach(function(el){
		if(el.length < 3) return;
		indices[k] = k;
		indices[k+1] = k+1;
		indices[k+2] = k+2;
		
		texCoords[l] = 0;
		texCoords[l+1] = 1;
		texCoords[l+2] = 0;
		texCoords[l+3] = 1;
		texCoords[l+4] = 0;
		texCoords[l+5] = 1;
		
		vertices[m] = el[0][0];
		vertices[m+1] = el[0][1];
		vertices[m+2] = el[0][2];
		vertices[m+3] = el[1][0];
		vertices[m+4] = el[1][1];
		vertices[m+5] = el[1][2];
		vertices[m+6] = el[2][0];
		vertices[m+7] = el[2][1];
		vertices[m+8] = el[2][2];
		
		k+=3;
		l+=6;
		m+=9;
	});
	
	this.vertices = vertices;
	this.texCoords = texCoords;
	this.indices = indices;
}