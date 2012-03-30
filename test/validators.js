// var should = require('should');
var assert = require('chai').assert;
var Validator = require('../validator').Validator;

describe('validator', function(){

	describe("validators", function(){

		describe("required", function(){

			var validator = new Validator({
				name:true
			});

			it("returns true", function(){
				var subject = {
					name:"James"
				}
				var res = validator.validate(subject);
				assert.isTrue(res);
				assert.length(validator.errors,0);
			});

			it("returns false when blank", function(){
				var subject = {
					name:""
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors,1);
			});

			it("returns false when missing", function(){
				var subject = {
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors,1);
			});

		});

		describe("matches", function(){

			var validator = new Validator({
				password:{
					matches:"passwordConfirmation"
				}
			});

			it("returns true", function(){
				var subject = {
					password:"123456",
					passwordConfirmation:"123456"
				}
				var res = validator.validate(subject);
				assert.isTrue(res);
				assert.length(validator.errors, 0);
			});

			it("returns false", function(){
				var subject = {
					password:"123456",
					passwordConfirmation:"789456"
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors, 1);
			});

		});

		describe("valid_email", function(){

			var validator = new Validator({
				email:{
					valid_email:true
				}
			});

			it("returns true", function(){
				var subject = {
					email:"sam@email.com"
				}
				var res = validator.validate(subject);
				assert.isTrue(res);
				assert.length(validator.errors, 0);
			});

			it("returns false", function(){
				var subject = {
					email:"samemail.com"
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors, 1);
			});

		});

		describe("valid_emails", function(){

			var validator = new Validator({
				emails:{
					valid_emails:true
				}
			});

			it("returns true", function(){
				var subject = {
					emails:"sam@email.com,james@company.com"
				}
				var res = validator.validate(subject);
				assert.isTrue(res);
				assert.length(validator.errors, 0);
			});

			it("returns false", function(){
				var subject = {
					emails:"sam@email.com,jamesmail.com"
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors, 1);
			});

		});

		describe("min_length", function(){

			var validator = new Validator({
				name:{
					min_length:4
				}
			});

			it("returns true", function(){
				var subject = {
					name:"James"
				}
				var res = validator.validate(subject);
				assert.isTrue(res);
				assert.length(validator.errors, 0);
			});

			it("returns to false", function(){
				var subject = {
					name:"Ian"
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors, 1);
			});

		});

		describe("max_length", function(){

			var validator = new Validator({
				name:{
					max_length:4
				}
			});

			it("returns true", function(){
				var subject = {
					name:"Ian"
				}
				var res = validator.validate(subject);
				assert.isTrue(res);
				assert.length(validator.errors, 0);
			});

			it("returns to false", function(){
				var subject = {
					name:"James"
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors, 1);
			});

		});

		describe("exact_length", function(){

			var validator = new Validator({
				name:{
					exact_length:4
				}
			});

			it("returns true if exact", function(){
				var subject = {
					name:"Rosa"
				}
				var res = validator.validate(subject);
				assert.isTrue(res);
				assert.length(validator.errors, 0);
			});

			it("returns to false if too short", function(){
				var subject = {
					name:"Ian"
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors, 1);
			});

			it("returns to false if too long", function(){
				var subject = {
					name:"James"
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors, 1);
			});

		});

		describe("greater_than", function(){

			var validator = new Validator({
				age:{
					greater_than:21
				}
			});

			it("returns true", function(){
				var subject = {
					age:22
				}
				var res = validator.validate(subject);
				assert.isTrue(res);
				assert.length(validator.errors, 0);
			});

			it("returns false", function(){
				var subject = {
					age:20
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors, 1);
			});

			it("returns false if exact", function(){
				var subject = {
					age:21
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors, 1);
			});

		});

		describe("less_than", function(){

			var validator = new Validator({
				age:{
					less_than:21
				}
			});

			it("returns true", function(){
				var subject = {
					age:19
				}
				var res = validator.validate(subject);
				assert.isTrue(res);
				assert.length(validator.errors, 0);
			});

			it("returns false", function(){
				var subject = {
					age:22
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors, 1);
			});

			it("returns false if exact", function(){
				var subject = {
					age:21
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors, 1);
			});

		});

		describe("alpha", function(){

			var validator = new Validator({
				name:{
					alpha:true
				}
			});

			it("returns true", function(){
				var subject = {
					name:"James"
				}
				var res = validator.validate(subject);
				assert.isTrue(res);
				assert.length(validator.errors, 0);
			});

			it("returns false if it contains numbers", function(){
				var subject = {
					name:"James21"
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors, 1);
			});

		});

		describe("alpha_numeric", function(){

			var validator = new Validator({
				name:{
					alpha_numeric:true
				}
			});

			it("returns true if it only has characters", function(){
				var subject = {
					name:"James"
				}
				var res = validator.validate(subject);
				assert.isTrue(res);
				assert.length(validator.errors, 0);
			});

			it("returns true if it only has numbers", function(){
				var subject = {
					name:123
				}
				var res = validator.validate(subject);
				assert.isTrue(res);
				assert.length(validator.errors, 0);
			});

			it("returns true if it has characters and numbers", function(){
				var subject = {
					name:"James"
				}
				var res = validator.validate(subject);
				assert.isTrue(res);
				assert.length(validator.errors, 0);
			});

			it("returns false", function(){
				var subject = {
					name:"James 21"
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors, 1);
			});

		});

		describe("alpha_dash", function(){

			var validator = new Validator({
				name:{
					alpha_dash:true
				}
			});

			it("returns true if it has valid chars", function(){
				var subject = {
					name:"James-272_AAX"
				}
				var res = validator.validate(subject);
				assert.isTrue(res);
				assert.length(validator.errors, 0);
			});

			it("returns false if it has something else", function(){
				var subject = {
					name:"James-21#88"
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors, 1);
			});

		});

		describe("numeric", function(){

			var validator = new Validator({
				prop:{
					numeric:true
				}
			});

			it("returns true if numeric string", function(){
				var subject = {
					prop:"154.24"
				}
				var res = validator.validate(subject);
				assert.isTrue(res);
				assert.length(validator.errors, 0);
			});

			it("returns true if numbers", function(){
				var subject = {
					prop:12455.5
				}
				var res = validator.validate(subject);
				assert.isTrue(res);
				assert.length(validator.errors, 0);
			});

			it("returns false", function(){
				var subject = {
					prop:"45A4"
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors, 1);
			});

		});

		describe("integer", function(){

			var validator = new Validator({
				prop:{
					integer:true
				}
			});

			it("returns true if numeric string", function(){
				var subject = {
					prop:"154"
				}
				var res = validator.validate(subject);
				assert.isTrue(res);
				assert.length(validator.errors, 0);
			});
			
			it("returns false", function(){
				var subject = {
					prop:125.5
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors, 1);
			});

		});

		// describe("decimal", function(){

		// 	var validator = new Validator({
		// 		foo:{
		// 			decimal:true
		// 		}
		// 	});

		// 	it("returns true", function(){
		// 		var subject = {
		// 			foo:10.10
		// 		}
		// 		var res = validator.validate(subject);
		// 		assert.isTrue(res);
		// 		assert.length(validator.errors, 0);
		// 	});

		// 	it("returns false", function(){
		// 			var subject = {
		// 				foo:504545.456
		// 			}
		// 		var res = validator.validate(subject);
		// 		assert.isFalse(res);
		// 		assert.length(validator.errors, 1);
		// 	});

		// });

		// describe("is_natural", function(){

		// 	it("validates true", function(){

		// 	});

		// 	it("validates to false", function(){

		// 	});

		// });

		// describe("is_natural_no_zero", function(){

		// 	it("validates true", function(){

		// 	});

		// 	it("validates to false", function(){

		// 	});

		// });

		describe("valid_ip", function(){

			var validator = new Validator({
				prop:{
					valid_ip:true
				}
			});

			it("returns true if numeric string", function(){
				var subject = {
					prop:"154.155.0.1"
				}
				var res = validator.validate(subject);
				assert.isTrue(res);
				assert.length(validator.errors, 0);
			});
			
			it("returns false", function(){
				var subject = {
					prop:"153.45.2.2.4"
				}
				var res = validator.validate(subject);
				assert.isFalse(res);
				assert.length(validator.errors, 1);
			});

		});

		// describe("valid_base64", function(){

		// 	it("validates true", function(){

		// 	});

		// 	it("validates to false", function(){

		// 	});

		// });

	});

});