/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true, XM:true, _: true, Globalize:true */

(function () {

  /**
    @class Manages the organizations associated with a global user
    @name XV.UserOrgBox
   */
  enyo.kind(/** @lends XV.UserOrgBox# */{
    name: "XV.UserOrgBoxItem",
    components: [
      {kind: "XV.OrganizationWidget", name: "organizationPicker", label: "_organization".loc()},
      {name: "applicationUsernameField"}
    ]
  });

  /**
    @class Manages the organizations associated with a global user
    @name XV.UserOrgBox
   */
  enyo.kind(/** @lends XV.UserOrgBox# */{
    name: "XV.UserOrgBox",
    kind: "XV.Groupbox",
    published: {
      attr: null,
      value: null,
      title: "_organizations".loc()
    },
    handlers: {
      onValueChange: "controlValueChanged"
    },
    components: [
      {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
      {kind: "Repeater", count: 0, onSetupItem: "setupItem", components: [
        {kind: "XV.UserOrgBoxItem", name: "orgItem"}
      ]}
    ],
    controlValueChanged: function (inSender, inEvent) {
      //for now, just catch and ignore these
      return true;
    },
    setupItem: function (inSender, inEvent) {
      var index = inEvent.index;

      inEvent.item.$.orgItem.$.organizationPicker.setValue(this.getValue()[index].name);
      inEvent.item.$.orgItem.$.applicationUsernameField.setContent(this.getValue()[index].username);
    },
    valueChanged: function () {
      console.log(JSON.stringify(this.getValue()));
      this.$.repeater.setCount(this.getValue().length);
    }
  });

}());
