/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Settings
  */
  XM.UserPreference = XM.Settings.extend(/** @lends XM.UserPreference.prototype */{

    recordType: 'XM.UserPreference',

    privileges: "MaintainPreferencesSelf",

    dispatchRecordType: 'XT.Session',

    dispatchFetchFunction: 'preferences',

    dispatchCommitFunction: 'commitPreferences',

    /** Components added in enyo using XM.forms. The same attributes are here in meta. 
        At READY_CLEAN, set meta and enyo components according to user preference form
        print settings if they exist (have been set previously).
    */
    initialize: function (attributes, options) {
      XM.Model.prototype.initialize.apply(this, arguments);
      
      this.meta = new Backbone.Model();
      this.meta.set(XM.printableObjects);
      this.meta.on("change", this.metaChanged());
    },

    handlers: {
      "status:READY_CLEAN": "statusReadyClean"
    },
    /**
      Set this model's PrintSettings attribute (User Form Print Settings preference).
    */
    metaChanged: function () {
      this.setStatus(XM.Model.READY_DIRTY);
    },
    save: function (key, value, options) {
      var printSettings = JSON.stringify(this.meta.attributes); //[this.meta.attributes];
      this.set("PrintSettings", printSettings);
      XM.Settings.prototype.save.apply(this, arguments);
    },
    /**
      Set the meta components (Printer) according to User Print Settings preferences (if existent). 
    */
    statusReadyClean: function () {
      if (this.getStatus() === XM.Model.READY_CLEAN) {
        var that = this,
          // This looks ugly!
          userPrintPref = _.isString(XT.session.preferences.getValue("PrintSettings")) ?
            JSON.parse(XT.session.preferences.getValue("PrintSettings")) :
            XT.session.preferences.getValue("PrintSettings"),
          formsObject = XM.printableObjects;

        if (userPrintPref) {
          _.each(userPrintPref, function (val, key) {
            that.setValue(key, val);
          });
        } else if (formsObject) { // reset the meta object.
          _.each(formsObject, function (val, key) {
            that.setValue(key, val);
          });
        }
      }
    }
  });

  /**
    @class

    @extends XM.Settings
  */
  XM.DatabaseInformation = XM.Settings.extend({
    /** @scope XM.DatabaseInformation.prototype */

    recordType: 'XM.DatabaseInformation',

    privileges: 'ConfigDatabaseInfo',

    readOnlyAttributes: [
      "DatabaseName",
      "ServerVersion"
    ]
  });
  XM.databaseInformation = new XM.DatabaseInformation();

  /**
    @class

    @extends XM.Settings
  */
  XM.System = XM.Settings.extend({
    /** @scope XM.SystemConfiguration.prototype */

    recordType: 'XM.System',

    privileges: 'ConfigureCC' // TODO: expand once we can do more than just credit card processing here
  });
  XM.system = new XM.System();

}());
