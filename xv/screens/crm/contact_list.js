/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, 
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict:true,
trailing:true white:true*/
/*global XT:true, enyo:true, Globalize:true */

(function () {
  "use strict";

  enyo.kind({
    name: "ContactInfoList",
    kind: "XT.InfoList",
    published: {
      label: "_contacts".loc(),
      collection: "XM.ContactInfoCollection",
      query: {orderBy: '"lastName", "firstName"'},
      rowClass: "XT.ContactInfoCollectionRow"
    }
  });

  enyo.kind({
    name: "XT.ContactInfoCollectionRow",
    kind: "XT.InfoListRow",
    leftColumn: [
      [
        { width: 160 },
        { name: "name", classes: "cell-key contact-name" },
        { name: "jobTitle", classes: "contact-job-title",
            placeholder: "_noJobTitle".loc() }
      ],
      [
        { width: 160 },
        { name: "phone", classes: "cell-align-right contact-phone" },
        { name: "primaryEmail", classes: "cell-align-right contact-email" }
      ]
    ],
    rightColumn: [
      [
        { width: 320 },
        { name: "account.name", classes: "cell-italic contact-account-name",
            placeholder: "_noAccountName".loc() },
        { name: "address.formatShort", classes: "contact-account-name" }
      ]
    ]
  });

}());