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
 * @class mgl.SmdReader
 * Studiomdl SMD reader class
 * @constructor
 * @param {String} data SMD file data
 */
mgl.SmdReader = function(data){
	var lines = data.split('\r\n');
	
	if(lines[0] != 'version 1')
		mgl.Console.error('Incorrect format: header must contain "version 1" string.');
		
	var nodes = [];
	var animationFrames = [];
	var materials = {};
	var links = [];
	
	var triangles = 0;
	for(var i = 1, length = lines.length; i < length; i++){
		if(lines[i] == 'triangles')
			while(lines[++i] != 'end'){
				triangles++;
				i+=3;
			}
	}
	
	var vertices = new Float32Array(triangles*9);
	var normals = new Float32Array(triangles*9);
	var texCoords = new Float32Array(triangles*6);
	var indices = new Uint16Array(triangles*3);

	var tmp, rs = /\s+/g, rf = /^\s+/g, frame, fr = /time\s+(\d+)/, j, triIndex = 0, verIndex = 0, lastMat, k, l;
	for(var i = 1, length = lines.length; i < length; i++){
		if(lines[i] == 'nodes'){
			while(lines[++i] != 'end'){
				tmp = lines[i].replace(rf, '').replace(rs, ' ').split(' ');
				
				nodes[parseInt(tmp[0])] = {name: tmp[1].replace('"', ''), parent: parseInt(tmp[2])};
			}
		}
		else if(lines[i] == 'skeleton'){
			while(lines[++i] != 'end'){
				tmp = fr.exec(lines[i]);
				frame = parseInt(tmp[1]);
				
				animationFrames[frame] = [];
				
				while(lines[i] != 'end' && !fr.test(lines[++i])){
					tmp = lines[i].replace(rf, '').replace(rs, ' ').split(' ');
					
					animationFrames[frame][tmp[0]] = {
						posX: parseFloat(tmp[1]),
						posY: parseFloat(tmp[2]),
						posZ: parseFloat(tmp[3]),
						rotX: parseFloat(tmp[4]),
						rotY: parseFloat(tmp[5]),
						rotZ: parseFloat(tmp[6])
					}
				}
				i--;
			}
			if(animationFrames[0].length < nodes.length){
				mgl.Console.error('Incorrect format: insufficient data for first frame.');
			}
		}
		else if(lines[i] == 'triangles'){
			while(lines[++i] != 'end'){
				if(!materials[lines[i]])
					materials[lines[i]] = [];
					
				if(lines[i] != lastMat)
					materials[lines[i]].push(triIndex);

				for(j = i+1, verIndex = triIndex*3; j < i + 4; j++, verIndex++){
					tmp = lines[j].replace(rf, '').replace(rs, ' ').split(' ');
					
					vertices[verIndex*3] = parseFloat(tmp[1]);
					vertices[verIndex*3+1] = parseFloat(tmp[2]);
					vertices[verIndex*3+2] = parseFloat(tmp[3]);
					
					normals[verIndex*3] = parseFloat(tmp[4]);
					normals[verIndex*3+1] = parseFloat(tmp[5]);
					normals[verIndex*3+2] = parseFloat(tmp[6]);
					
					texCoords[verIndex*2] = parseFloat(tmp[7]);
					texCoords[verIndex*2+1] = parseFloat(tmp[8]);

					indices[verIndex] = verIndex;
					
					links[verIndex] = [];
					for(k = 0, l = parseInt(tmp[9]); k < l; k++){
						links[verIndex].push({
							bone: parseInt(tmp[10+k*2]), 
							weight: parseFloat(tmp[11+k*2])
						});
					}
				}
				lastMat = lines[i];
				triIndex++;
				i+=3;
			}
		}
	}
	
	this.nodes = nodes;
	this.animationFrames = animationFrames;
	this.materials = materials;
	this.links = links;
	
	this.vertices = vertices;
	this.normals = normals;
	this.texCoords = texCoords;
	this.indices = indices;
}