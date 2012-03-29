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

	describe("simple validation", function(){
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
			// validator.validate(subject).should.be.ok;
			//validator.errors.should.be
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

	describe("normal rules", function(){
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

	});

	describe("default messages", function(){

	})

	describe("custom messages", function(){

	})

	describe("not required but still present", function(){

	});

	describe("validators", function(){
		var validator;
		var badSubject = {
			name:"",
			age:-2,
			legs:3,
			sex:'?',
			email:"dj@ldld",
			altEmails:"james@gmail.com, djdk@dkdk"
		}
		var goodSubject = {
			name:"James",
			age:12,
			legs:2,
			sex:'m',
			email:'james@james.com',
			altEmails:'james@gmail.com, james@hotmail.com'
		}

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

		describe("required", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

		describe("matches", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

		describe("valid_email", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

		describe("valid_emails", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

		describe("min_length", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

		describe("max_length", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

		describe("exact_length", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

		describe("greater_than", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

		describe("less_than", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

		describe("alpha", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

		describe("alpha_numeric", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

		describe("alpha_dash", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

		describe("numeric", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

		describe("integer", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

		describe("decimal", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

		describe("is_natural", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

		describe("is_natural_no_zero", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

		describe("valid_ip", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

		describe("valid_base64", function(){

			it("validates true", function(){

			});

			it("validates to false", function(){

			});

		});

	});

});