/*
 * MglEngine - WebGL engine programming library
 *
 * Event class
 * Based on Ext JS Library 2.2 Event
 * http://extjs.com/license
 */
 
/**
 * @class mgl.Event
 * Event class
 * @constructor
 */
mgl.Event = function(scope, name){
	this.scope = scope;
	this.name = name;
	this.listeners = [];
}
mgl.extend(mgl.Event, {

//! scope: undefined,

//! name: name,

//!	listeners: [],

	fire: function(){
		var listeners = this.listeners, scope, length = listeners.length;
		if(length > 0){
			this.firing = true;
			var args = Array.prototype.slice.call(arguments, 0);
			for(var i = 0; i < length; i++){
				var listener = listeners[i];
				if(listener.fireHandler.apply(listener.scope||this.scope||window, arguments) === false){
					this.firing = false;
					return false;
				}
			}
			this.firing = false;
		}
		return true;
	},
	
	addListener: function(handler, scope, options){
		scope = scope || this.scope;
		if(!this.isListening(handler, scope)){
			var listener = this.createListener(handler, scope, options);
			if(!this.firing){
				this.listeners.push(listener);
			}
			else{ // if we are currently firing this event, don't disturb the listener loop
				this.listeners = this.listeners.slice(0);
				this.listeners.push(listener);
			}
		}
	},
	
	removeListener: function(handler, scope){
		var index;
		if((index = this.findListener(handler, scope)) != -1){
			if(!this.firing){
				this.listeners.splice(index, 1);
			}
			else{
				this.listeners = this.listeners.slice(0);
				this.listeners.splice(index, 1);
			}
			return true;
		}
		return false;
	},
	
	createListener: function(handler, scope, options){
		var options = options || {};
		var scope = scope || this.scope;
		var listener = {handler: handler, scope: scope, options: options};
		var handlerFn = handler;
		if(options.delay){
			handlerFn = this.createDelayed(handlerFn, options, scope);
		}
		if(options.single){
			handlerFn = this.createSingle(handlerFn, this, handler, scope);
		}
		listener.fireHandler = handlerFn;
		return listener;
	},
	
	findListener: function(handler, scope){
		scope = scope || this.scope;
		var listeners = this.listeners;
		for(var i = 0, length = listeners.length; i < length; i++){
			var listener = listeners[i];
			if(listener.handler == handler && listener.scope == scope){
				return i;
			}
		}
		return -1;
	},
	
	isListening: function(fn, scope){
		return this.findListener(fn, scope) != -1;
	},
	
	clearListeners: function(){
		this.listeners = [];
	},
	
	createDelayed: function(handlerFn, options, scope){
		return function(){
			var args = Array.prototype.slice.call(arguments, 0);
			setTimeout(function(){
				handlerFn.apply(scope, args);
			}, options.delay || 10);
		};
	},
	
	createSingle: function(handlerFn, event, handler, scope){
		return function(){
			event.removeListener(handler, scope);
			return handlerFn.apply(scope, arguments);
		};
	}
});