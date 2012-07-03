/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true white:true */

/*global XT:true, enyo:true, Globalize:true, _:true */

(function () {
  "use strict";

  enyo.kind({
    name: "XT.IncidentInfoList",
    kind: "XT.InfoList",
    rowClass: "XT.IncidentInfoCollectionRow"
  });

  enyo.kind({
    name: "XT.IncidentInfoCollectionRow",
    kind: "XT.InfoListRow",
    leftColumn: [
      [
        { width: 200 },
        { name: "number", classes: "incident-number" },
        { name: "name", classes: "incident-name" },
        { name: "account.name", classes: "incident-account-name" }
      ],
      [
        { width: 120 },
        { name: "updated", classes: "incident-last-updated", formatter: "formatDate" }
      ]
    ],
    rightColumn: [
      [
        { width: 70 },
        { name: "getIncidentStatusString", classes: "incident-status" },
        { name: "owner.username", classes: "incident-owner-username" }
      ]
    ],
    formatDate: function (content) {
      return Globalize.format(new Date(content), 'd');
    }
  });

}());