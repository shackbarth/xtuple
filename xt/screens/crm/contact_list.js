
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
      { name: "name", classes: "contact-name" }
    ]
  ],
  rightColumn: [
    [
      { width: 70 },
      { name: "phone", classes: "contact-phone" },
      { name: "primaryEmail", classes: "contact-primary-email" }
    ]
  ]
});