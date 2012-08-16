/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XM:true, XV:true, _:true */

(function () {

  /**
   * Functionality that's common to all of these AssignmentBoxes.
   * At least, for now! This is a work in progress and subject
   * to change as assumptions must be relaxed.
   */
  enyo.kind({
    name: "XV.AssignmentBox",
    kind: "XV.WorkspaceBox",
    classes: "xv-privilege-box",
    handlers: {
      onValueChange: "checkboxChange"
    },
    published: {
      title: "",
      type: "",
      assignedCollection: null,
      assignedPrivileges: null,
      totalCollection: null,
      totalCollectionName: "",
      segments: null,
      segmentedCollections: null
    },
    components: [
      {kind: "Repeater", name: "segmentRepeater", fit: true, onSetupItem: "setupSegment", segmentIndex: 0, components: [
        {kind: "onyx.GroupboxHeader", name: "segmentHeader", content: ""},
        {kind: "Repeater", name: "checkboxRepeater", fit: true, onSetupItem: "setupCheckbox", components: [
          {kind: "XV.CheckboxWidget", name: "checkbox" }
        ]}
      ]}
    ],
    /**
     * Every time the assigned collection changes we want to make sure that that
     * assignedPrivileges object is updated as well.
     */
    assignedCollectionChanged: function () {
      this.setAssignedPrivileges(this.getAssignedCollection().map(function (model) {
        return model.get("privilege");
      }));
    },
    create: function () {
      this.inherited(arguments);

      var i,
        that = this;

      this.setSegmentedCollections([]);
      for (i = 0; i < this.getSegments().length; i++) {
        this.getSegmentedCollections()[i] = new XM[this.getTotalCollectionName()]();
        this.getSegmentedCollections()[i].comparator = function (model) {
          return model.get("name");
        };
      }
      /**
       * Get the collection from the cache if it exists
       */
      if (XM[this.getType()]) {
        this.setTotalCollection(XM[this.getType()]);
        this.segmentizeTotalCollection();
      } else {
        this.setTotalCollection(new XM[this.getTotalCollectionName()]());
        var options = {success: function () {
          that.segmentizeTotalCollection();
        }};
        this.getTotalCollection().fetch(options);
      }
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
        segmentIndex = parentSegmentRepeater.segmentIndex,
        data = this.getSegmentedCollections()[segmentIndex].at(index),
        row = inEvent.item.$.checkbox;

      row.setLabel(("_" + data.get("name")).loc());
      row.setName(data.get("name"));
      if (_.indexOf(this.getAssignedPrivileges(), data) >= 0) {
        row.setValue(true, { silent: true });
      }
      return true;
    },
    setValue: function (value) {
      this.setAssignedCollection(value);
      /*
       * We wait to do this until we have the granted collection
       */
      this.tryToRender();
    },
    segmentizeTotalCollection: function () {
      var i, j, model, module;
      for (i = 0; i < this.getTotalCollection().length; i++) {
        model = this.getTotalCollection().models[i];

        module = model.get("module");
        for (j = 0; j < this.getSegments().length; j++) {
          if (this.getSegments().length === 1 || module === this.getSegments()[j]) {
            // if there's only one segment then no need to segmentize at all
            this.getSegmentedCollections()[j].add(model);
          }
        }
      }
      this.tryToRender();
    },
    /**
     * We render by firing off the segment repeater.
     * We can only render if we know *both* what the options and and also
     * what's already assigned. These both can happen asynchronously,
     * which is why we have to check and only execute when both are done.
     */
    tryToRender: function () {
      if (this.getAssignedCollection() && this.getSegmentedCollections()[0]) {
        this.$.segmentRepeater.setCount(this.getSegments().length);
      }
    }
  });

  /**
   * Assign roles to users
   */
  enyo.kind({
    name: "XV.UserAccountRoleWorkspaceBox",
    kind: "XV.AssignmentBox",
    segments: ["Roles"],
    title: "_roles".loc(),
    totalCollectionName: "UserAccountRoleCollection",
    type: "roles",
    checkboxChange: function (inSender, inEvent) {
      //TODO
    }
  });

  /**
   * Assign privileges to users
   */
  enyo.kind({
    name: "XV.UserAccountPrivilegeWorkspaceBox",
    kind: "XV.AssignmentBox",
    segments: ["System", "CRM"], // these must follow the capitalization conventions of the privilege module
    title: "_privileges".loc(),
    totalCollectionName: "PrivilegeCollection",
    type: "privileges",
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
        newModel = this.getAssignmentModel(checkedModel);
        this.getAssignedCollection().add(newModel);
      } else {
        checkedModel = _.filter(this.getAssignedCollection().models, function (model) {
          return model.get("privilege") && model.get("privilege").get("name") === privilegeName;
        })[0];
        checkedModel.destroy();
      }
      return true;
    },
    getAssignmentModel: function (privilegeModel) {
      return new XM.UserAccountPrivilegeAssignment({
        privilege: privilegeModel,
        type: "UserAccountPrivilegeAssignment",
        userAccount: this.getAssignedCollection().userAccount
      }, {isNew: true});
    }
  });

  /**
   * Assign privileges to roles. Almost identical to the one that assigns
   * privileges to users.
   */
  enyo.kind({
    name: "XV.UserAccountRolePrivilegeWorkspaceBox",
    kind: "XV.UserAccountPrivilegeWorkspaceBox",
    getAssignmentModel: function (privilegeModel) {
      return new XM.UserAccountRolePrivilegeAssignment({
        privilege: privilegeModel,
        type: "UserAccountRolePrivilegeAssignment",
        userAccountRole: this.getAssignedCollection().user_account_role,
        // XXX why this redundancy in UserAccountRolePrivilegeAssignment?
        user_account_role: this.getAssignedCollection().user_account_role
      }, {isNew: true});
    }
  });

}());
