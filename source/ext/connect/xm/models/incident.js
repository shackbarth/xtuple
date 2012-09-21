/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.connect.initIncidentModels = function () {
    
    // Get original save function
    var save = XM.Incident.prototype.save;
    
    // Define email processing
    var sendEmail = function () {
      XT.log('sending email');
    };
    
    // Extend save function to generate email
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
