/*
 * MglEngine - WebGL engine programming library
 *
 * Observable class
 * Based on Ext JS Library 2.2 Observable
 * http://extjs.com/license
 */
 
/**
 * @class mgl.Event
 * Observable class
 * @constructor
 */
mgl.Observable = function(){
	this.events = {};
}
mgl.extend(mgl.Observable, {

//!	events: {},

	/**
	 * Fires the specified event with the passed parameters (without the event name).
	 * @param {String} eventName Name of the event
	 * @param {Object...} args Variable number of parameters that should be passed to handlers
	 * @return {Boolean} Returns false if any of the handlers return false otherwise it returns true
	 */
	fireEvent: function(){
		if(this.eventsSuspended !== true){
			var event = this.events[arguments[0]];
			if(typeof event == "object"){
				return event.fire.apply(event, Array.prototype.slice.call(arguments, 1));
			}
		}
		return true;
	},
	
	/** 
	 * Appends an event handler to this component
	 * @param {String} eventName The type of event to listen for
	 * @param {Function} handler The method the event invokes
	 * @param {Object} scope (optional) The scope in which to execute the handler function. The handler function's "this" context.
	 * @param {Object} options (optional) An object containing handler configuration properties.
	 * This may contain any of the following properties:<ul>
	 * <li><b>delay</b> : Number<p class="sub-desc">The number of milliseconds to delay the invocation of the handler after the event fires.</p></li>
	 * <li><b>single</b> : Boolean<p class="sub-desc">True to add a handler to handle just the next firing of the event, and then remove itself.</p></li></ul>
	 */
	addListener: function(eventName, handler, scope, options){
		var event = this.events[eventName] || true;
		if(typeof event == "boolean"){
		    event = new mgl.Event(this, eventName);
		    this.events[eventName] = event;
		}
		event.addListener(handler, scope, options);
	},
	
	/**
	 * Removes a listener
	 * @param {String} eventName The type of event to listen for
	 * @param {Function} handler The handler to remove
	 * @param {Object} scope (optional) The scope (this object) for the handler
	 */
	removeListener: function(eventName, handler, scope){
		var event = this.events[eventName];
		if(typeof event == "object"){
		    event.removeListener(handler, scope);
		}
	},
	
	/**
	 * Removes all listeners for this object
	 */
	purgeListeners: function(){
		for(var event in this.events){
			this.events[event].clearListeners();
		}
	},
	
	/**
	 * Suspend the firing of all events. (see {@link #resumeEvents})
	 */
	suspendEvents: function(){
		this.eventsSuspended = true;
	},

	/**
	 * Resume firing events. (see {@link #suspendEvents})
	 */
	resumeEvents: function(){
		this.eventsSuspended = false;
	},
	
	/**
	 * Checks to see if this object has any listeners for a specified event
	 * @param {String} eventName The name of the event to check for
	 * @return {Boolean} True if the event is being listened for, else false
	*/
	hasListener: function(eventName){
		var event = this.events[eventName];
		return typeof event == "object" && event.listeners.length > 0;
	}
});

/**
 * Appends an event handler to this element (shorthand for @link {#addListener})
 * @param {String} eventName The type of event to listen for
 * @param {Function} handler The method the event invokes
 * @param {Object} scope (optional) The scope in which to execute the handler function. The handler function's "this" context.
 * @param {Object} options  (optional)
 * @method
 */
mgl.Observable.prototype.on = mgl.Observable.prototype.addListener;

/**
 * Removes a listener (shorthand for @link {#removeListener})
 * @param {String} eventName The type of event to listen for
 * @param {Function} handler The handler to remove
 * @param {Object} scope (optional) The scope (this object) for the handler
 * @method
 */
mgl.Observable.prototype.un = mgl.Observable.prototype.removeListener;