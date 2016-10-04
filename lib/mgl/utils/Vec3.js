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
 * @class vec3
 * 3 Dimensional Vector
 */
vec3 = {

	/**
	 * Creates a new instance of a vec3 using the array type Float32Array
	 * Any javascript array containing at least 3 numeric elements can serve as a vec3
	 * @param {Float32Array} vec (optional) vec3 containing values to initialize with
	 * @returns {Float32Array} New vec3
	 */
	create: function(vec) {
		var dest = new Float32Array(3);
		
		if(vec) {
			dest[0] = vec[0];
			dest[1] = vec[1];
			dest[2] = vec[2];
		}
		
		return dest;
	},

	/**
	 * Copies the values of one vec3 to another
	 * @param {Float32Array} vec Containing values to copy
	 * @param {Float32Array} dest Receiving copied values
	 * @returns {Float32Array} dest
	 */
	set: function(vec, dest) {
		dest[0] = vec[0];
		dest[1] = vec[1];
		dest[2] = vec[2];
		
		return dest;
	},

	/**
	 * Performs a vector addition
	 * @param {Float32Array} vec First operand
	 * @param {Float32Array} vec2 Second operand
	 * @param {Float32Array} dest (optional) vec3 receiving operation result. If not specified result is written to vec
	 * @returns {Float32Array} dest if specified, vec otherwise
	 */
	add: function(vec, vec2, dest) {
		if(!dest || vec == dest) {
			vec[0] += vec2[0];
			vec[1] += vec2[1];
			vec[2] += vec2[2];
			return vec;
		}
		
		dest[0] = vec[0] + vec2[0];
		dest[1] = vec[1] + vec2[1];
		dest[2] = vec[2] + vec2[2];
		return dest;
	},

	/**
	 * Performs a vector subtraction
	 * @param {Float32Array} vec First operand
	 * @param {Float32Array} vec2 Second operand
	 * @param {Float32Array} dest (optional) vec3 receiving operation result. If not specified result is written to vec
	 * @returns {Float32Array} dest if specified, vec otherwise
	 */
	subtract: function(vec, vec2, dest) {
		if(!dest || vec == dest) {
			vec[0] -= vec2[0];
			vec[1] -= vec2[1];
			vec[2] -= vec2[2];
			return vec;
		}
		
		dest[0] = vec[0] - vec2[0];
		dest[1] = vec[1] - vec2[1];
		dest[2] = vec[2] - vec2[2];
		return dest;
	},

	/**
	 * Negates the components of a vec3
	 * @param {Float32Array} vec vec3 to negate
	 * @param {Float32Array} dest (optional) vec3 receiving operation result. If not specified result is written to vec
	 * @returns {Float32Array} dest if specified, vec otherwise
	 */
	negate: function(vec, dest) {
		if(!dest) { dest = vec; }
		
		dest[0] = -vec[0];
		dest[1] = -vec[1];
		dest[2] = -vec[2];
		return dest;
	},

	/**
	 * Multiplies the components of a vec3 by a scalar value
	 * @param {Float32Array} vec vec3 to scale
	 * @param {Number} val Numeric value to scale by
	 * @param {Float32Array} dest (optional) vec3 receiving operation result. If not specified result is written to vec
	 * @returns {Float32Array} dest if specified, vec otherwise
	 */
	scale: function(vec, val, dest) {
		if(!dest || vec == dest) {
			vec[0] *= val;
			vec[1] *= val;
			vec[2] *= val;
			return vec;
		}
		
		dest[0] = vec[0]*val;
		dest[1] = vec[1]*val;
		dest[2] = vec[2]*val;
		return dest;
	},

	/**
	 * Generates a unit vector of the same direction as the provided vec3
	 * If vector length is 0, returns [0, 0, 0]
	 * @param {Float32Array} vec vec3 to normalize
	 * @param {Float32Array} dest (optional) vec3 receiving operation result. If not specified result is written to vec
	 * @returns {Float32Array} dest if specified, vec otherwise
	 */
	normalize: function(vec, dest) {
		if(!dest) { dest = vec; }
		
		var x = vec[0], y = vec[1], z = vec[2];
		var len = Math.sqrt(x*x + y*y + z*z);
		
		if (!len) {
			dest[0] = 0;
			dest[1] = 0;
			dest[2] = 0;
			return dest;
		} else if (len == 1) {
			dest[0] = x;
			dest[1] = y;
			dest[2] = z;
			return dest;
		}
		
		len = 1 / len;
		dest[0] = x*len;
		dest[1] = y*len;
		dest[2] = z*len;
		return dest;
	},

	/**
	 * Generates the cross product of two mgl.Math.vec3s
	 * @param {Float32Array} vec First operand
	 * @param {Float32Array} vec2 Second operand
	 * @param {Float32Array} dest (optional) vec3 receiving operation result. If not specified result is written to vec
	 * @returns {Float32Array} dest if specified, vec otherwise
	 */
	cross: function(vec, vec2, dest){
		if(!dest) { dest = vec; }
		
		var x = vec[0], y = vec[1], z = vec[2];
		var x2 = vec2[0], y2 = vec2[1], z2 = vec2[2];
		
		dest[0] = y*z2 - z*y2;
		dest[1] = z*x2 - x*z2;
		dest[2] = x*y2 - y*x2;
		return dest;
	},

	/**
	 * Caclulates the length of a vec3
	 * @param {Float32Array} vec vec3 to calculate length of
	 * @returns {Number} Length of vec
	 */
	length: function(vec){
		var x = vec[0], y = vec[1], z = vec[2];
		return Math.sqrt(x*x + y*y + z*z);
	},

	/**
	 * Caclulates the dot product of two vec3s
	 * @param {Float32Array} vec First operand
	 * @param {Float32Array} vec2 Second operand
	 * @returns {Number} Dot product of vec and vec2
	 */
	dot: function(vec, vec2){
		return vec[0]*vec2[0] + vec[1]*vec2[1] + vec[2]*vec2[2];
	},

	/**
	 * Generates a unit vector pointing from one vector to another
	 * @param {Float32Array} vec Origin vec3
	 * @param {Float32Array} vec2 vec3 to point to
	 * @param {Float32Array} dest (optional) vec3 receiving operation result. If not specified result is written to vec
	 * @returns {Float32Array} dest if specified, vec otherwise
	 */
	direction: function(vec, vec2, dest) {
		if(!dest) { dest = vec; }
		
		var x = vec[0] - vec2[0];
		var y = vec[1] - vec2[1];
		var z = vec[2] - vec2[2];
		
		var len = Math.sqrt(x*x + y*y + z*z);
		if (!len) { 
			dest[0] = 0; 
			dest[1] = 0; 
			dest[2] = 0;
			return dest; 
		}
		
		len = 1 / len;
		dest[0] = x * len; 
		dest[1] = y * len; 
		dest[2] = z * len;
		return dest; 
	},
	
	/**
	 * Performs a linear interpolation between two vec3
	 * @param {Float32Array} vec vec3, first vector
	 * @param {Float32Array} vec2 vec3, second vector
	 * @param {Number} lerp interpolation amount between the two inputs
	 * @param {Float32Array} dest (optional) vec3 receiving operation result. If not specified result is written to vec
	 * @returns {Float32Array} dest if specified, vec otherwise
	 */
	lerp: function(vec, vec2, lerp, dest){
		if(!dest) { dest = vec; }
		
		dest[0] = vec[0] + lerp * (vec2[0] - vec[0]);
		dest[1] = vec[1] + lerp * (vec2[1] - vec[1]);
		dest[2] = vec[2] + lerp * (vec2[2] - vec[2]);
		
		return dest;
	},

	/**
	 * Returns a string representation of a vector
	 * @param {Float32Array} vec vec3 to represent as a string
	 * @returns {String} String representation of vec
	 */
	str: function(vec) {
		return '[' + vec[0] + ', ' + vec[1] + ', ' + vec[2] + ']'; 
	}
}