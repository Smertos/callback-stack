/*
  Callback Stack Library
  Written by Smertos
*/

module.exports = (function(startCount) {
	var self = this;
	this.onDoneCallbacks = [];
	this.catches = [];
	this.size = 0;
	
	if(startCount && typeof startCount === 'number') this.size = startCount;
	
	if(startCount && typeof startCount !== 'number') throw new Error('Given start size is not a number');
	if(startCount && startCount < 0) throw new Error('Start size cannot be lower than 0');
	
	var execFunc = function() {
		Array.prototype.slice.call(arguments).forEach(function(elem) {
			if(elem && elem instanceof Error)
				self.catches.forEach(function(errCb){
					errCb(elem);
				});
		});
		self.done++;
		self._check();
	};
	
	this.newCallback = this._addCallback = function() {
		self.size++;
		return execFunc;
	};
	
	this.newCallbacks = this._addCallbacks = function(num) {
		if(num < 0) throw new Error('Number of callback to add to stack cannot be lower than 0');
		self.size += num;
		return new Array(num).fill(execFunc);
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
		for(var i = 0; i < self.size; i++)
				callback(execFunc, i);
		return self;
	};
	
	this.getCallbacks = function() {
		return new Array(self.size).fill(execFunc);
	};
	
	this.getCallback = function() {
		return execFunc;
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