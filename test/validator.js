// var should = require('should');
var assert = require('chai').assert;
var Validator = require('../validator').Validator;

describe('validator', function(){

	describe("basic properties", function(){

		var validator;

		beforeEach(function(){
			validator = new Validator();
		});

		it('creates a new instance', function(){
			// validator.should.be.an.instanceof(Validator);
			assert.instanceOf(validator, Validator, 'validator is instance of Validator');
		});

		it("has a _validators object", function(){
			// validator.should.have.property('_validators');
			assert.isObject(validator._validators);
		});

		it("has a validate method", function(){
			// validator.should.have.property('validate');
			assert.isFunction(validator.validate)
		});

	});

	describe("settings", function(){

		it("accepts settings and stores them", function(){
			var validator = new Validator(
				{
					name:{
						required:true
					}
				}
			);
			assert.isObject(validator.settings);
		});

	});

	describe("shorthand rules", function(){
		//rules that are defined in the shorthand mode
		//i.e. property:true/false
		//this only applies for the require rule
		var validator;

		beforeEach(function(){
			validator = new Validator({
					name:true,
					age:true,
					sex:false
				});
		});
		
		it("validates true when properties are present",function(){
			var subject = {name:"James",age:15};
			var res = validator.validate(subject);
			assert.isTrue(res);
			assert.length(validator.errors, 0);
		});

		it("returns false when properties are missing", function(){
			var subject = {};
			var res = validator.validate(subject);
			assert.isFalse(res);
			assert.length(validator.errors, 2);
		});

		it("returns false when properties are missing", function(){
			var subject = {name:"James"};
			var res = validator.validate(subject);
			assert.isFalse(res);
			assert.length(validator.errors, 1);
		});

		it("returns false when properties are missing", function(){
			var subject = {age:20};
			var res = validator.validate(subject);
			assert.isFalse(res);
			assert.length(validator.errors, 1);
		});

	});

	describe("standard rules", function(){
		//rules that are defined in the standard structure i.e. rule:value
		var validator;

		beforeEach(function(){
			validator = new Validator({
					name:{
						required:true
					},
					age:{
						required:true
					},
					sex:{
						required:false
					}
				});
		});

		it("returns false when properties are missing", function(){
			var subject = {};
			var res = validator.validate(subject);
			assert.isFalse(res);
			assert.length(validator.errors, 2);
		});

	});

	describe("multiple rules", function(){
		var validator, subject;

		beforeEach(function(){
			validator = new Validator({
				name:{
					required:true,
					min_length:3,
					max_length:10,
					alpha:true
				},
				id:{
					required:false,
					alpha_dash:true,
					exact_length:10
				},
				email:{
					required:true,
					email:true
				}
			});

			subject = {
				name:"James",
				id:"123-456-78",
				email:"james@company.com"
			}

		});

		it("passes", function(){
			var res = validator.validate(subject);
			assert.isTrue(res);
		});

		it("validates required", function(){
			subject.name = "";
			var res = validator.validate(subject);
			assert.isFalse(res);
		});

		it("validate name min_length", function(){
			subject.name = "Po";
			var res = validator.validate(subject);
			assert.isFalse(res);
		});

		it("validate name max_length", function(){
			subject.name = "Lucinda Amanda";
			var res = validator.validate(subject);
			assert.isFalse(res);
		});

	});

	describe("not required but still present", function(){
		var validator, subject;

		beforeEach(function(){
			validator = new Validator({
				name:{
					required:true,
					alpha:true
				},
				id:{
					required:false,
					exact_length:10
				}
			});
			subject = {
				name:"James",
				id:"123-456-78"
			}
		});

		it("passes", function(){
			var res = validator.validate(subject);
			assert.isTrue(res);
		});

		it("fails", function(){			
			subject.name = "";
			var res = validator.validate(subject);
			assert.isFalse(res);
		});

		it("doesn't care if unrequired field is missing", function(){
			delete(subject.id);
			var res = validator.validate(subject);
			assert.isTrue(res);
		});

		it("validates the field if no required but present", function(){
			subject.id = "12";
			var res = validator.validate(subject);
			assert.isFalse(res);
		});

	});

});