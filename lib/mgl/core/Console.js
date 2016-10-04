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

	/**
	 * @class mgl.Console
	 * Console class
	 * @singleton
	 */
	mgl.Console = function(){}
	mgl.extend(mgl.Console, {
		logMessages: true,
		logErrors: true,
	
		messages: [],
		errors: [],
	
		message: function(message){
			if(this.logMessages === true)
				this.messages.push(message);
				
			if (window.console && window.console.log) {
				window.console.log(message);					//temporary
			}
		},
		
		error: function(message){
			if(this.logErrors === true)
				this.errors.push(message);
				
			if (window.console && window.console.log) {
				window.console.log(message);					//temporary
			}
		}
	});
	mgl.Console = new mgl.Console();
	
})();