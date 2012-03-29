var should = require('should');
var Validator = require('../validator').Validator;

describe('validator', function(){

	describe("basic properties", function(){

		var validator;

		beforeEach(function(){
			validator = new Validator();
		});

		it('creates a new instance', function(){
			validator.should.be.an.instanceof(Validator);
		});

		it("has a _hooks object", function(){
			validator.should.have.property('_hooks');
		});

		it("has a validate method", function(){
			validator.should.have.property('validate');
		});

	});

	describe("rules", function(){

		it("accepts rules and stores them", function(){
			var validator = new Validator({
				{
					name:{
						required:true
					}
				}
			});

			

		});

	});

});