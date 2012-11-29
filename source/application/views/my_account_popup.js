/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true*/

(function () {

  enyo.kind({
    name: "XV.MyAccountPopup",
    kind: "onyx.Popup",
    classes: "xv-my-account-popup",
    centered: true,
    floating: true,
    modal: true,
    autoDismiss: false,
    scrim: true,
    components: [
      {kind: "onyx.Groupbox", components: [
        {kind: "onyx.GroupboxHeader", content: "Change your password" },
        {name: "message", content: "", classes: "xv-message"},
        {kind: "onyx.InputDecorator", components: [
          {content: "Old Password: "},
          {kind: "onyx.Input", type:"password", name: "oldPassword", placeholder: "Enter old password"}
        ]},
        {kind: "onyx.InputDecorator", components: [
          {content: "New Password: "},
          {kind: "onyx.Input", type:"password", name: "newPassword", placeholder: "Enter new password"}
        ]},
        {kind: "onyx.InputDecorator", components: [
          {content: "New Password: "},
          {kind: "onyx.Input", type:"password", name: "newPasswordCheck", placeholder: "Re-enter new password"}
        ]},
        {classes: "xv-button-bar", components: [
          {kind: "onyx.Button", name: "submitButton", ontap: "submitPassword", content: "Submit"},
          {kind: "onyx.Button", name: "cancelButton", ontap: "closePopup", content: "Cancel"}
        ]}
      ]}
    ],
    closePopup: function (inSender, inEvent) {
      this.$.oldPassword.setValue("");
      this.$.newPassword.setValue("");
      this.$.newPasswordCheck.setValue("");
      this.hide();
    },
    submitPassword: function (inSender, inEvent) {
      var that= this,
        oldPassword = this.$.oldPassword.getValue(),
        newPassword = this.$.newPassword.getValue(),
        newPasswordCheck = this.$.newPasswordCheck.getValue(),
        params = {oldPassword: oldPassword, newPassword: newPassword},
        options = {};

      if (!oldPassword) {
        this.$.message.setContent("Please enter your old password");
        return;
      }
      if (newPassword.length < 6) {
        this.$.message.setContent("Passwords must be at least 6 digits");
        return;
      }
      if (newPassword !== newPasswordCheck) {
        this.$.message.setContent("Passwords don't match");
        return;
      }

      options.success = function (result) {
        //that.$.message.setContent("Password change successful.");
        that.$.oldPassword.setValue("");
        that.$.newPassword.setValue("");
        that.$.newPasswordCheck.setValue("");
        // hide the popup.
        // TODO: it would be nice to show the user some message
        // (maybe in the navigator) that the command was successful
        that.hide();
      }

      options.error = function (result) {
        var message;
        if (result.params.error === 'Invalid password') {
          message = "That's not your old password. Please re-enter.";
        } else {
          message = "There was an error changing your password.";
        }
        that.$.message.setContent(message);
      }

      result = XT.dataSource.changePassword(params, options);

      // for some reason this is necessary to "un-depress" the button
      this.$.submitButton.addRemoveClass("active");

      return true; // no need for further bubbling
    }
  });

}());
