/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {
  "use strict";
  XT.extensions.oauth2.initListRelationsEditorBox = function () {
    // ..........................................................
    // OAUTH2 CLIENT REDIRECT
    //

    enyo.kind({
      name: "XV.Oauth2clientRedirectListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: "redirectURI"}
      ],
      parentKey: "clientID",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "redirectURI"}
              ]}
            ]}
          ]}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.Oauth2clientRedirectEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.InputWidget", attr: "redirectURI"}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.Oauth2clientRedirectBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_redirects".loc(),
      editor: "XV.Oauth2clientRedirectEditor",
      parentKey: "clientID",
      listRelations: "XV.Oauth2clientRedirectListRelations"
    });

  };
}());
