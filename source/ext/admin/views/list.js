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
    label: "_globalUsers".loc(),
    collection: "XM.UserCollection",
    //parameterWidget: "XV.UserListParameters",
    query: {orderBy: [
      {attribute: 'id'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short", components: [
            {kind: "XV.ListAttr", attr: "id", classes: "bold"}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // DATABASE SERVER
  // TODO: move the superkind from client to enyo-x if admin is standalone
  enyo.kind({
    name: "XV.DatabaseServerList",
    kind: "XV.NameDescriptionList"
  });

  // ..........................................................
  // ORGANIZATION
  //
  enyo.kind({
    name: "XV.OrganizationList",
    kind: "XV.NameDescriptionList"
  });

}());
