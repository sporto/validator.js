(function() {

	var defaults = {
		messages: {
			required: 'The %s field is required.',
			matches: 'The %s field does not match the %s field.',
			valid_email: 'The %s field must contain a valid email address.',
			valid_emails: 'The %s field must contain all valid email addresses.',
			min_length: 'The %s field must be at least %s characters in length.',
			max_length: 'The %s field must not exceed %s characters in length.',
			exact_length: 'The %s field must be exactly %s characters in length.',
			greater_than: 'The %s field must contain a number greater than %s.',
			less_than: 'The %s field must contain a number less than %s.',
			alpha: 'The %s field must only contain alphabetical characters.',
			alpha_numeric: 'The %s field must only contain alpha-numeric characters.',
			alpha_dash: 'The %s field must only contain alpha-numeric characters, underscores, and dashes.',
			numeric: 'The %s field must contain only numbers.',
			integer: 'The %s field must contain an integer.',
			decimal: 'The %s field must contain a decimal number.',
			is_natural: 'The %s field must contain only positive numbers.',
			is_natural_no_zero: 'The %s field must contain a number greater than zero.',
			valid_ip: 'The %s field must contain a valid IP.',
			valid_base64: 'The %s field must contain a base64 string.'
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

		/*
		for (var i = 0, fieldLength = fields.length; i < fieldLength; i++) {
    	var field = fields[i];

            // If passed in incorrectly, we need to skip the field.
            if (!field.name || !field.rules) {
                continue;
            }

            this.fields[field.name] = {
                name: field.name,
                display: field.display || field.name,
                rules: field.rules,
                type: null,
                value: null,
                checked: null
            };
        }
		*/
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

		//reset the errorsHash
		// this._errorsHash[property] = false;

		//check for a simple require rule
		// console.log("rules > ");
		// console.log(rules);

		if(rules===true){
			this._validateValueWithRule(property, value, "required", true, null);
		}


		for(var rule in rules){
			if(rules.hasOwnProperty(rule)){
				//validate each rule
				this._validateValueWithRule(property, value, rule, rules[rule], rules[rule+"Error"]);
				//if there is one error break
				if(this._errorsHash[property]) break;
			}
		}

		return !this._errorsHash[property];

	};

	Validator.prototype._validateValueWithRule = function(property, value, rule, param, message){
		// console.log("_validateValueWithRule");
		// console.log("value " + value);

		var failed = false,
			message = "";

		if (typeof this._validators[rule] === 'function') {
			failed = !this._validators[rule].apply(this, [value, param]);
		}

		// console.log("failed " + failed)

		if(failed){
			var source = message || defaults.messages[rule];
			if (source) {
				message = source.replace('%s', property);

				if (param) {
					message = message.replace('%s', param);
				}

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
	      var result = value.split(",");
	      
	      for (var i = 0; i < result.length; i++) {
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

	  decimal: function(value) {
	      return (decimalRegex.test(value));
	  },

	  is_natural: function(value) {
	      return (naturalRegex.test(value));
	  },

	  is_natural_no_zero: function(value) {
	      return (naturalNoZeroRegex.test(value));
	  },

	  valid_ip: function(value) {
	      return (ipRegex.test(value));
	  },

	  valid_base64: function(value) {
	      return (base64Regex.test(value));
	  }
	};

	if (typeof module !== 'undefined' && module.exports) {
		//var _ = require('underscore')._;
		//_.mixin(require('underscore.string'));
		// String.prototype.humanize = function() {
		//   return _(this).underscored().replace('_', ' ');
		// }
		exports.Validator = Validator; 
	} else {
		// var _ = this._;
		// this.newErrors = newErrors;
		// this.validate = validate;
	}

}());