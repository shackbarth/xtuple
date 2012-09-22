/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.connect.initIncidentModels = function () {
    
    // Define email processing
    var sendEmail = function () {
      var that = this,
        profile = this.getValue('category.emailProfile'),
        from,
        to,
        cc,
        bcc,
        subject,
        body,
        format = function (str) {
          var parser = /\{([^}]+)\}/g, // Finds curly braces
            tokens,
            attr;
          tokens = str.match(parser);
          _.each(tokens, function (token) {
            attr = token.slice(1, token.indexOf('}'));
            body = body.replace(token, that.getValue(attr));
          });
        };
      if (profile) {
        from = format(profile.get('from') || "");
        to = format(profile.get('to') || "");
        cc = format(profile.get('cc') || "");
        bcc = format(profile.get('bcc') || "");
        subject = format(profile.get('subject') || "");
        body = format(profile.get('body') || "");
      }
    };
    
    // Enhance `save` function to generate email after successful commit
    // We don't use `extend` to avoid risk of over-writing something else
    // Instead inject `options` into existing save function
    var save = XM.Incident.prototype.save;
    XM.Incident.prototype.save = function (key, value, options) {
      options = options ? _.clone(options) : {};
      var that = this,
        success = options.success;
      options.success = function (model, resp, options) {
        sendEmail.call(that);
        if (success) { success(model, resp, options); }
      };
      
      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || _.isEmpty(key)) {
        value = options;
      }
      
      // Now call the original
      save.call(this, key, value, options);
    };
    
    /**
      @class

      @extends XM.Model
    */
    XM.IncidentEmailProfile = XM.Document.extend(
      /** @scope XM.IncidentEmailProfile.prototype */ {

      recordType: 'XM.IncidentEmailProfile',
    
      documentKey: 'name'

    });
  
    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.IncidentEmailProfileCollection = XM.Collection.extend({
      /** @scope XM.IncidentEmailProfileCollection.prototype */

      model: XM.IncidentEmailProfile

    });
  };

}());
