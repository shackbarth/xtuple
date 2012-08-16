/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XM:true, XV:true, _:true */

(function () {

  enyo.kind({
    name: "XV.PrivilegeBox",
    kind: "XV.WorkspaceBox",
    classes: "xv-privilege-box"
  });

  enyo.kind({
    name: "XV.UserAccountRoleWorkspaceBox",
    kind: "XV.PrivilegeBox"
  });

  // XXX this is more like a rough, inelegant draft.
  enyo.kind({
    name: "XV.UserAccountPrivilegeWorkspaceBox",
    kind: "XV.PrivilegeBox",
    // XXX enyo says don't use scrollers with lists to prevent nested scrollers,
    // and WorkspaceBox is a scroller: #UHOH
    handlers: {
      onValueChange: "checkboxChange"
    },
    published: {
      title: "_privileges".loc(),
      assignedCollection: null,
      totalCollection: null,
      crmCollection: null,
      systemCollection: null,
      type: "privileges"
    },
    components: [
      {kind: "onyx.GroupboxHeader", content: "_system".loc()},
      {kind: "Repeater", name: "systemRepeater", fit: true, onSetupItem: "setupSystemItem", components: [
        {kind: "XV.CheckboxWidget", name: "systemPrivilege"}
      ]},
      {kind: "onyx.GroupboxHeader", content: "_crm".loc()},
      {kind: "Repeater", name: "crmRepeater", fit: true, onSetupItem: "setupCrmItem", components: [
        {kind: "XV.CheckboxWidget", name: "crmPrivilege"}
      ]}
    ],
    create: function () {
      this.inherited(arguments);
      this.setCrmCollection(new XM.PrivilegeCollection()); // TODO: abstract
      this.getCrmCollection().comparator = function (privilege) {
        return privilege.get("name");
      };
      this.setSystemCollection(new XM.PrivilegeCollection()); // TODO: abstract
      this.getSystemCollection().comparator = function (privilege) {
        return privilege.get("name");
      };

      this.setTotalCollection(XM[this.getType()]);
    },
    checkboxChange: function (inSender, inEvent) {
      var privilegeName = inEvent.originator.name,
        value = inEvent.value,
        checkedModel,
        newModel;

        /**
         * The record type in totalCollection is XM.Privilege and the
         * record type in assignedCollection is XM.UserAccountPrivilegeAssignment,
         * so we have to navigate this.
         */
      if (value) {
        // filter returns an array and we want a model: that's why I [0]
        // assumption: no duplicate privilege names
        checkedModel = _.filter(this.getTotalCollection().models,
          function (model) { return model.get("name") === privilegeName; })[0];
        newModel = new XM.UserAccountPrivilegeAssignment({
          privilege: checkedModel,
          type: "UserAccountPrivilegeAssignment",
          userAccount: this.getAssignedCollection().userAccount
        }, {isNew: true});
        this.getAssignedCollection().add(newModel);
      } else {
        checkedModel = _.filter(this.getAssignedCollection().models,
          function (model) { return model.get("privilege").get("name") === privilegeName; })[0];
        checkedModel.destroy();
      }

      return true;
    },
    setupCrmItem: function (inSender, inEvent) {
      var index = inEvent.index,
        data = this.getCrmCollection().at(index),
        row = inEvent.item.$.crmPrivilege;

      row.setLabel(("_" + data.get("name")).loc());
      row.setName(data.get("name"));
      // XXX probably needs to be optimized
      var assignedPrivileges = this.getAssignedCollection().map(function (model) { return model.get("privilege"); });
      if (_.indexOf(assignedPrivileges, data) >= 0) {
        row.setValue(true, { silent: true });
      }
    },
    setupSystemItem: function (inSender, inEvent) {
      var index = inEvent.index,
        data = this.getSystemCollection().at(index),
        row = inEvent.item.$.systemPrivilege;

      row.setLabel(("_" + data.get("name")).loc());
      row.setName(data.get("name"));
      // XXX probably needs to be optimized
      var assignedPrivileges = this.getAssignedCollection().map(function (model) { return model.get("privilege"); });
      if (_.indexOf(assignedPrivileges, data) >= 0) {
        row.setValue(true, { silent: true });
      }
    },
    setValue: function (value) {
      this.setAssignedCollection(value);
      // might as well wait to do this until we have the granted collection
      this.$.systemRepeater.setCount(this.getSystemCollection().length);
      this.$.crmRepeater.setCount(this.getCrmCollection().length);
    },
    totalCollectionChanged: function () {
      var i, model, module;
      for (i = 0; i < this.getTotalCollection().length; i++) {
        model = this.getTotalCollection().models[i];
        module = model.get("module");
        if (module === "CRM") {
          this.getCrmCollection().add(model);
        } else if (module === 'System') {
          this.getSystemCollection().add(model);
        }
      }
    }
  });
}());
