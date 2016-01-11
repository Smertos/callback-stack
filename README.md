# callback-stack for NodeJS

callback-stack is NodeJS module for creating 

##Installation
Use [NPM](http://npmjs.org) to install this module:

	$ npm install callback-stack


##Example

```javascript

		const CS = require('callback-stack'); //Explanation is not needed, yeah?
		
		var cstack = new CS().
			then(() => { //Add 'on all callbacks executed' callback
				console.log('All callbacks executed successfully');
			}).catch((err) => { //And error catching callback (catching error that generated callback got & from your 'on all callbacks executed' callbacks)
				console.log('Error: ' + err.message);
			});
		
		//Create new callback and execute it (newCallback returns created callback)
		//After that, .then callback(s) will be executed, because there's only one added to stack callback
		cstack.newCallback()('useless text');
		
		//Reset executions count, so you can reuse object again
		cstack.reset(); 
		
		//You do not need index to get function, because the secret of module is - there's only one callback function
		//Get and execute function with error passed
		//This will call .catch callback(s) with error passed to them
		cstack.getCallback()(new Error('Test cool error catching'));
		
		
		cstack.reset();
		
		//You can use 'newCallbacks' for increasing count of callbacks more than by 1
		cstack.newCallbacks(3).forEach((cb) => {
			cb();
		});
		
		cstack.reset();
		//Our object also have it's own forEach with index so you can use it like for-each loop
		cstack.forEach((cb, i) => {
			console.log('Executing callback #' + i);
			cb();
		});
		
		cstack.reset();
		
		//And you ofcourse can just get array with leghth equal stack size filled with same func
		cstack.getCallbacks().forEach((cb) => {
			console.log('Executing callback');
			cb();
		});
		
```