/*
  Callback Stack Library v1.2.0
  Written by Smertos
*/

module.exports = (function(startCount) {
	var self = this;
	this.onDoneCallbacks = [];
	this.catches = [];
	this.size = 0;
	this.checksPause = 100;
	
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
		else
			setTimeout(self._check, self.checksPause);
	};

	this.forEach = function(callback) {
		for(var i = 0; i < self.size; i++)
				try {
					callback(execFunc, i);
				} catch(err) {
					self.catches.forEach(function(errCb){
						errCb(err);
					});
				}
		return self;
	};
	
	this.getCallbacks = function() {
		return new Array(self.size).fill(execFunc);
	};
	
	this.getCallback = function() {
		return execFunc;
	};
	
	this.checkEvery = function(checkPauseTime) {
		if(typeof checkPauseTime !== 'number') throw new Error('Check pause time must a number');
		else if(checkPauseTime < 1) throw new Error('Check pause time must be higher than 0');
		else self.checksPause = checkPauseTime;
		return self;
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
	this._check();
});