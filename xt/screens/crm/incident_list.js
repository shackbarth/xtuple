/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true white:true */

/*global XT:true, enyo:true, Globalize:true,*/

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
        { name: "number", classes: "cell-key project-number" },
        { name: "description", classes: "cell incident-description" }
      ],
      [
        { width: 120 },
        { name: "updated", classes: "cell-align-right incident-updated", formatter: "formatDate" }
      ]
    ],
    rightColumn: [
      [
        { width: 165 },
        { name: "account.name", classes: "cell-italic incident-account-name" },
        { name: "contact.getName", classes: "incident-contact-name" }
      ],
      [
        { width: 75 },
        { name: "getIncidentStatusString", classes: "incident-status" },
        { name: "owner.username", classes: "incident-owner-username" }
      ],
      [
        { width: 75 },
        { name: "priority.name", classes: "incident-priority" },
        { name: "category.name", classes: "incident-category" }
      ]
    ],
    formatDate: function (content, model, view) {
      var today = new Date();
      if (XT.date.compareDate(content, today)) {
        view.removeClass("bold");
      } else {
        view.addClass("bold");
      }
      return content;
    }
  });

}());