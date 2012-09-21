/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, Globalize:true*/

(function () {
  
  XT.extensions.connect.initLists = function () {
    // ..........................................................
    // INCIDENT EMAIL PROFILE
    //
  
    enyo.kind({
      name: "XV.IncidentEmailProfileList",
      kind: "XV.List",
      label: "_incidentEmailProfiles".loc(),
      collection: "XM.IncidentEmailProfileCollection",
      query: {orderBy: [
        {attribute: 'name'}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "short",
              components: [
              {kind: "XV.ListAttr", attr: "name", classes: "bold"}
            ]},
            {kind: "XV.ListColumn", classes: "last", fit: true, components: [
              {kind: "XV.ListAttr", attr: "description"}
            ]}
          ]}
        ]}
      ]
    });
  };

}());
