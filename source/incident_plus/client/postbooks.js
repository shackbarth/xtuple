/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.incidentPlus.initPostbooks = function () {
    var relevantPrivileges = [
      "AccessIncidentPlusExtension"
    ];
    XT.session.addRelevantPrivileges("crm", relevantPrivileges);

  };

}());
