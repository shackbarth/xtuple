/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @namespace
    
    Includes functionality common to xTuple documents uniquely identified by
    a user accessible `documentKey'.
  */
  XM.DocumentMixin = {
    /** @scope XM.DocumentMixin */
    
    documentKey: 'number',
    
    /**
      This version of `save` first checks to see if the document key already
      exists before committing.
    */
    save: function (key, value, options) {
      var model = this,
        documentKey = this.documentKey,
        attrValue = this.get(documentKey),
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
      this.findExisting(documentKey, attrValue, checkOptions);
    }

  };

}());