// Contributions of status related functionality borrowed from SproutCore:
// https://github.com/sproutcore/sproutcore

/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true,
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*global XT:true, _:true */

(function () {
  "use strict";

  /**
    @name XT.Error
    @class A standard error object. Standard errors are created and pushed into
    `XT.errors` on application startup. You should use the `clone` function
    to find and create a copy of an error for use in reporting in the
    application. Errors may include one or more parameters that can be replaced
    at runtime to add context to the error message.

      var params, err;
      params = {
        attr: 'name',
        type: 'String'
      }
      err = XT.Error.clone('xt1003', { params: params });
      return err.message(); // returns "The value of 'name' must be type: String."

    Note: You should always use `clone` to make an error rather than reference
    the error from `XT.errors` directly. Otherwise if you set `params` on the
    orginial error, you will be setting parameters for that error globally.

  */
  XT.Error = function () {};
  XT.Error.prototype = {
    /** @scope XT.Error.prototype */

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
      Localized message calculated from `messageKey` and `params`.
    */
    message: function () {
      var message = (this.messageKey || '').loc(),
        param,
        loc;
      for (param in this.params) {
        if (this.params.hasOwnProperty(param)) {
          var paramValue = this.params[param];
          if (!_.isString(paramValue)) {
            paramValue = JSON.stringify(paramValue);
          }
          loc = (paramValue || '_unknown').loc();
          message = message.replace("{" + param + "}", loc);
        }
      }
      return message;
    }

  };

  // Class methods
  _.extend(XT.Error, /** @lends XT.Error# */{

    /**
      Create a copy of error with `code` found in XT.errors.
      If an error with a matching code is not found, returns false.

      @param {String} Code
      @param {Hash} Extended properties
      @returns {XT.Error}
    */
    clone: function (code, hash) {
      var found;
      hash = hash || {};
      if (code) {
        found = _.find(XT.errors, function (error) {
          return error.code === code;
        });
        if (!found) { return false; }
      }
      found = _.clone(found);
      if (found.params) {
        found.params = _.clone(found.params);
      }
      _.extend(found, hash);
      return XT.Error.create(found);
    },

    /**
      Create an instance of `XT.error` extended with `hash`.

      @param {Hash} Extended properties
      @returns {XT.Error}
    */
    create: function (hash) {
      var error;
      hash = hash || {};
      error = new XT.Error();
      _.extend(error, hash);
      return error;
    }

  });

  var errors = [

    // Core errors
    {
      code: "xt1001",
      params: {
        error: null
      },
      messageKey: "_datasourceError"
    }, {
      code: "xt1002",
      params: {
        attr: null
      },
      messageKey: "_attributeNotInSchema"
    }, {
      code: "xt1003",
      params: {
        attr: null,
        type: null
      },
      messageKey: "_attributeTypeMismatch"
    }, {
      code: "xt1004",
      params: {
        attr: null
      },
      messageKey: "_attributeIsRequired"
    }, {
      code: "xt1005",
      messageKey: "_attributeReadOnly"
    }, {
      code: "xt1006",
      params: {
        attr: null,
        length: null
      },
      messageKey: "_lengthInvalid"
    }, {
      code: "xt1007",
      messageKey: "_recordNotFound"
    }, {
      code: "xt1008",
      params: {
        attr: null,
        value: null
      },
      messageKey: "_valueExists"
    }, {
      code: "xt1009",
      params: {
        status: null
      },
      messageKey: "_recordStatusNotEditable"
    }, {
      code: "xt1010",
      messageKey: "_canNotUpdate"
    },
    {
      code: "xt1011",
      messageKey: "_localResourceNotAllowed"
    },
    {
      code: "xt1012",
      messageKey: "_saveFirst"
    },
    {
      code: "xt1013",
      params: {
        attr: null,
        value: null
      },
      messageKey: "_invalidValue"
    },

    // Application errors (move up to enyo-client?)
    {
      code: "xt2001",
      messageKey: "_assignedToRequiredAssigned"
    }, {
      code: "xt2002",
      messageKey: "_characteristicContextRequired"
    }, {
      code: "xt2003",
      messageKey: "_duplicateValues"
    }, {
      code: "xt2004",
      messageKey: "_nameRequired"
    }, {
      code: "xt2005",
      messageKey: "_productCategoryRequiredOnSold"
    }, {
      code: "xt2006",
      messageKey: "_recursiveParentDisallowed"
    }, {
      code: "xt2007",
      messageKey: "_addressShared"
    }, {
      code: "xt2008",
      messageKey: "_countryInvalid"
    }, {
      code: "xt2009",
      messageKey: "_invalidAddress"
    }, {
      code: "xt2010",
      messageKey: "_currencyRateNotFound"
    }, {
      code: "xt2011",
      messageKey: "_totalMustBePositive"
    }, {
      code: "xt2012",
      messageKey: "_lineItemsRequired"
    }, {
      code: "xt2013",
      messageKey: "_quantityMustBePositive"
    }, {
      code: "xt2014",
      messageKey: "_notFractional"
    }, {
      code: "xt2015",
      params: {
        start: null,
        end: null
      },
      messageKey: "_endPriorToStart"
    }, {
      code: "xt2016",
      messageKey: "_passwordsDoNotMatch"
    }, {
      code: "xt2017",
      messageKey: "_incompleteDistribution"
    }, {
      code: "xt2018",
      messageKey: "_missingExtensionDependency"
    }, {
      code: "xt2019",
      messageKey: "_negativeQuantityNoAverage"
    }, {
      code: "xt2020",
      messageKey: "_stockedMustReorder"
    }, {
      code: "xt2021",
      messageKey: "_itemSiteActiveItemInactive"
    }, {
      code: "xt2022",
      messageKey: "_canNotCreateOrderOnCreditWarn"
    }, {
      code: "xt2023",
      messageKey: "_canNotCreateOrderOnCreditHold"
    }, {
      code: "xt2024",
      messageKey: "_taxesMustNotBeGreater"
    }, {
      code: "xt2025",
      messageKey: "_orderWithActivityNoUnrelease"
    }, {
      code: "xt2026",
      messageKey: "_distributionMustNotBeGreater"
    }
  ];

  // Instaniate error objects
  XT.errors = [];
  XT.Error.addError = function (error) {
    var obj = XT.Error.create(error);
    XT.errors.push(obj);
  };
  _.each(errors, XT.Error.addError);

}());
