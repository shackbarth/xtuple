
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
      { name: "name", classes: "contact-name" },
      { name: "jobTitle", classes: "contact-job-title" }
    ],
    [
      { width: 120 },
      { name: "phone", classes: "contact-phone" },
      { name: "email", classes: "contact-email" }
    ]
  ],
  rightColumn: [
    [
      { width: 320 },
      { name: "account.name", classes: "contact-account-name" }
    ]
  ]
});