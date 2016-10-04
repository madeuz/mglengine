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
 * @class mgl.Color
 * Color class
 * @constructor
 * @param {Mixed} color The color to initialice class with. This can be color name (ex. 'purple',
 * supports 16 standard web colors), hexadecimal value (ex. '0034FF', '#0034ff', 'f0f', '#FAB'),
 * CSS rgb definition (ex. 'rgb(123, 34, 255)', 'rgb(123,34,255)', 'rgb(123, 34, 255, 128)')
 * or array containing 3 or 4, integer or floating point values.
 * @param {Number} alpha The alpha value of the color (defaults to 1.0)
 */
mgl.Color = function(color, alpha){
	if(typeof color == 'string'){
	
		// strip any leading #
		if (color.charAt(0) == '#') { // remove # if any
			color = color.substr(1,6);
		}
		
		if(this.colors[color])
			this.fromHex(this.colors[color]);
		else
			this.fromHex(color);
	}
	
	if(typeof color == 'array'){
		this.fromArray(color);
	}
	
	if(alpha) if(this.isInt(alpha)) this.a = this.cleanupInt(alpha) / 255; else this.a = this.cleanupFloat(alpha);
}
mgl.extend(mgl.Color, {

//!	r: undefined,
//!	g: undefined,
//!	b: undefined,
//!	a: undefined,

	/**
	 * Standard web colors
	 */
	colors: {
		black: '000000',
		gray: '808080',
		silver: 'c0c0c0',
		white: 'ffffff',
		maroon: '800000',
		red: 'ff0000',
		purple: '800080',
		fuchsia: 'ff00ff',
		green: '008000',
		lime: '00ff00',
		olive: '808000',
		yellow: 'ffff00',
		navy: '000080',
		blue: '0000ff',
		teal: '008080',
		aqua: '00ffff'
	},
	
	fromArray: function(color){
		if(this.isInt(color[0])) this.r = this.cleanupInt(color[0]) / 255;
		else this.r = this.cleanupFloat(color[0]);
		
		if(this.isInt(color[1])) this.g = this.cleanupInt(color[1]) / 255;
		else this.g = this.cleanupFloat(color[1]);
		
		if(this.isInt(color[2])) this.b = this.cleanupInt(color[2]) / 255;
		else this.b = this.cleanupFloat(color[2]);
		
		if(color.lenght > 3){
			if(this.isInt(color[3])) this.a = this.cleanupInt(color[3]) / 255;
			else this.a = this.cleanupFloat(color[3]);
		}
		
		if(isNaN(this.a)) this.a = 1.0;
	},
	
	fromHex: function(color){
		// array of color definition objects
		var color_defs = [
			{
				re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
				process: function (bits){
					return [
						parseInt(bits[1]),
						parseInt(bits[2]),
						parseInt(bits[3])
					];
				}
			},
			{
				re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
				process: function (bits){
					return [
						parseInt(bits[1]),
						parseInt(bits[2]),
						parseInt(bits[3]),
						parseInt(bits[4])
					];
				}
			},
			{
				re: /^(\w{2})(\w{2})(\w{2})$/,
				process: function (bits){
					return [
						parseInt(bits[1], 16),
						parseInt(bits[2], 16),
						parseInt(bits[3], 16)
					];
				}
			},
			{
				re: /^(\w{1})(\w{1})(\w{1})$/,
				process: function (bits){
					return [
						parseInt(bits[1] + bits[1], 16),
						parseInt(bits[2] + bits[2], 16),
						parseInt(bits[3] + bits[3], 16)
					];
				}
			}
		];
		
		var r, g, b, a;
		
		// search through the definitions to find a match
		for (var i = 0; i < color_defs.length; i++) {
			var re = color_defs[i].re;
			var processor = color_defs[i].process;
			var bits = re.exec(color);
			if (bits) {
				channels = processor(bits);
				r = channels[0];
				g = channels[1];
				b = channels[2];
				if(channels.length > 3){
					a = channels[3];
					a = this.cleanupInt(a);
					this.a = 255 / a;
				}
			}
		}
		
		// validate/cleanup values
		r = this.cleanupInt(r);
		g = this.cleanupInt(g);
		b = this.cleanupInt(b);
		
		this.r = r / 255;
		this.g = g / 255;
		this.b = b / 255;
		
		if(isNaN(this.a)) this.a = 1.0;
	},
	
	isInt: function(n){
		return n % 1 == 0;
	},
	
	cleanupInt: function(v){
		return (v < 0 || isNaN(v)) ? 0 : ((v > 255) ? 255 : v);
	},
	
	cleanupFloat: function(v){
		return (v < 0 || isNaN(v)) ? 0.0 : ((v > 1.0) ? 1.0 : v);
	},
	
	RGB: function(){
		return [this.r, this.g, this.b];
	},
	
	RGBA: function(){
		return [this.r, this.g, this.b, this.a];
	}
});