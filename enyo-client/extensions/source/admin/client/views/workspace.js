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
  // CAMPAIGN
  //

  enyo.kind({
    name: "XV.CampaignWorkspace",
    kind: "XV.Workspace",
    title: "_campaign".loc(),
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "number"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.DateWidget", attr: "effectiveDate"},
            {kind: "XV.DateWidget", attr: "expirationDate"},
            {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
            {kind: "XV.TextArea", attr: "notes", fit: true}
          ]}
        ]}
      ]}
    ],
    model: "XM.Campaign"
  });

  XV.registerModelWorkspace("XM.Campaign", "XV.CampaignWorkspace");
  XV.registerModelWorkspace("XM.CampaignRelation", "XV.CampaignWorkspace");

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
            {kind: "XV.DatabaseServerWidget", attr: "databaseServer"},
            {kind: "onyx.GroupboxHeader", content: "_attributes".loc()},
            {kind: "XV.CampaignWidget", attr: "campaign"},
            {kind: "XV.DateWidget", attr: "createdDate"},
            {kind: "XV.DateWidget", attr: "expirationDate"},
            {kind: "XV.InputWidget", attr: "source"},
            {kind: "XV.InputWidget", attr: "ipAddress"},
            {kind: "XV.CheckboxWidget", attr: "isFreeTrial"}
          ]}
        ]},
        {kind: "XV.Groupbox", name: "extensionPanel", classes: "xv-assignment-box",
            title: "_extensions".loc(), components: [
          {kind: "onyx.GroupboxHeader", content: "_extensions".loc()},
          {kind: "XV.OrganizationExtensionAssignmentBox", attr: "extensions" }
        ]}
      ]},
      {kind: "onyx.Popup", name: "chooseTemplatePopup", centered: true,
        modal: true, floating: true, scrim: true,
        onHide: "popupHidden", components: [
        {content: "_chooseTemplate".loc() },
        {content: "_initDbWarning".loc() },
        {tag: "br"},
        {kind: "onyx.Button", name: "demoDbButton", content: "_demo".loc(), ontap: "chooseTemplate",
          classes: "xv-popup-button"},
        {kind: "onyx.Button", name: "quickstartDbButton", content: "_quickStart".loc(), ontap: "chooseTemplate",
          classes: "xv-popup-button"},
        {kind: "onyx.Button", name: "emptyDbButton", content: "_empty".loc(), ontap: "chooseTemplate",
          classes: "xv-popup-button"},
        {kind: "onyx.Button", name: "DbButton", content: "_none".loc(), ontap: "chooseTemplate",
          classes: "onyx-blue xv-popup-button"}
      ]}
    ],
    model: "XM.Organization",
    chooseTemplate: function (inSender, inEvent) {
      var buttonName = inEvent.originator.name,
        templateDb = buttonName.replace("DbButton", "");

      this.getValue().runMaintenance(null, templateDb);
      this.$.chooseTemplatePopup.hide();
      // TODO: I suppose that if the user wanted to close the workspace
      // and the hack below prevented him, now would be an ok time to
      // close the workspace
    },
    save: function (options) {
      var that = this,
        success = options ? options.success : undefined,
        newOrganization = this.getValue().getStatus() === XM.Model.READY_NEW,
        newExtensionIds,
        newExtensions = _.filter(this.getValue().get("extensions").models, function (ext) {
          return ext.isNew();
        });

      if (newOrganization) {
        // hack: don't the workspace close out if we're going to be popping up a popup soon
        this.parent.parent._saveState = 1; //SAVE_APPLY
      }

      options = options || {};
      options.success = function (model, result, opts) {
        if (success) {
          // do whatever else we were supposed to do
          success(model, result, opts);
        }

        if (newOrganization) {
          // ask the user if they want to init the db. Don't worry about the newExtensions
          // in this case, because we'll be installing them all, which is what happens
          // if you don't specify a restriction
          that.$.chooseTemplatePopup.show();

        } else

        if (newExtensions && newExtensions.length > 0) {
          // not a new organization, but some updates to extensions. Run maintenance
          // on the extensions that have just been added
          newExtensionIds = _.map(newExtensions, function (ext) {
            return ext.get("extension").id;
          });
          model.runMaintenance(newExtensionIds);
        }
      };

      // XXX this exits the workspace which it must not do if we are to use the popup
      this.inherited(arguments);
    }

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
