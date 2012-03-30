(function() {

	var defaults = {
		messages: {
			required: 'The %prop field is required.',
			matches: 'The %prop field does not match the %param field.',
			valid_email: 'The %prop field must contain a valid email address.',
			valid_emails: 'The %prop field must contain all valid email addresses.',
			min_length: 'The %prop field must be at least %param characters in length.',
			max_length: 'The %prop field must not exceed %param characters in length.',
			exact_length: 'The %prop field must be exactly %param characters in length.',
			greater_than: 'The %prop field must contain a number greater than %param.',
			less_than: 'The %prop field must contain a number less than %param.',
			alpha: 'The %prop field must only contain alphabetical characters.',
			alpha_numeric: 'The %prop field must only contain alpha-numeric characters.',
			alpha_dash: 'The %prop field must only contain alpha-numeric characters, underscores, and dashes.',
			numeric: 'The %prop field must contain only numbers.',
			integer: 'The %prop field must contain an integer.',
			decimal: 'The %prop field must contain a decimal number.',
			is_natural: 'The %prop field must contain only positive numbers.',
			is_natural_no_zero: 'The %prop field must contain a number greater than zero.',
			valid_ip: 'The %prop field must contain a valid IP.',
			valid_base64: 'The %prop field must contain a base64 string.'
		}
	};

	var ruleRegex = /^(.+)\[(.+)\]$/,
		numericRegex = /^[0-9]+$/,
		integerRegex = /^\-?[0-9]+$/,
		decimalRegex = /^\-?[0-9]*\.?[0-9]+$/,
		emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i,
		alphaRegex = /^[a-z]+$/i,
		alphaNumericRegex = /^[a-z0-9]+$/i,
		alphaDashRegex = /^[a-z0-9_-]+$/i,
		naturalRegex = /^[0-9]+$/i,
		naturalNoZeroRegex = /^[1-9][0-9]*$/i,
		ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
		base64Regex = /[^a-zA-Z0-9\/\+=]/i;

	var Validator = function(settings) {
		this.settings = settings;
	}

	Validator.prototype.validate = function(subject) {
		this.errors = [];
		this._errorsHash = {};
		this._subject = subject;

		for (var property in this.settings) {
			if (this.settings.hasOwnProperty(property)) {
				var rules = this.settings[property] || {};
				this._validateProperty(property, rules);
			}
		}

		return this.errors.length===0;
	};

	Validator.prototype._validateProperty = function(property, rules) {
		//rules could be:
		// - true
		// - false
		// {
		//	required : true
		//	requiredError: "..."
		// }

		//find the property in the subject
		var value = this._subject[property];

		//check for a simple require rule
		if(rules===true){
			this._validateValueWithRule(property, value, "required", true, null);
		}else{
			//otherwise validate each rule
			
			//if not required and value is not present then ignore
			if(value===undefined && rules["required"]===false){
				return;
			}

			for(var rule in rules){
				if(rules.hasOwnProperty(rule)){
					//validate each rule
					this._validateValueWithRule(property, value, rule, rules[rule], rules[rule+"_error"]);
					//if there is one error break
					if(this._errorsHash[property]) break;
				}
			}
		}

		return !this._errorsHash[property];

	};

	Validator.prototype._validateValueWithRule = function(property, value, rule, param, message){

		var failed = false;

		if (typeof this._validators[rule] === 'function') {
			//do not apply the validator if false
			if(param!==false){
				failed = !this._validators[rule].apply(this, [value, param]);
			}
		}

		if(failed){
			var source = message || defaults.messages[rule];
			if (source) {
				message = source.replace('%prop', property);
				message = message.replace('%param', param);
			} else {
				message = 'An error has occurred with the ' + property + '.';
			}

			this.errors.push(message);
			this._errorsHash[property] = true;
		}

		return !failed;
	}

	Validator.prototype._validators = {

		required: function(value, param) {
			if(!param) return true;
			// console.log("required validator")
			if(value===undefined) return false;
			if(value===null) return false;
			if(value==='') return false;
			return true;
			// return (value !== null && value !== '');
		},

		matches: function(value, match) {
			return value === this._subject[match];
		},

		valid_email: function(value) {
			return emailRegex.test(value);
		},

		valid_emails: function(value) {
			if(value===undefined) return false;

			var result = value.split(",");
			
			for (var i = 0; i < result.length; i++) {
				// console.log(result[i])
				if (!emailRegex.test(result[i])) {
					return false;
				}
			}

			return true;
		},

		min_length: function(value, length) {
			if (!numericRegex.test(length)) {
				return false;
			}

			return (value.length >= parseInt(length, 10));
		},

		max_length: function(value, length) {
			if (!numericRegex.test(length)) {
				return false;
			}

			return (value.length <= parseInt(length, 10));
		},

		exact_length: function(value, length) {
			if (!numericRegex.test(length)) {
				return false;
			}
			return (value.length === parseInt(length, 10));
		},

		greater_than: function(value, param) {
			if (!decimalRegex.test(value)) {
				return false;
			}

			return (parseFloat(value) > parseFloat(param));
		},

		less_than: function(value, param) {
			if (!decimalRegex.test(value)) {
				return false;
			}

			return (parseFloat(value) < parseFloat(param));
		},

		alpha: function(value) {
			return (alphaRegex.test(value));
		},

		alpha_numeric: function(value) {
			return (alphaNumericRegex.test(value));
		},

		alpha_dash: function(value) {
			return (alphaDashRegex.test(value));
		},

		numeric: function(value) {
			return (decimalRegex.test(value));
		},

		integer: function(value) {
			return (integerRegex.test(value));
		},

		valid_ip: function(value) {
			return (ipRegex.test(value));
		}

	};

	if (typeof module !== 'undefined' && module.exports) {
		exports.Validator = Validator; 
	}else if(typeof define !== 'undefined') {
		define(function(){
			return Validator;
		});
	} else {
		window.Validator = Validator;
	}

}());

