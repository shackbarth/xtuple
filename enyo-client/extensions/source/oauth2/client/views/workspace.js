/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global XT:true, XV:true, Backbone:true, enyo:true, console:true */

(function () {

  XT.extensions.oauth2.initWorkspace = function () {
    enyo.kind({
      name: "XV.Oauth2clientWorkspace",
      kind: "XV.Workspace",
      title: "_oauth2Client".loc(),
      model: "XM.Oauth2client",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
                classes: "in-panel", components: [
              {kind: "onyx.GroupboxHeader", content: "_id".loc()},
              {kind: "XV.TextArea", attr: "clientID", classes: "xv-short-textarea" },
              {kind: "onyx.GroupboxHeader", content: "_secret".loc()},
              {kind: "XV.TextArea", attr: "clientSecret", classes: "xv-short-textarea" },
              {kind: "onyx.GroupboxHeader", content: "_details".loc()},
              {kind: "XV.InputWidget", attr: "clientName", label: "_name".loc()},
              {kind: "XV.InputWidget", attr: "clientEmail", label: "_email".loc()},
              {kind: "XV.InputWidget", attr: "clientWebSite", label: "_website".loc()},
              {kind: "XV.InputWidget", attr: "clientLogo", label: "_logoURL".loc()},
              {kind: "XV.Oauth2clientTypePicker", attr: "clientType"},
              {kind: "XV.CheckboxWidget", attr: "isActive"},
              {kind: "XV.DateWidget", attr: "issued"},
              {kind: "XV.InputWidget", attr: "organization"},
              {kind: "XV.CheckboxWidget", name: "delegatedAccess", attr: "delegatedAccess"},
              {kind: "onyx.GroupboxHeader", content: "_x509PubCert".loc()},
              {kind: "XV.TextArea", name: "clientX509PubCert", attr: "clientX509PubCert"},
              {kind: "onyx.GroupboxHeader", content: "_fullListUrl".loc()},
              {kind: "XV.TextArea", name: "fullListUrl", classes: "xv-short-textarea", disabled: true},
              {kind: "onyx.GroupboxHeader", content: "_singleResourceUrl".loc()},
              {kind: "XV.TextArea", name: "singleResourceUrl", classes: "xv-short-textarea", disabled: true},
              {kind: "onyx.GroupboxHeader", content: "_authURI".loc()},
              {kind: "XV.TextArea", name: "authURI", classes: "xv-short-textarea", disabled: true},
              {kind: "onyx.GroupboxHeader", content: "_tokenURI".loc()},
              {kind: "XV.TextArea", name: "tokenURI", classes: "xv-short-textarea", disabled: true},
              {kind: "onyx.GroupboxHeader", content: "_tokenRevocationURI".loc()},
              {kind: "XV.TextArea", name: "tokenRevocationURI", classes: "xv-short-textarea", disabled: true}
            ]}
          ]},
          {kind: "XV.Oauth2clientRedirectBox", name: "redirectBox", attr: "redirectURIs", showing: false}
        ]}
      ],
      create: function () {
        var base = XT.getBaseUrl() + XT.getOrganizationPath();
        this.inherited(arguments);

        this.$.fullListUrl.setValue(base + "/discovery/v1alpha1/apis/v1alpha1/rest");
        this.$.singleResourceUrl.setValue(base + "/discovery/v1alpha1/apis/:model/v1alpha1/rest");
        this.$.authURI.setValue(base + "/dialog/authorize");
        this.$.tokenURI.setValue(base + "/oauth/token");
        this.$.tokenRevocationURI.setValue(base + "/oauth/revoke-token");
      },
      attributesChanged: function (model, options) {
        this.inherited(arguments);

        var serviceAccount = model.get("clientType") === 'jwt bearer',
          webServer = model.get("clientType") === 'web server';

        // Delegated Access is only meaningful for Service Accounts
        this.$.delegatedAccess.setShowing(serviceAccount);
        this.$.clientX509PubCert.setShowing(serviceAccount);
        this.$.redirectBox.setShowing(webServer);
        // There is some rendering issue with this box that this fixes w/o css
        this.$.redirectBox.render();
      }
    });

    XV.registerModelWorkspace("XM.Oauth2client", "XV.Oauth2clientWorkspace");
  };
}());
