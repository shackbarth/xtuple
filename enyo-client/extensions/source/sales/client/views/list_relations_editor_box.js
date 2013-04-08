/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {

  // ..........................................................
  // CUSTOMER GROUP CUSTOMER
  //
  
  /**
    Mixin to share common customer functionality
    Maybe this is supposed to be CustomerGroupMixin?
  */
  XV.CustomerMixin = {
    create: function () {
      this.inherited(arguments);
      this.$.promiseDate.setShowing(XT.session.settings.get("UsePromiseDate"));
    },
    attributesChanged: function (model, options) {
      XV.EditorMixin.attributesChanged.apply(this, arguments);

    },
    setValue: function (value) {
      XV.EditorMixin.setValue.apply(this, arguments);
    },
    valueChanged: function () {
      this.inherited(arguments);
    }
  };
  
  var customerGroupCustomer = enyo.mixin(XV.CustomerMixin, {
    name: "XV.CustomerGroupCustomerEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [

      ]}
    ]
  });
  
  enyo.kind(customerGroupCustomer);

  enyo.kind({
    name: "XV.CustomerGroupCustomerBox",
    kind: "XV.ListRelationsEditorBox",
    classes: "xv-list-relations-box",
    events: {
      onChildWorkspace: ""
    },
    title: "_customers".loc(),
    editor: "XV.CustomerGroupCustomerEditor",
    parentKey: "customer",
    listRelations: "XV.CustomerGroupCustomerListRelations",
    fitButtons: false,

    create: function () {
      this.inherited(arguments);
      this.createComponent({
        kind: "onyx.Button",
        content: "_expand".loc(),
        name: "expandButton",
        ontap: "launchWorkspace",
        classes: "xv-groupbox-button-right",
        container: this.$.navigationButtonPanel
      });
    },

    disabledChanged: function () {
      this.inherited(arguments);
      this.$.expandButton.setDisabled(this.getDisabled());
    },
    /**
    Set the current model into the List Relation and the Summary Editor Panel
    */
    valueChanged: function () {
      this.inherited(arguments);
      // change the styling of the last button to make room for the new button
      this.$.doneButton.setClasses("xv-groupbox-button-center");
    },

    launchWorkspace: function (inSender, inEvent) {
      var index = Number(this.$.list.getFirstSelected());
      this.doChildWorkspace({
        workspace: "XV.CustomerWorkspace",
        collection: this.getValue(),
        index: index,
        listRelations: this.$.list
      });
      return true;
    }
  });

}());
