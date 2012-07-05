/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true white:true*/
/*global XT:true, enyo:true, Globalize:true */

(function () {
  "use strict";

  enyo.kind({
    name: "XT.ContactInfoList",
    kind: "XT.InfoList",
    rowClass: "XT.ContactInfoCollectionRow"
  });

  enyo.kind({
    name: "XT.ContactInfoCollectionRow",
    kind: "XT.InfoListRow",
    leftColumn: [
      [
        { width: 200 },
        { name: "name", classes: "cell-key contact-name" },
        { name: "jobTitle", classes: "contact-job-title" }
      ],
      [
        { width: 120 },
        { name: "phone", classes: "cell-align-right contact-phone" },
        { name: "primaryEmail", classes: "cell-align-right contact-email" }
      ]
    ],
    rightColumn: [
      [
        { width: 320 },
        { name: "account.name", classes: "contact-account-name" },
        { name: "address.formatShort", classes: "contact-account-name" }
      ]
    ]
  });

}());