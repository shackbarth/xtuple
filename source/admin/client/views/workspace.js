/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true, alert:true _:true */

(function () {

  // ..........................................................
  // USER
  //

  enyo.kind({
    name: "XV.UserWorkspace",
    kind: "XV.Workspace",
    title: "_user".loc(),
    headerAttrs: ["id", "-", "properName"],
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "id", label: "_userName".loc()},
            {kind: "XV.CheckboxWidget", attr: "isActive"},
            {kind: "XV.InputWidget", attr: "properName"},
            {kind: "XV.InputWidget", attr: "email"},
            {kind: "onyx.Popup", name: "resetPasswordPopup", centered: true,
              modal: true, floating: true, scrim: true, components: [
              {content: "_resetPasswordConfirmation".loc() },
              {tag: "br"},
              {kind: "onyx.Button", content: "_ok".loc(), ontap: "resetPassword",
                classes: "xv-popup-button"},
              {kind: "onyx.Button", content: "_cancel".loc(),
                ontap: "closeResetPasswordPopup",
                classes: "onyx-blue xv-popup-button"}
            ]},
            {kind: "onyx.Button", name: "resetPasswordButton",
              content: "_resetPassword".loc(),
              ontap: "warnResetPassword",
              style: "border-radius: 4px; margin: 8px;",
              showing: false}
          ]}
        ]},
        {kind: "XV.UserOrganizationsBox", attr: "organizations"},
        {kind: "XV.Groupbox", name: "privilegePanel", classes: "xv-assignment-box",
            title: "_privileges".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_privileges".loc()},
          {kind: "XV.UserGlobalPrivilegeAssignmentBox", attr: "privileges" }
        ]}
      ]}
    ],
    /**
      Called if the user does not really want to reset the password. Just closes the popup.
     */
    closeResetPasswordPopup: function () {
      this.$.resetPasswordPopup.hide();
    },
    model: "XM.User",
    resetPassword: function (inSender, inEvent) {
      if (this.$.resetPasswordPopup) {
        this.$.resetPasswordPopup.hide();
      }

      this.getValue().resetPassword(inEvent.newUser);
    },
    /**
      We only want the "reset password" button to appear on an edit, not an a "new"
     */
    statusChanged: function (model, status, options) {
      this.inherited(arguments);
      if (status === XM.Model.READY_CLEAN) {
        this.$.resetPasswordButton.setShowing(true);
      }
    },
    /**
      Pops up the reset password popup to verify that we really want to reset a password.
     */
    warnResetPassword: function () {
      this.$.resetPasswordPopup.show();
    }
  });

  XV.registerModelWorkspace("XM.User", "XV.UserWorkspace");

  // ..........................................................
  // DATABASE SERVER
  //

  enyo.kind({
    name: "XV.DatabaseServerWorkspace",
    kind: "XV.Workspace",
    title: "_databaseServer".loc(),
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.InputWidget", attr: "hostname"},
            {kind: "XV.InputWidget", attr: "port"},
            {kind: "XV.InputWidget", attr: "user"},
            {kind: "XV.InputWidget", attr: "password", type: "password"},
            {kind: "XV.InputWidget", attr: "location"}
          ]}
        ]}
      ]}
    ],
    model: "XM.DatabaseServer"
  });

  XV.registerModelWorkspace("XM.DatabaseServer", "XV.DatabaseServerWorkspace");

  // ..........................................................
  // ORGANIZATION
  //

  enyo.kind({
    name: "XV.OrganizationWorkspace",
    kind: "XV.Workspace",
    title: "_organization".loc(),
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.CheckboxWidget", attr: "isActive"},
            {kind: "XV.InputWidget", attr: "group"},
            {kind: "XV.NumberWidget", attr: "licenses"},
            {kind: "XV.DatabaseServerWidget", attr: "databaseServer"}
          ]}
        ]},
        {kind: "XV.Groupbox", name: "extensionPanel", classes: "xv-assignment-box",
            title: "_extensions".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_extensions".loc()},
          {kind: "XV.OrganizationExtensionAssignmentBox", attr: "extensions" }
        ]}
      ]}
    ],
    /**
      As a shortcut we associate the admin user with the organization if it's new
     */
    associateAdminUser: function (orgModel) {
      var userOrgModel = new XM.UserOrganization({name: orgModel.get("name"), username: "admin"});
      userOrgModel.on("statusChange", this.associateLink, this);
      userOrgModel.initialize(null, {isNew: true});
    },
    associateLink: function (userOrgModel, status, options) {
      if (status === XM.Model.READY_NEW) {
        // for some reason this fails on the first attempt and succeeds on subsequent attempts.
        // I'm sure there's a better way to do this.
        var admin = new XM.User({id: "admin"}),
          saveError = function () {
            //XT.log("Error saving admin user", arguments);
          },
          saveSuccess = function (userOrgModel, result, options) {
            XT.log("This new organization has been linked to the admin user.", arguments);
          },
          fetchError = function () {
            //XT.log("Error fetching admin user", arguments);
          },
          fetchSuccess = function (userModel, result) {
            userModel.get("organizations").add(userOrgModel);
            userModel.save(null, {success: saveSuccess, error: saveError});
          };

        admin.fetch({success: fetchSuccess, error: fetchError});
      }
    },

    /**
      If there are any new extensions we'll want to run the pertinent
      init scripts and orm updaters. It's a bit awkward
      that the two-stage process goes all the way up here to the presentation
      layer.
     */
    runExtensionScripts: function (model, newExtensions) {
      var newExtensionIds = _.map(newExtensions, function (ext) {
          return ext.get("extension").get("id");
        }),
        ajax = new enyo.Ajax({
          url: "/maintenance?organization=" + model.get("name") +
            "&extensions=" + JSON.stringify(newExtensionIds),
          handleAs: "json"
        }),
        success = function (inSender, inResponse) {
          if (inResponse.status === 'ERROR') {
            XT.log("Error updating extension scripts", inResponse.message);
          } else if (inResponse.errorCount > 0) {
            XT.log("Extension scripts loaded with errors", inResponse);
          } else {
            XT.log("Extension scripts loaded successfully", inResponse);
          }
        },
        error = function (inSender, inResponse) {
          XT.log("Error updating extension scripts", inResponse);
        };

      ajax.response(success);
      ajax.error(error);
      ajax.go();
    },
    save: function (options) {
      var that = this,
        success = options ? options.success : undefined,
        newOrganization = this.getValue().getStatus() === XM.Model.READY_NEW,
        newExtensions;

      newExtensions = _.filter(this.getValue().get("extensions").models, function (ext) {
        return ext.isNew();
      });
      options = options || {};
      options.success = function (model, result, opts) {
        if (success) {
          success(model, result, opts);
        }

        if (newExtensions && newExtensions.length > 0) {
          // there are no new extensions selected, so no need to run the backend
          // scripts
          that.runExtensionScripts(model, newExtensions);
        }

        if (newOrganization) {
          XT.log("Associating admin user with new organization", model.getStatusString());
          that.associateAdminUser(model);
        }
      };

      this.inherited(arguments);
    },
    model: "XM.Organization"
  });

  XV.registerModelWorkspace("XM.Organization", "XV.OrganizationWorkspace");

  // ..........................................................
  // EXTENSION
  //

  enyo.kind({
    name: "XV.ExtensionWorkspace",
    kind: "XV.Workspace",
    title: "_extension".loc(),
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.InputWidget", attr: "location"},
            {kind: "XV.NumberWidget", attr: "loadOrder"},
            {kind: "XV.InputWidget", attr: "privilegeName"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes"}
          ]}
        ]}
      ]}
    ],
    model: "XM.Extension"
  });

  XV.registerModelWorkspace("XM.Extension", "XV.ExtensionWorkspace");


}());
