/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XM:true, XV:true, _:true */

(function () {

  enyo.kind({
    name: "XV.PrivilegeBox",
    kind: "XV.WorkspaceBox",
    classes: "xv-privilege-box",
    handlers: {
      onValueChange: "checkboxChange"
    },
    published: {
      title: "",
      type: "",
      assignedCollection: null,
      totalCollection: null,
      totalCollectionName: "",
      segments: [],
      segmentedCollections: []
    },
    components: [
      {kind: "Repeater", name: "segmentRepeater", fit: true, onSetupItem: "setupSegment", segmentIndex: 0, components: [
        {kind: "onyx.GroupboxHeader", name: "segmentHeader", content: ""},
        {kind: "Repeater", name: "checkboxRepeater", fit: true, onSetupItem: "setupCheckbox", components: [
          {kind: "XV.CheckboxWidget", name: "checkbox" }
        ]}
      ]}
    ],
    create: function () {
      this.inherited(arguments);

      var i;
      for (i = 0; i < this.getSegments().length; i++) {
        this.getSegmentedCollections()[i] = new XM[this.getTotalCollectionName()]();
        this.getSegmentedCollections()[i].comparator = function (model) {
          return model.get("name");
        };
      }
      this.setTotalCollection(XM[this.getType()]);
    },
    setupSegment: function (inSender, inEvent) {
      var index = inEvent.index,
        row = inEvent.item,
        header = row.$.segmentHeader;

      if (inEvent.originator.name !== 'segmentRepeater') {
        // not sure why the checkbox repeater is bringing us here, but ignore
        return;
      }

      inSender.segmentIndex = index;
      header.setContent(this.getSegments()[index]);
      row.$.checkboxRepeater.setCount(this.getSegmentedCollections()[index].length);
      return true;
    },
    setupCheckbox: function (inSender, inEvent) {
      var index = inEvent.item.indexInContainer(), //inEvent.index,
        parentSegmentRepeater = inSender.parent.parent,
        segmentIndex = parentSegmentRepeater.segmentIndex;
        data = this.getSegmentedCollections()[segmentIndex].at(index),
        row = inEvent.item.$.checkbox;

      row.setLabel(("_" + data.get("name")).loc());
      row.setName(data.get("name"));
      // XXX probably needs to be optimized
      var assignedPrivileges = this.getAssignedCollection().map(function (model) { return model.get("privilege"); });
      if (_.indexOf(assignedPrivileges, data) >= 0) {
        row.setValue(true, { silent: true });
      }
      return true;
    },
    setValue: function (value) {
      this.setAssignedCollection(value);
      /*
       * We wait to do this until we have the granted collection
       */
      this.$.segmentRepeater.setCount(this.getSegments().length);
    },
    totalCollectionChanged: function () {
      var i, j, model, module;
      for (i = 0; i < this.getTotalCollection().length; i++) {
        model = this.getTotalCollection().models[i];
        module = model.get("module");
        for (j = 0; j < this.getSegments().length; j++) {
          if (module === this.getSegments()[j]) {
            this.getSegmentedCollections()[j].add(model);
          }
        }
      }
    }
  });

  enyo.kind({
    name: "XV.UserAccountRoleWorkspaceBox",
    kind: "XV.PrivilegeBox",
    title: "_roles".loc(),
    components: [
      {kind: "onyx.GroupboxHeader", content: "_roles".loc()},
      {kind: "Repeater", name: "repeater", fit: true, onSetupItem: "setupItem", components: [
        {kind: "XV.CheckboxWidget", name: "role"}
      ]}
    ]


  });

  enyo.kind({
    name: "XV.UserAccountPrivilegeWorkspaceBox",
    kind: "XV.PrivilegeBox",
    published: {
      crmCollection: null,
      systemCollection: null
    },
    title: "_privileges".loc(),
    totalCollectionName: "PrivilegeCollection",
    type: "privileges",
    segments: ["System", "CRM"], // these must follow the capitalization conventions of the privilege module
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
  });
}());
