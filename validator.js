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

	var Validator = function(rules) {
		this.errors = [];
		this.fields = {};

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

	 Validator.prototype.validate = function(event) {
        this.errors = [];

        for (var key in this.fields) {
            if (this.fields.hasOwnProperty(key)) {
                var field = this.fields[key] || {},
                    element = this.form[field.name];

                if (element && element !== undefined) {
                    field.type = element.type;
                    field.value = element.value;
                    field.checked = element.checked;
                }

                /*
                 * Run through the rules for each field.
                 */

                this._validateField(field);
            }
        }

        if (typeof this.callback === 'function') {
            this.callback(this.errors, event);
        }

        if (this.errors.length > 0) {
            if (event && event.preventDefault) {
                event.preventDefault();
            } else {
                // IE6 doesn't pass in an event parameter so return false
                return false;
            }
        }

        return true;
    };

    Validator.prototype._validateField = function(field) {
        var rules = field.rules.split('|');

        /*
         * If the value is null and not required, we don't need to run through validation
         */

        if (field.rules.indexOf('required') === -1 && (!field.value || field.value === '' || field.value === undefined)) {
            return;
        }

        /*
         * Run through the rules and execute the validation methods as needed
         */

        for (var i = 0, ruleLength = rules.length; i < ruleLength; i++) {
            var method = rules[i],
                param = null,
                failed = false;

            /*
             * If the rule has a parameter (i.e. matches[param]) split it out
             */

            if (parts = ruleRegex.exec(method)) {
                method = parts[1];
                param = parts[2];
            }

            /*
             * If the hook is defined, run it to find any validation errors
             */

            if (typeof this._hooks[method] === 'function') {
                if (!this._hooks[method].apply(this, [field, param])) {
                    failed = true;
                }
            } else if (method.substring(0, 9) === 'callback_') {
                // Custom method. Execute the handler if it was registered
                method = method.substring(9, method.length);

                if (typeof this.handlers[method] === 'function') {
                    if (this.handlers[method].apply(this, [field.value]) === false) {
                        failed = true;
                    }
                }
            }

            /*
             * If the hook failed, add a message to the errors array
             */

            if (failed) {
                // Make sure we have a message for this rule
                var source = this.messages[method] || defaults.messages[method];

                if (source) {
                    var message = source.replace('%s', field.display);

                    if (param) {
                        message = message.replace('%s', (this.fields[param]) ? this.fields[param].display : param);
                    }

                    this.errors.push(message);
                } else {
                    this.errors.push('An error has occurred with the ' + field.display + ' field.');
                }

                // Break out so as to not spam with validation errors (i.e. required and valid_email)
                break;
            }
        }
    };

	Validator.prototype._hooks = {
	  required: function(field) {
	      var value = field.value;

	      if (field.type === 'checkbox') {
	          return (field.checked === true);
	      }

	      return (value !== null && value !== '');
	  },

	  matches: function(field, matchName) {
	      if (el = this.form[matchName]) {
	          return field.value === el.value;
	      }

	      return false;
	  },

	  valid_email: function(field) {
	      return emailRegex.test(field.value);
	  },

	  valid_emails: function(field) {
	      var result = field.value.split(",");
	      
	      for (var i = 0; i < result.length; i++) {
	          if (!emailRegex.test(result[i])) {
	              return false;
	          }
	      }
	      
	      return true;
	  },

	  min_length: function(field, length) {
	      if (!numericRegex.test(length)) {
	          return false;
	      }

	      return (field.value.length >= parseInt(length, 10));
	  },

	  max_length: function(field, length) {
	      if (!numericRegex.test(length)) {
	          return false;
	      }

	      return (field.value.length <= parseInt(length, 10));
	  },

	  exact_length: function(field, length) {
	      if (!numericRegex.test(length)) {
	          return false;
	      }
	      
	      return (field.value.length === parseInt(length, 10));
	  },

	  greater_than: function(field, param) {
	      if (!decimalRegex.test(field.value)) {
	          return false;
	      }

	      return (parseFloat(field.value) > parseFloat(param));
	  },

	  less_than: function(field, param) {
	      if (!decimalRegex.test(field.value)) {
	          return false;
	      }

	      return (parseFloat(field.value) < parseFloat(param));
	  },

	  alpha: function(field) {
	      return (alphaRegex.test(field.value));
	  },

	  alpha_numeric: function(field) {
	      return (alphaNumericRegex.test(field.value));
	  },

	  alpha_dash: function(field) {
	      return (alphaDashRegex.test(field.value));
	  },

	  numeric: function(field) {
	      return (decimalRegex.test(field.value));
	  },

	  integer: function(field) {
	      return (integerRegex.test(field.value));
	  },

	  decimal: function(field) {
	      return (decimalRegex.test(field.value));
	  },

	  is_natural: function(field) {
	      return (naturalRegex.test(field.value));
	  },

	  is_natural_no_zero: function(field) {
	      return (naturalNoZeroRegex.test(field.value));
	  },

	  valid_ip: function(field) {
	      return (ipRegex.test(field.value));
	  },

	  valid_base64: function(field) {
	      return (base64Regex.test(field.value));
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