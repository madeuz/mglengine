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
 * @class mgl.Camera
 * Camera class
 * @extends mgl.Drawable
 * @constructor
 * @params {Object} config Configuration for camera. 
<p>For perspective projection this will be:</p>
<code>
{
   projection: 'perspective',
   fovy: fovy,
   aspect: aspect,
   near: near,
   far: far
}
</code>
<p>For orthographic projection will be:</p>
<code>
{
   projection: 'orthographic',
   left: left,
   right: right,
   bottom: bottom,
   top: top,
   near: near,
   far: far
}
</code>
 */
mgl.Camera = function(config){
	var id = config && config.id || 'camera-' + mgl.createId();
	mgl.Drawable.prototype.constructor.call(this, id);
	
	mgl.apply(this, config);
	
	this.createProjectionMatrix();
}
mgl.extend(mgl.Camera, mgl.Drawable, {

	/**
	 * Projection mode: 'perspective' or 'orthographic' (defaults to 'perspective').
	 * @type String
	 */
	projection: 'perspective',

	/**
	 * Vertical field of view (defaults to 45).
	 * @type Number
	 */
	fovy: 45,

	/**
	 * Aspect aspect ratio. Typically viewport width/height.
	 * @type Number
	 */
//! aspect: undefined,

	/**
	 * Left bound of the frustum.
	 * @type Number
	 */
//! left: undefined,

	/**
	 * Right bound of the frustum.
	 * @type Number
	 */
//! right: undefined,

	/**
	 * Bottom bound of the frustum.
	 * @type Number
	 */
//! bottom: undefined,

	/**
	 * Top bound of the frustum.
	 * @type Number
	 */
//! top: undefined,

	/**
	 * Near bound of the frustum (defaults to 0.1).
	 * @type Number
	 */
	near: 0.1,

	/**
	 * Far bound of the frustum (defaults to 100.0).
	 * @type Number
	 */
	far: 100.0,
	
	/**
	 * Creates projection matrix
	 */
	createProjectionMatrix: function(){
		if(this.projection == 'perspective')
			this.pMatrix = mat4.perspective(this.fovy, this.aspect || this.width / this.height, this.near, this.far);
			
		if(this.projection == 'orthographic')
			this.pMatrix = mat4.ortho(this.left, this.right, this.bottom, this.top, this.near, this.far);
	}
});