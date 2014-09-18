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
        At READY_CLEAN, setValue to set meta and enyo components according to user preference form
        print settings if they exist (have been set previously), otherwise, set them according to 
        the values in XM.forms.
      */

    // XXX - These should not be hard coded. Since XM.forms cache has not been created yet can we
    // do a call to the server to return this list of Forms?
    initialize: function (attributes, options) {
      var that = this;
      XM.Document.prototype.initialize.apply(this, arguments);
      this.meta = new Backbone.Model({
        "EnterReceipt": "",
        "Invoice": "",
        "Location": "",
        "PurchaseOrder": "",
        "SalesOrder": "",
        "Shipment": ""
      });

      this.meta.on("change", this.metaChanged());
    },

    handlers: {
      "status:READY_CLEAN": "statusReadyClean"
    },
    /**
      Set this model's FormPrintSettings attribute (User Form Print Settings preference).
      */
    metaChanged: function () {
      this.set("FormPrintSettings", JSON.stringify(this.meta.attributes));
    },
    /**
      Set the meta components (Printer) according to User Form Print Settings saved preferences if
      exist, else use the defaults from XM.forms. 
      */
    statusReadyClean: function () {
      if (this.getStatus() === XM.Model.READY_CLEAN) {
        var that = this,
          userPrefFormPrintSettings = XT.session.preferences.getValue("FormPrintSettings") ? JSON.parse(XT.session.preferences.getValue("FormPrintSettings")) : null,
          formsCache = XM.forms.models;

        if (userPrefFormPrintSettings) {
          _.each(userPrefFormPrintSettings, function (val, key) {
            that.setValue(key, val);
          });
        } else if (formsCache) {
          _.each(formsCache, function (val, key) {
            var attr = val.getValue("name"),
              value = val.getValue("defaultPrinter.name");

            that.setValue(attr, value);
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
