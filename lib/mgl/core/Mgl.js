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

(function(){

	var idCount = 0;

	/**
	 * @class Mgl
	 * Mgl core utilities and functions
	 * @singleton
	 */
	var Mgl = function(){};
	Mgl.prototype = {
	
		version: '0.1',
		
		shaderPath: 'engine/shaders/',
		
		/**
		 * Copies all the properties of options to target.
		 * @param {Object} options The source of the properties
		 * @param {Object} target The receiver of the properties
		 * @return {Object} returns target
		 * @member Mgl apply
		 */
		apply: function(target, options){
			for(var o in options)
				target[o] = options[o];
			return target;
		},

		/**
         * Extends one class to create a subclass and optionally overrides members with the passed literal.
		 * @param {Function} subclass The constructor of class being new child class.
         * @param {Function} superclass The constructor of class being extended.
         * @param {Object} options <p>A literal with members which are copied into the subclass's
         * prototype, and are therefore shared between all instances of the new class.</p>
         * <p><b>It is essential that you call the superclass constructor in any provided constructor, ex:</b><br>
		 * <code>mgl.Geometry.prototype.constructor.call(this)</code></p>
         */
		extend: function(subclass, superclass, options){
			var Class = function(){};
		
			if(superclass.prototype)
				Class.prototype = superclass.prototype;
			else
				Class.prototype = superclass;
		
			subclass.prototype = new Class();
			subclass.prototype.constructor = subclass;
			
			if(options)
				mgl.apply(subclass.prototype, options);
		},
		
		createId:function(){
			return idCount++;
		}
	}
	window.mgl = new Mgl();
	
})();