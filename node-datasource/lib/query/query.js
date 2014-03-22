/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true,
noarg:true, regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global _:true */

(function () {
  'use strict';

  /**
   * A database query structured as a javascript object.
   * @constructor Query
   * @param {Object}
   */
  function Query(query) {
    if (!this.template) {
      return new Error('subclasses must set the template field');
    }
    this.error = {
      errors: [],
      message: null,
      code: null
    };
    this.query = _.clone(query);
    this.valid = _.test(this.template, query, this.error.errors);
  }

  Query.prototype = Object.create({

    /**
     * Returns true if this query is valid; false otherwise.
     * @public
     */
    isValid: function () {
      if (!this.valid) {
        this.setErrors({message: "Bad Request", code: 400});
      }

      return this.valid;
    },

    /**
     * Get error messages and convert to REST HTTP error.
     * @public
     */
    getErrors: function () {
      // Google style error object.
      var error = {
        error: this.error
      };

      return error;
    },

    /**
     * Set errors, message and code.
     * @param {object} errors array, message and code.
     * @public
     */
    setErrors: function (error) {
      this.error.errors = error.errors || [];
      this.error.message = error.message || null;
      this.error.code = error.code || null;
    }
  });

  module.exports = Query;
})();
