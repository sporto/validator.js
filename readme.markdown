Validator.js
============

A javascript validation library for plain javascript objects (Not forms). 

Inspiration (and code borrowing)
--------------------------------

- http://rickharrison.github.com/validate.js/
- http://docs.jquery.com/Plugins/Validation

Usage
-----

	var validator = new Validator(rules);
	validator.validate(subject);

	validator.errors; //array with errors

Example
-------

	var subject = {
		name:"James",
		age:13,
		id:"22-3"
	}

	var validator = new Validator({
		name:{
			required:true,
			min_length:3,
			max_length:20
		},
		age:{
			required:true,
			numeric:true,
			greater_than:21
		},
		id:{
			required:true,
			alpha_dash:true,
			exact_length:4
		}
	});

	var res = validator.validate(subject); // -> true

Shorthand rules
---------------

	var validator = new Validator({
		name:true,
		age:true,
		id:true
	})

This will check that those properties are present.

Standard rules
--------------

	var validator = new Validator({
		name:true,
		age:{
			required:true,
			greater_than:21,
			less_than:99
		},
		id:{
			required:true,
			alpha_dash:true
		}
	});

Messages
--------

Messages are stored in an "errors" array in the validator object:

	var subject = {
		name:""
	}

	var validator = new Validator({
		name:true
	});

	validator.validate(subject); //-> false

	validator.errors[0] //->"The name field is required.""

You can override the default messages in the following way:

	var validator = new Validator({
		age:{
			greater_than:21,
			greater_than_error:"You are too young",
			less_than:99,
			less_than_error:"You are too old"
		}
	});

Just append "_error" to the rule to override the default message.

Standard browser usage
----------------------

Import the script
Use Validator as shown above

AMD usage
---------

	

Node usage
----------

	var Validator = require('../validator').Validator;

Available rules
---------------

**required**
Returns false if not present or blank

**matches**
Checks that a property matches another property

	var validator = new Validator({
		password:{
			matches:"passwordConfirmation"
		}
	});

**valid_email**

Returns false if the property value is not a valid email address.

**valid_emails**

Checks emails in a comma separated list, the list must not have spaces

**min_length**

Returns false if the property value is shorter than the parameter.

**max_length**

Returns false if the property value is longer than the parameter.

**exact_length**

Returns false if the property value is less than the parameter after using parseFloat.

**greater_than**

Returns false if the property value is less than the parameter after using parseFloat.

**less_than**

Returns false if the property contains anything other than alphabetical characters.

**alpha**

Returns false if the property contains anything other than alphabetical characters.

**alpha_numeric**

returns false if the property contains anything other than alpha-numeric characters.

**alpha_dash**

Returns false if the property contains anything other than alphanumeric characters, underscores, or dashes.

**numeric**

Returns false if the property contains anything other than numeric characters.

**integer**

Returns false if the property contains anything other than an integer.

**valid_ip**

Returns false if the supplied IP is not valid.

Caveats
-------

- This library only handles shallow object

Testing
-------

Install mocha and chai

	$ npm install -g mocha
	$ npm install chai

Run the tests

	$ mocha

License
-------

	The MIT License

	Copyright (c) 2012 Sebastian Porto, http://sebastianporto.com
	Copyright (C) 2011 by Rick Harrison, http://rickharrison.me

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	'Software'), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
