/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true*/

(function () {

  enyo.kind({
    name: "XV.MyAccountPopup",
    kind: "onyx.Popup",
    centered: true,
    floating: true,
    published: {
      model: null
    },
    components: [
      {kind: "onyx.InputDecorator", components: [
        {kind: "onyx.Input", type:"password", name: "oldPassword", placeholder: "Enter old password"}
      ]},
      {tag: "br"},
      {kind: "onyx.InputDecorator", components: [
        {kind: "onyx.Input", type:"password", name: "newPassword", placeholder: "Enter new password"}
      ]},
      {tag: "br"},
      {kind: "onyx.InputDecorator", components: [
        {kind: "onyx.Input", type:"password", name: "newPasswordCheck", placeholder: "Re-enter new password"}
      ]},
      {tag: "br"},
      {kind: "onyx.Button", name: "submitButton", ontap: "submitPassword", content: "Submit"}
    ],
    create: function () {
      this.inherited(arguments);
      this.setModel(new XM.MongoUser());
    },
    submitPassword: function (inSender, inEvent) {
      var oldPassword = this.$.oldPassword.getValue(),
        newPassword = this.$.newPassword.getValue(),
        newPasswordCheck = this.$.newPasswordCheck.getValue(),
        params = {oldPassword: oldPassword, newPassword: newPassword},
        options = {};

      if (!oldPassword) {
        alert("Please enter your old password");
        return;
      }
      if (newPassword.length < 6) {
        alert("Passwords must be at least 6 digits");
        return;
      }
      if (newPassword !== newPasswordCheck) {
        alert("Passwords don't match");
        return;
      }

      options.success = function (result) {
        alert("Success!");
        alert(JSON.stringify(result));
      }

      options.error = function (result) {
        alert("Error!");
        alert(JSON.stringify(result));
      }

      result = XT.dataSource.configure("updatePassword", params, options);

      //this.getModel().save({oldPassword: oldPassword, newPassword: newPassword});
      //this.getModel().save();

      this.hide();
    }
  });

}());
