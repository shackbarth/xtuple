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

    dispatchCommitFunction: 'commitPreferences'

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
