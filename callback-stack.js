/*
  Callback Stack Library
  Written by Smertos
*/

module.exports = (function(startCount) {
	var self = this;
	this.callbacks = [];
	this.onDoneCallbacks = [];
	this.catches = [];
	this.size = 0;
	
	if(!startCount) startCount = 0;
	if(startCount < 0) throw new Error('Start size cannot be lower than 0');
	
	this.newCallback = this._addCallback = function() {
		self.size = self.callbacks.push(function() {
			Array.prototype.slice.call(arguments).forEach(function(elem) {
				if(elem instanceof Error)
					self.catches.forEach(function(errCb){
						errCb(elem);
					});
			});
			self.done++;
			self._check();
		});
		return self.callbacks[self.size - 1];
	};
	
	this.newCallbacks = this._addCallbacks = function(num) {
		if(num < 0) throw new Error('Number of callback to add to stack cannot be lower than 0');
		for(var i = 0; i < num; i++) {
			self._addCallback();
		}
		return self.callbacks.slice(self.callbacks.length - num, self.callbacks.length);
	};
	
	this._check = function() {
		if(self.done === self.size)
			self.onDoneCallbacks.forEach(function(cb){
				try{
					cb();
				} catch (err) {
					self.catches.forEach(function(errCb){
						errCb(err);
					});
				}
			});
	};

	this.forEach = function(callback) {
		var i = 0;
		self.callbacks.forEach(function(elem){
			callback(elem, i);
			i++;
		});
		return self;
	};
	
	this.getCallbacks = function() {
		return self.callbacks;
	};
	
	this.getCallback = function(index) {
		if(index >= self.callbacks.length)
		return self.callbacks[index];
	};

	this.then = function(callback) {
		if(callback && typeof callback === 'function')
			self.onDoneCallbacks.push(callback);
		else throw new Error('Given callback is not function');
		return self;
	};
	
	this.catch = function(callback) {
		if(callback && typeof callback === 'function')
			self.catches.push(callback);
		else throw new Error('Given callback is not function');
		return self;
	};
	
	this.reset = function() {
		self.done = 0;
	};
	
	
	
	this.reset();
});