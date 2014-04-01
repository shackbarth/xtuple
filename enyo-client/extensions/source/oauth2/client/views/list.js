/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, enyo:true, console:true */

(function () {
  "use strict";

  XT.extensions.oauth2.initList = function () {
    enyo.kind({
      name: "XV.Oauth2clientList",
      kind: "XV.List",
      label: "_oauth2Clients".loc(),
      collection: "XM.Oauth2clientCollection",
      query: {orderBy: [
        {attribute: 'id'}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "short",
              components: [
              {kind: "XV.ListAttr", attr: "clientID", isKey: true},
              {kind: "XV.ListAttr", attr: "clientType"}
            ]},
            {kind: "XV.ListColumn", classes: "last", fit: true, components: [
              {kind: "XV.ListAttr", attr: "clientName"}
            ]}
          ]}
        ]}
      ]
    });
  };
}());
