/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {
    "_assignedIncidents": "Assigned Incidents",
    "_crm": "CRM",
    "_crmDescription": "Corporate Relationship Management",
    "_highPriority": "High Priority",
    "_incidentDefaultPublic": "Comment Default Public",
    "_incidentStatusColors": "Incident Status Colors",
    "_opportunitiesNext30Days": "Opportunities Next 30 Days",
    "_maintainEmailProfiles": "Maintain Email Profiles",
    "_viewEmailProfiles": "View Email Profiles"
  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
