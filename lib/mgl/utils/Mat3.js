/* 
 * glMatrix.js - High performance matrix and vector operations for WebGL
 * version 0.9.6
 *
 * Modified for use with mglEngine library by Mateusz Szczygielski 
 *
 * Copyright (c) 2011 Brandon Jones
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
 * @class mat3
 * 3x3 Matrix
 */
mat3 = {

	/**
	 * Creates a new instance of a mat3 using the default array type
	 * Any javascript array containing at least 9 numeric elements can serve as a mat3
	 * @param {Float32Array} vec (optional) vec3 containing values to initialize with
	 * @returns {Float32Array} New mat3
	 */
	create: function(mat) {
		var dest = new Float32Array(9);
		
		if(mat) {
			dest[0] = mat[0];
			dest[1] = mat[1];
			dest[2] = mat[2];
			dest[3] = mat[3];
			dest[4] = mat[4];
			dest[5] = mat[5];
			dest[6] = mat[6];
			dest[7] = mat[7];
			dest[8] = mat[8];
		}
		
		return dest;
	},

	/**
	 * Copies the values of one mat3 to another
	 * @param {Float32Array} mat mat3 containing values to copy
	 * @param {Float32Array} dest mat3 receiving copied values
	 * @returns {Float32Array} dest
	 */
	set: function(mat, dest) {
		dest[0] = mat[0];
		dest[1] = mat[1];
		dest[2] = mat[2];
		dest[3] = mat[3];
		dest[4] = mat[4];
		dest[5] = mat[5];
		dest[6] = mat[6];
		dest[7] = mat[7];
		dest[8] = mat[8];
		return dest;
	},

	/**
	 * Sets a mat3 to an identity matrix
	 * @param {Float32Array} dest mat3 to set
	 * @returns {Float32Array} dest
	 */
	identity: function(dest) {
		dest[0] = 1;
		dest[1] = 0;
		dest[2] = 0;
		dest[3] = 0;
		dest[4] = 1;
		dest[5] = 0;
		dest[6] = 0;
		dest[7] = 0;
		dest[8] = 1;
		return dest;
	},
	
	/**
	 * Transposes a mat3 (flips the values over the diagonal)
	 * @param {Float32Array} mat mat3 to transpose
	 * @param {Float32Array} dest (optional) mat3 receiving operation result. If not specified result is written to mat
	 * @returns {Float32Array} dest if specified, mat otherwise
	 */
	transpose: function(mat, dest) {
			// If we are transposing ourselves we can skip a few steps but have to cache some values
			if(!dest || mat == dest) { 
					var a01 = mat[1], a02 = mat[2];
					var a12 = mat[5];
					
			mat[1] = mat[3];
			mat[2] = mat[6];
			mat[3] = a01;
			mat[5] = mat[7];
			mat[6] = a02;
			mat[7] = a12;
					return mat;
			}
			
			dest[0] = mat[0];
			dest[1] = mat[3];
			dest[2] = mat[6];
			dest[3] = mat[1];
			dest[4] = mat[4];
			dest[5] = mat[7];
			dest[6] = mat[2];
			dest[7] = mat[5];
			dest[8] = mat[8];
			return dest;
	},
	
	/**
	 * Performs a matrix multiplication
	 * @param {Float32Array} mat mat3, first operand
	 * @param {Float32Array} mat2 mat3, second operand
	 * @param {Float32Array} dest (optional) mat3 receiving operation result. If not specified result is written to mat
	 * @returns {Float32Array} dest if specified, mat otherwise
	 */
	multiply: function(mat, mat2, dest) {
		if(!dest) { dest = mat }
		
		// Cache the matrix values (makes for huge speed increases!)
		var a00 = mat[0], a01 = mat[1], a02 = mat[2];
		var a10 = mat[3], a11 = mat[4], a12 = mat[5];
		var a20 = mat[6], a21 = mat[7], a22 = mat[8];
		
		var b00 = mat2[0], b01 = mat2[1], b02 = mat2[2];
		var b10 = mat2[3], b11 = mat2[4], b12 = mat2[5];
		var b20 = mat2[6], b21 = mat2[7], b22 = mat2[8];
		
		dest[0] = a00*b00 + a01*b10 + a02*b20;
		dest[1] = a00*b01 + a01*b11 + a02*b21;
		dest[2] = a00*b02 + a01*b12 + a02*b22;
		dest[3] = a10*b00 + a11*b10 + a12*b20;
		dest[4] = a10*b01 + a11*b11 + a12*b21;
		dest[5] = a10*b02 + a11*b12 + a12*b22;
		dest[6] = a20*b00 + a21*b10 + a22*b20;
		dest[7] = a20*b01 + a21*b11 + a22*b21;
		dest[8] = a20*b02 + a21*b12 + a22*b22;
		
		return dest;
	},
	
	/**
	 * Transforms a vec3 with the given matrix
	 * @param {Float32Array} mat mat3 to transform the vector with
	 * @param {Float32Array} vec vec3 to transform
	 * @param {Float32Array} dest (optional) vec3 receiving operation result. If not specified result is written to vec
	 * @returns {Float32Array} dest if specified, vec otherwise
	 */
	multiplyVec3: function(mat, vec, dest) {
		if(!dest) { dest = vec }
		
		var x = vec[0], y = vec[1], z = vec[2];
		
		dest[0] = mat[0]*x + mat[3]*y + mat[6]*z;
		dest[1] = mat[1]*x + mat[4]*y + mat[7]*z;
		dest[2] = mat[2]*x + mat[5]*y + mat[8]*z;
		
		return dest;
	},

	/**
	 * Copies the elements of a mat3 into the upper 3x3 elements of a mat4
	 * @param {Float32Array} mat mat3 containing values to copy
	 * @param {Float32Array} (optional) mat4 receiving copied values
	 * @returns {Float32Array} dest if specified, a new mat4 otherwise
	 */
	toMat4: function(mat, dest) {
		if(!dest) { dest = mat4.create(); }
		
		dest[0] = mat[0];
		dest[1] = mat[1];
		dest[2] = mat[2];
		dest[3] = 0;

		dest[4] = mat[3];
		dest[5] = mat[4];
		dest[6] = mat[5];
		dest[7] = 0;

		dest[8] = mat[6];
		dest[9] = mat[7];
		dest[10] = mat[8];
		dest[11] = 0;

		dest[12] = 0;
		dest[13] = 0;
		dest[14] = 0;
		dest[15] = 1;
		
		return dest;
	},

	/**
	 * Returns a string representation of a mat3
	 * @param {Float32Array} mat mat3 to represent as a string
	 * @returns {String} String representation of mat
	 */
	str: function(mat) {
		return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] + 
			', ' + mat[3] + ', '+ mat[4] + ', ' + mat[5] + 
			', ' + mat[6] + ', ' + mat[7] + ', '+ mat[8] + ']';
	}
}