/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class
    
    Includes functionality common to xTuple documents uniquely identified by
    a user accessible `documentKey'.
  */
  XM.Document = XT.Model.extend({
    /** @scope XM.Document */
    
    documentKey: 'number',

    // ..........................................................
    // METHODS
    //
    
    initialize: function () {
      XT.Model.prototype.initialize.apply(this, arguments);
      this.on('change:' + this.documentKey, this.documentKeyDidChange);
    },
    
    /**
      This version of `save` first checks to see if the document key already
      exists before committing.
    */
    save: function (key, value, options) {
      var model = this,
        attrValue = this.get(this.documentKey),
        checkOptions = {};
      checkOptions.success = function (resp) {
        var err = 'Save failed. Document with key of "' +
                  attrValue + '" already exists.';
        if (resp === 0) {
          XT.Model.prototype.save.call(model, key, value, options);
        } else {
          model.trigger('error', model, err, options);
        }
      };
      checkOptions.error = Backbone.wrapError(null, model, options);
      this.findExisting(this.documentKey, attrValue, checkOptions);
    },
    
    documentKeyDidChange: function () {
      var documentKey = this.documentKey,
        value = this.get(documentKey),
        upper = value ? value.toUpperCase() : undefined,
        model = this,
        options = {};
      if (value !== upper) {
        this.set(this.documentKey, upper); // Will check existing on next pass
      } else if (value) {
        options.success = function (resp) {
          var err = 'Document with key of "' +
                    value + '" already exists.';
          if (resp) {
            model.trigger('error', model, err, options);
          }
        };
        this.findExisting(documentKey, value, options);
      }
    }
  });

}());