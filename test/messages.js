// var should = require('should');
var assert = require('chai').assert;
var Validator = require('../validator').Validator;

describe('validator', function(){

	var validator, subject;

	describe("message spamming", function(){

		beforeEach(function(){
			subject = {
				name:"",
				id:"12+45"
			};

			validator = new Validator({
				name:true,
				id:{
					require:true,
					alpha_dash:true,
					exact_length:8
				}
			})
		});

		it("only shows one message for each rule", function(){
			var res = validator.validate(subject)
			assert.length(validator.errors, 2);
		});

	});

	describe("default messages", function(){

		beforeEach(function(){
			subject = {
				id:"12+45"
			};

			validator = new Validator({
				id:{
					require:true,
					alpha_dash:true,
					exact_length:8
				}
			})
		});
		
		it("shows the default message", function(){
			var res = validator.validate(subject)
			assert.equal(validator.errors[0], 'The id field must only contain alpha-numeric characters, underscores, and dashes.');
		});

		it("shows the default message 2", function(){
			subject.id = "123-333"
			var res = validator.validate(subject)
			assert.equal(validator.errors[0], 'The id field must be exactly 8 characters in length.');
		});
	})

	describe("custom messages", function(){

		beforeEach(function(){
			subject = {
				id:"12+45"
			};

			validator = new Validator({
				id:{
					require:true,
					alpha_dash:true,
					alpha_dash_error:"That is wrong!",
					exact_length:8,
					exact_length_error:"Must be %param"
				}
			})
		});

		it("shows the custom message", function(){
			var res = validator.validate(subject)
			assert.equal(validator.errors[0], 'That is wrong!');
		});

		it("shows the custom message 2", function(){
			subject.id = "1234";
			var res = validator.validate(subject)
			assert.equal(validator.errors[0], 'Must be 8');
		});

	})



});