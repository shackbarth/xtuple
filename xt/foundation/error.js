// Contributions of status related functionality borrowed from SproutCore:
// https://github.com/sproutcore/sproutcore

/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
/*global XT:true, _:true */

(function () {
  "use strict";
  
  /**
    A standard error object.
  */
  XT.Error = {
    /**
      A unique code for the error.
    */
    code: null,
    
    /**
      A translatable text string.
    */
    messageKey: null,
    
    /**
      Parameters used for interpreting the text string.
    */
    params: {},
    
    // ..........................................................
    // METHODS
    //
    
    /**
      Create a copy of error with `code` if found in XT.errors. If no
      code is found or provided, a copy of `this` instance will be returned.
      
      @param {String} Code
      @param {Hash} Extended properties
      @returns {XT.Error}
    */
    clone: function (code, hash) {
      var ret, found;
      hash = hash || {};
      if (code) {
        found = _.find(XT.errors, function (error) {
          return error.code === code;
        });
      }
      ret = found || this;
      return ret.create.call(ret, hash);
    },
    
    /**
      Create an instance of this error extended with `hash`.
      
      @param {Hash} Extended properties
      @returns {XT.Error}
    */
    create: function (hash) {
      var Error = function () {}, error;
      hash = hash || {};
      Error.prototype = this;
      error = new Error();
      _.extend(error, hash);
      return error;
    },
    
    /**
      Localized message.
    */
    message: function () {
      var message = (this.messageKey || '').loc(),
        param;
      for (param in this.params) {
        if (this.params.hasOwnProperty(param)) {
          message = message.replace("{" + param + "}", this.params[param].loc());
        }
      }
      return message;
    }
    
  };
  
  var errors = [
    // Core errors
    {
      code: "xt1001",
      params: {
        error: '_unknown'
      },
      messageKey: "_datasourceError",
    }, {
      code: "xt1002",
      params: {
        attr: '_unknown'
      },
      messageKey: "_attributeNotInSchema",
    }, {
      code: "xt1003",
      params: {
        attr: '_unknown',
        type: '_unknown',
      },
      messageKey: "_attributeTypeMismatch",
    }, {
      code: "xt1004",
      params: {
        attr: '_unknown'
      },
      messageKey: "_attributeIsRequired",
    }, {
      code: "xt1005",
      messageKey: "_attributeReadOnly",
    }, {
      code: "xt1006",
      params: {
        attr: '_unknown',
        length: '_unknown',
      },
      messageKey: "_lengthInvalid",
    }, {
      code: "xt1007",
      messageKey: "_recordNotFound",
    }, {
      code: "xt1008",
      params: {
        attr: '_unknown',
        value: '_unknown',
      },
      messageKey: "_valueExists",
    }, {
      code: "xt1009",
      params: {
        status: '_unknown'
      },
      messageKey: "_recordStatusNotEditable",
    }, {
      code: "xt1010",
      messageKey: "_canNotUpdate",
    },
  
    // Application errors
  
    {
      code: "xt2001",
      messageKey: "_assignedToRequiredAssigned",
    }, {
      code: "xt2002",
      messageKey: "_characteristicContextRequired",
    }, {
      code: "xt2003",
      messageKey: "_duplicateValues",
    }, {
      code: "xt2004",
      messageKey: "_nameRequired",
    }, {
      code: "xt2005",
      messageKey: "_productCategoryRequiredOnSold",
    }, {
      code: "xt3006",
      messageKey: "_recursiveParentDisallowed",
    }
  ], i;
  
  // Instaniate error objects
  XT.errors = [];
  _.each(errors, function (error) {
    var obj = XT.Error.create(error);
    XT.errors.push(obj);
  });

}());