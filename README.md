# callback-stack for NodeJS

callback-stack is NodeJS module for creating 

##Installation
Use [NPM](http://npmjs.org) to install this module:

	$ npm install callback-stack


##Example

```javascript

		const CS = require('./callback-stack.js'); //You know what i does, yeah?
		
		var cstack = new CS().
			then(() => { //Add 'on all callbacks executed' callback
				console.log('All callbacks executed successfully');
			}).catch((err) => { //And error catching callback (catching error that generated callback got & from your 'on all callbacks executed' callbacks)
				console.log('Error: ' + err.message);
			});

		cstack.newCallback()(new Error('Test cool error catching'));
		cstack.reset();
		cstack.newCallbacks(3);
		cstack.forEach((cb, i) => {
			console.log('Executing callback #' + i);
			cb();
		});

```