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
    classes: "xv-assignment-box",
    handlers: {
      onValueChange: "checkboxChange"
    },
    published: {
      title: "",
      type: "",
      cacheName: "",
      assignedCollection: null,
      assignedIds: null,
      totalCollection: null,
      totalCollectionName: "",
      segments: null,
      segmentedCollections: null,
      translateLabels: true
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
     * assignedIds object is updated as well.
     */
    assignedCollectionChanged: function () {
      this.mapIds();
    },
    checkboxChange: function (inSender, inEvent) {
      var that = this,
        originatorName = inEvent.originator.name,
        value = inEvent.value,
        checkedModel,
        newModel;

      // BEGIN HACK
      try {
        var tempChecked = inEvent.originator.$.input.checked;
        var segmentNum = inEvent.originator.parent.parent.parent.indexInContainer();
        var checkboxNum = inEvent.originator.parent.indexInContainer();
      } catch(error) {
        XT.log("Crazy hack failed. Not bothering with it.");
      }
      //END HACK

        /**
         * The record type in totalCollection is XM.Privilege and the
         * record type in assignedCollection is XM.UserAccountPrivilegeAssignment,
         * so we have to navigate this.
         */
      if (value) {
        // filter returns an array and we want a model: that's why I [0]
        // assumption: no duplicate originator names
        var checkedModel = _.filter(this.getTotalCollection().models, function (model) {
          return model.get("name") === originatorName;
        })[0];
        // XXX I would love to revisit this when I have another two hours to burn on crazy bugs
        // the issue is that by creating the model we uncheck somehow the checkbox. Or maybe we're replacing
        // the checkbox with a different checkbox that itself is unchecked. Adding to the craziness is
        // that inEvent disappears at the same time. In WTF1land everything is normal. In WTF2land everything
        // is zany. And the problem disappears entirely when I set a breakpoint! The hack above and below
        // cannot possibly stand the test of time. But after 2 hours I'm ready to move on for now.
         XT.log("WTF1?: " + this.$.segmentRepeater.children[segmentNum].children[1].children[checkboxNum].$.checkbox.$.input.checked);
        newModel = this.getAssignmentModel(checkedModel);
         XT.log("WTF2?: " + this.$.segmentRepeater.children[segmentNum].children[1].children[checkboxNum].$.checkbox.$.input.checked);
        this.getAssignedCollection().add(newModel);
      } else {
        checkedModel = _.filter(this.getAssignedCollection().models, function (model) {
          // we don't want to redestroy a destroyed model, because there's probably a living one
          // behind it that actually is the one to destroy
          return !(model.getStatus() & XM.Model.DESTROYED)
            && model.get(that.getType())
            && model.get(that.getType()).get("name") === originatorName;
        })[0];
        if (!checkedModel) {
          XT.log("No model to destroy. This is probably a bug."); // XXX
        }
        // XT.log("WTF1?: " + this.$.segmentRepeater.children[segmentNum].children[1].children[checkboxNum].$.checkbox.$.input.checked);
        checkedModel.destroy();
        // XT.log("WTF2?: " + this.$.segmentRepeater.children[segmentNum].children[1].children[checkboxNum].$.checkbox.$.input.checked);
      }
      // BEGIN HACK
      try{
        if (tempChecked != this.$.segmentRepeater.children[segmentNum].children[1].children[checkboxNum].$.checkbox.$.input.checked) {
          XT.log("applying hack: setting checkbox to " + tempChecked);
          this.$.segmentRepeater.children[segmentNum].children[1].children[checkboxNum].$.checkbox.$.input.checked = tempChecked;
          this.render();
        }
      } catch(error) {
        XT.log("Crazy hack failed. Not bothering with it.");
      }
      // END HACK
      return true;
    },
    create: function () {
      this.inherited(arguments);

      var i,
        that = this;

      // crazy: if we put segmentedCollections: [] in the
      // published fields than all instances of this kind or subkind will share the same array,
      // yielding very strange behavior.
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
      if (XM[this.getCacheName()]) {
        this.setTotalCollection(XM[this.getCacheName()]);
        this.segmentizeTotalCollection();
      } else {
        this.setTotalCollection(new XM[this.getTotalCollectionName()]());
        var options = {success: function () {
          that.segmentizeTotalCollection();
        }};
        this.getTotalCollection().fetch(options);
      }
    },
    /**
     * We rely on the subkinds to override this function.
     */
    getAssignmentModel: function () {
      return null;
    },
    mapIds: function () {
      var that = this;

      this.setAssignedIds(this.getAssignedCollection().map(function (model) {
        if (!model.get(that.getType())) {
          // I have seen cases where assignments point to models that don't exist.
          // So ignore these. XXX should I return -9999 instead of null? I'd hate
          // for there to be nulls in there that might somehow get "matched up on"
          // by null checkboxes somehow.
          return null;
        }

        return model.get(that.getType()).get("id");
      }));
    },
    setupSegment: function (inSender, inEvent) {
      var index = inEvent.index,
        row = inEvent.item,
        header = row.$.segmentHeader;

      if (inEvent.originator.name !== 'segmentRepeater') {
        // not sure why the checkbox repeater is bringing us here, but ignore
        // the return true at the bottom of setupCheckbox should have fixed this
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
        row = inEvent.item.$.checkbox,
        label = this.getTranslateLabels() ? ("_" + data.get("name")).loc() : data.get("name");

      row.setLabel(label);
      row.setName(data.get("name"));
      if (_.indexOf(this.getAssignedIds(), data.get("id")) >= 0) {
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
}());
