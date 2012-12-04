/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, Globalize:true*/

(function () {

  // ..........................................................
  // USER
  //

  enyo.kind({
    name: "XV.UserOrganizationListRelations",
    kind: "XV.ListRelations",
    orderBy: [
      {attribute: "number"}
    ],
    parentKey: "project",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "first", components: [
            {kind: "FittableColumns", components: [
              {kind: "XV.ListAttr", attr: "name", classes: "bold"},
              {kind: "XV.ListAttr", attr: "username", fit: true, classes: "right"}
            ]}
          ]}
        ]}
      ]}
    ]
  });

}());
