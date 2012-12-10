/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true, alert:true*/

(function () {

  // ..........................................................
  // USER
  //

  enyo.kind({
    name: "XV.UserWorkspace",
    kind: "XV.Workspace",
    title: "_user".loc(),
    headerAttrs: ["id"],
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "id", label: "_userName".loc() },
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
      var that = this,
        options = {
          success: function (result) {
            // TODO: application-wide messaging?!
            //alert("An e-mail with the new password has been sent to " + that.getValue().id);
            alert("The password for " + that.getValue().id + " has been set to " + result.password);
          },
          error: function (error) {
            alert("Password reset fail");
          },
          databaseType: "global"
        };

      if (this.$.resetPasswordPopup) {
        this.$.resetPasswordPopup.hide();
      }
      XT.dataSource.resetPassword(this.getValue().id, options);
    },
    /**
      In the case of saving a new user we want to make a second call to reset
      the password, which will be null after the first call. It's a bit awkward
      that the two-stage process goes all the way up here to the presentation
      layer.
     */
    save: function (options) {
      var that = this,
        isNewUser = this.getValue().getStatus() === XM.Model.READY_NEW,
        success = options ? options.success : undefined;

      if (isNewUser) {
        options = options || {};
        options.success = function (model, result, opts) {
          if (success) {
            success(model, result, opts);
          }
          that.setValue(model);
          that.resetPassword();
        };
      }

      this.inherited(arguments);
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
            {kind: "XV.NumberWidget", attr: "port"},
            {kind: "XV.InputWidget", attr: "location"},
            {kind: "XV.DateWidget", attr: "dateAdded"},
            {kind: "XV.InputWidget", attr: "user"},
            {kind: "XV.InputWidget", attr: "password", type: "password"}
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
