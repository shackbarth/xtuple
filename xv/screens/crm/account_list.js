/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true white:true*/
/*global XT:true, enyo:true, Globalize:true */

(function () {
  "use strict";

  enyo.kind({
    name: "XT.AccountInfoList",
    kind: "XT.InfoList",
    rowClass: "XT.AccountInfoCollectionRow"
  });

  enyo.kind({
    name: "XT.AccountInfoCollectionRow",
    kind: "XT.InfoListRow",
    leftColumn: [
      [
        { width: 160 },
        { name: "number", classes: "cell-key account-number" },
        { name: "name", classes: "account-name", placeholder: "_noJobTitle".loc() }
      ],
      [
        { width: 160 },
        { name: "primaryContact.phone", classes: "cell-align-right account-primaryContact-phone" },
        { name: "primaryContact.primaryEmail", classes: "cell-align-right account-primaryContact-primaryEmail" }
      ]
    ],
    rightColumn: [
      [
        { width: 320 },
        { name: "primaryContact.name", classes: "cell-italic account-primaryContact-name", placeholder: "_noContact".loc() },
        { name: "primaryContact.address.formatShort", classes: "account-primaryContact-address" }
      ]
    ]
  });

}());