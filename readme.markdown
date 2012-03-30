Validator.js
============

A javascript validation library for plain javascript objects (Not forms). Heavily modified version of http://rickharrison.github.com/validate.js/

Usage
-----

	var validator = new Validator(rules);
	validator.validate(subject);

	validator.errors; //array with errors

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

*required*
Returns false if not present or blank

*matches*
Checks that a property matches another property

	var validator = new Validator({
		password:{
			matches:"passwordConfirmation"
		}
	});

*valid_email*
returns false if the property value is not a valid email address.

*valid_emails*
Checks emails in a comma separated list, the list must not have spaces

*min_length*
returns false if the property value is shorter than the parameter.

*max_length*
returns false if the property value is longer than the parameter.

*exact_length*
returns false if the property value is less than the parameter after using parseFloat.

*greater_than*
returns false if the property value is less than the parameter after using parseFloat.

*less_than*
Returns false if the property contains anything other than alphabetical characters.

*alpha*
Returns false if the property contains anything other than alphabetical characters.

*alpha_numeric*
returns false if the property contains anything other than alpha-numeric characters.

*alpha_dash*
returns false if the property contains anything other than alphanumeric characters, underscores, or dashes.

*numeric*
returns false if the property contains anything other than numeric characters.

*integer*
returns false if the property contains anything other than an integer.

*valid_ip*
returns false if the supplied IP is not valid.


Testing
-------

Install mocha and chai

	$ npm install -g mocha
	$ npm install chai

Run the tests

	$ mocha
