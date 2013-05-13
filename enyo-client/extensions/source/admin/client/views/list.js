/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, Globalize:true*/

(function () {
  // ..........................................................
  // USER
  //

  enyo.kind({
    name: "XV.UserList",
    kind: "XV.List",
    label: "_users".loc(),
    collection: "XM.UserCollection",
    query: {orderBy: [
      {attribute: 'id'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", components: [
            {kind: "XV.ListAttr", attr: "id", isKey: true}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // DATABASE SERVER
  //
  enyo.kind({
    name: "XV.DatabaseServerList",
    kind: "XV.NameDescriptionList",
    parameterWidget: "XV.DatabaseServerParameters"
  });

  // ..........................................................
  // ORGANIZATION
  //
  enyo.kind({
    name: "XV.OrganizationList",
    kind: "XV.NameDescriptionList",
    parameterWidget: "XV.OrganizationParameters"
  });

  // ..........................................................
  // EXTENSION
  //
  enyo.kind({
    name: "XV.ExtensionList",
    kind: "XV.NameDescriptionList"
  });

  // ..........................................................
  // CAMPAIGN
  //

  enyo.kind({
    name: "XV.CampaignList",
    kind: "XV.List",
    label: "_campaigns".loc(),
    collection: "XM.CampaignRelationCollection",
    parameterWidget: "XV.CampaignParameters",
    query: {orderBy: [
      {attribute: 'id'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", components: [
            {kind: "XV.ListAttr", attr: "number", isKey: true},
            {kind: "XV.ListAttr", attr: "description"},
          ]}
        ]}
      ]}
    ]
  });

}());
