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
 * @class quat4
 * Quaternions 
 */
quat4 = {

	/**
	 * Creates a new instance of a quat4 using the default array type
	 * Any javascript array containing at least 4 numeric elements can serve as a quat4
	 * @param {Float32Array} (optional) quat4 containing values to initialize with
	 * @returns {Float32Array} New quat4
	 */
	create: function(quat) {
		var dest = new Float32Array(4);
		
		if(quat) {
			dest[0] = quat[0];
			dest[1] = quat[1];
			dest[2] = quat[2];
			dest[3] = quat[3];
		}
		
		return dest;
	},
	
	/**
	 * Creates quaternion from Euler angles
	 * @param {Float32Array} vec vec3 containing Euler angles
	 * @param {Float32Array} dest quat4 receiving calculated values
	 * @returns {Float32Array} dest
	 */
	fromEuler: function(vec, dest){
		if(!dest) { dest = quat4.create(); }
		
		var cx = Math.cos(vec[0]),
			cy = Math.cos(vec[1]),
			cz = Math.cos(vec[2]),
			sx = Math.sin(vec[0]),
			sy = Math.sin(vec[1]),
			sz = Math.sin(vec[2]);
	
		var rotX = mat3.create();
		mat3.identity(rotX);
		rotX[4] = cx;
		rotX[5] = sx;
		rotX[7] = -sx;
		rotX[8] = cx;
		
		var rotY = mat3.create();
		mat3.identity(rotY);
		rotY[0] = cy;
		rotY[2] = -sy;
		rotY[6] = sy;
		rotY[8] = cy;
		
		var rotZ = mat3.create();
		mat3.identity(rotZ);
		rotZ[0] = cz;
		rotZ[1] = sz;
		rotZ[3] = -sz;
		rotZ[4] = cz;
				  
		var m = mat3.create();
		mat3.multiply(rotX, rotY, m);
		mat3.multiply(m, rotZ);
		
		var tr = m[0] + m[4] + m[8];

		var S, x, y, z, w;
		if (tr > 0) { 
			S = Math.sqrt(tr + 1) * 2; // S=4*qw 
			x = (m[7] - m[5]) / S;
			y = (m[2] - m[6]) / S;
			z = (m[3] - m[1]) / S;
			w = 0.25 * S;
		} else if (m[0] > m[4] && m[0] > m[8]) { 
			S = Math.sqrt(1 + m[0] - m[4] - m[8]) * 2; // S=4*qx 
			x = 0.25 * S;
			y = (m[1] + m[3]) / S; 
			z = (m[2] + m[6]) / S;
			w = (m[7] - m[5]) / S;
		} else if (m[4] > m[8]) { 
			S = Math.sqrt(1 + m[4] - m[0] - m[8]) * 2; // S=4*qy
			x = (m[1] + m[3]) / S;
			y = 0.25 * S;
			z = (m[5] + m[7]) / S;
			w = (m[2] - m[6]) / S;
		} else { 
			S = Math.sqrt(1 + m[8] - m[0] - m[4]) * 2; // S=4*qz
			x = (m[2] + m[6]) / S;
			y = (m[5] + m[7]) / S;
			z = 0.25 * S;
			w = (m[3] - m[1]) / S;
		}
		
		dest[0] = x;
		dest[1] = y;
		dest[2] = z;
		dest[3] = w;
	
		return dest;
	},

	/**
	 * Copies the values of one quat4 to another
	 * @param {Float32Array} quat quat4 containing values to copy
	 * @param {Float32Array} dest quat4 receiving copied values
	 * @returns {Float32Array} dest
	 */
	set: function(quat, dest) {
		dest[0] = quat[0];
		dest[1] = quat[1];
		dest[2] = quat[2];
		dest[3] = quat[3];
		
		return dest;
	},

	/**
	 * Calculates the W component of a quat4 from the X, Y, and Z components.
	 * Assumes that quaternion is 1 unit in length. 
	 * Any existing W component will be ignored. 
	 * @param {Float32Array} quat quat4 to calculate W component of
	 * @param {Float32Array} dest (optional) quat4 receiving calculated values. If not specified result is written to quat
	 * @returns {Float32Array} dest if specified, quat otherwise
	 */
	calculateW: function(quat, dest) {
		var x = quat[0], y = quat[1], z = quat[2];

		if(!dest || quat == dest) {
			quat[3] = -Math.sqrt(Math.abs(1.0 - x*x - y*y - z*z));
			return quat;
		}
		dest[0] = x;
		dest[1] = y;
		dest[2] = z;
		dest[3] = -Math.sqrt(Math.abs(1.0 - x*x - y*y - z*z));
		return dest;
	},

	/**
	 * Calculates the inverse of a quat4
	 * @param {Float32Array} quat quat4 to calculate inverse of
	 * @param {Float32Array} dest (optional) quat4 receiving inverse values. If not specified result is written to quat
	 * @returns {Float32Array} dest if specified, quat otherwise
	 */
	inverse: function(quat, dest) {
		if(!dest || quat == dest) {
			quat[0] *= -1;
			quat[1] *= -1;
			quat[2] *= -1;
			return quat;
		}
		dest[0] = -quat[0];
		dest[1] = -quat[1];
		dest[2] = -quat[2];
		dest[3] = quat[3];
		return dest;
	},
	
	/**
	 * Negates the components of a quat4
	 * @param {Float32Array} quat quat4 to negate
	 * @param {Float32Array} dest (optional) quat4 receiving operation result. If not specified result is written to quat
	 * @returns {Float32Array} dest if specified, quat otherwise
	 */
	negate: function(quat, dest) {
		if(!dest) { dest = quat; }
		
		dest[0] = -quat[0];
		dest[1] = -quat[1];
		dest[2] = -quat[2];
		dest[3] = -quat[3];
		return dest;
	},

	/**
	 * Calculates the length of a quat4
	 * @param {Float32Array} quat quat4 to calculate length of
	 * @returns {Number} Length of quat
	 */
	length: function(quat) {
		var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
		return Math.sqrt(x*x + y*y + z*z + w*w);
	},

	/**
	 * Generates a unit quaternion of the same direction as the provided quat4
	 * If quaternion length is 0, returns [0, 0, 0, 0]
	 * @param {Float32Array} quat quat4 to normalize
	 * @param {Float32Array} dest (optional) quat4 receiving operation result. If not specified result is written to quat
	 * @returns {Float32Array} dest if specified, quat otherwise
	 */
	normalize: function(quat, dest) {
		if(!dest) { dest = quat; }
		
		var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
		var len = Math.sqrt(x*x + y*y + z*z + w*w);
		if(len == 0) {
			dest[0] = 0;
			dest[1] = 0;
			dest[2] = 0;
			dest[3] = 0;
			return dest;
		}
		len = 1/len;
		dest[0] = x * len;
		dest[1] = y * len;
		dest[2] = z * len;
		dest[3] = w * len;
		
		return dest;
	},
	
	/**
	 * Caclulates the dot product of two quat4s
	 * @param {Float32Array} quat First operand
	 * @param {Float32Array} quat2 Second operand
	 * @returns {Number} Dot product of quat and quat2
	 */
	dot: function(quat, quat2){
		return quat[0]*quat2[0] + quat[1]*quat2[1] + quat[2]*quat2[2] + quat[3]*quat2[3];
	},

	/**
	 * Performs a quaternion multiplication
	 * @param {Float32Array} quat quat4, first operand
	 * @param {Float32Array} quat2 quat4, second operand
	 * @param {Float32Array} dest (optional) quat4 receiving operation result. If not specified result is written to quat
	 * @returns {Float32Array} dest if specified, quat otherwise
	 */
	multiply: function(quat, quat2, dest) {
		if(!dest) { dest = quat; }
		
		var qax = quat[0], qay = quat[1], qaz = quat[2], qaw = quat[3];
		var qbx = quat2[0], qby = quat2[1], qbz = quat2[2], qbw = quat2[3];
		
		dest[0] = qax*qbw + qaw*qbx + qay*qbz - qaz*qby;
		dest[1] = qay*qbw + qaw*qby + qaz*qbx - qax*qbz;
		dest[2] = qaz*qbw + qaw*qbz + qax*qby - qay*qbx;
		dest[3] = qaw*qbw - qax*qbx - qay*qby - qaz*qbz;
		
		return dest;
	},

	/**
	 * Transforms a vec3 with the given quaternion
	 * @param {Float32Array} quat quat4 to transform the vector with
	 * @param {Float32Array} vec vec3 to transform
	 * @param {Float32Array} dest (optional) vec3 receiving operation result. If not specified result is written to vec
	 * @returns {Float32Array} dest if specified, quat otherwise
	 */
	multiplyVec3: function(quat, vec, dest) {
		if(!dest) { dest = vec; }
		
		var x = vec[0], y = vec[1], z = vec[2];
		var qx = quat[0], qy = quat[1], qz = quat[2], qw = quat[3];

		// calculate quat * vec
		var ix = qw*x + qy*z - qz*y;
		var iy = qw*y + qz*x - qx*z;
		var iz = qw*z + qx*y - qy*x;
		var iw = -qx*x - qy*y - qz*z;
		
		// calculate result * inverse quat
		dest[0] = ix*qw + iw*-qx + iy*-qz - iz*-qy;
		dest[1] = iy*qw + iw*-qy + iz*-qx - ix*-qz;
		dest[2] = iz*qw + iw*-qz + ix*-qy - iy*-qx;
		
		return dest;
	},

	/**
	 * Calculates a 3x3 matrix from the given quat4
	 * @param {Float32Array} quat quat4 to create matrix from
	 * @param {Float32Array} dest (optional) mat3 receiving operation result
	 * @returns {Float32Array} dest if specified, quat otherwise
	 */
	toMat3: function(quat, dest) {
		if(!dest) { dest = mat3.create(); }
		
		var x = quat[0], y = quat[1], z = quat[2], w = quat[3];

		var x2 = x + x;
		var y2 = y + y;
		var z2 = z + z;

		var xx = x*x2;
		var xy = x*y2;
		var xz = x*z2;

		var yy = y*y2;
		var yz = y*z2;
		var zz = z*z2;

		var wx = w*x2;
		var wy = w*y2;
		var wz = w*z2;

		dest[0] = 1 - (yy + zz);
		dest[1] = xy - wz;
		dest[2] = xz + wy;

		dest[3] = xy + wz;
		dest[4] = 1 - (xx + zz);
		dest[5] = yz - wx;

		dest[6] = xz - wy;
		dest[7] = yz + wx;
		dest[8] = 1 - (xx + yy);
		
		return dest;
	},

	/**
	 * Calculates a 4x4 matrix from the given quat4
	 * @param {Float32Array} quat quat4 to create matrix from
	 * @param {Float32Array} dest (optional) mat4 receiving operation result
	 * @returns {Float32Array} dest if specified, quat otherwise
	 */
	toMat4: function(quat, dest) {
		if(!dest) { dest = mat4.create(); }
		
		var x = quat[0], y = quat[1], z = quat[2], w = quat[3];

		var x2 = x + x;
		var y2 = y + y;
		var z2 = z + z;

		var xx = x*x2;
		var xy = x*y2;
		var xz = x*z2;

		var yy = y*y2;
		var yz = y*z2;
		var zz = z*z2;

		var wx = w*x2;
		var wy = w*y2;
		var wz = w*z2;

		dest[0] = 1 - (yy + zz);
		dest[1] = xy - wz;
		dest[2] = xz + wy;
		dest[3] = 0;

		dest[4] = xy + wz;
		dest[5] = 1 - (xx + zz);
		dest[6] = yz - wx;
		dest[7] = 0;

		dest[8] = xz - wy;
		dest[9] = yz + wx;
		dest[10] = 1 - (xx + yy);
		dest[11] = 0;

		dest[12] = 0;
		dest[13] = 0;
		dest[14] = 0;
		dest[15] = 1;
		
		return dest;
	},

	/**
	 * Returns a string representation of a quaternion
	 * @param {Float32Array} quat quat4 to represent as a string
	 * @returns {String} String representation of quat
	 */
	str: function(quat) {
		return '[' + quat[0] + ', ' + quat[1] + ', ' + quat[2] + ', ' + quat[3] + ']'; 
	}
}