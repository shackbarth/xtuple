/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XM:true, XV:true, XT:true, _:true */

/** @module XV */

(function () {

  /**
   * An assignment box is a groupbox that manages the assignment of a set of
   * available options to an object. For example, setting up the privileges that
   * are associated with a role.
   *
   * @class
   * @alias XV.AssignmentBox
   * @extends XV.ScrollableGroupbox
   */
  var enyoObj = {
    name: "XV.AssignmentBox",
    kind: "XV.ScrollableGroupbox",//"XV.Groupbox",
    classes: "xv-assignment-box",
    handlers: {
      onValueChange: "checkboxChange"
    },

    /**
     * Published fields
     * @type {Object}
     *
     * @property {XM.Collection} assignedCollection
     * The collection that backs this box. The model of the collection is the
     *    assignment (link) model.
     *
     * @property {Array} assignedIds
     * The ids of the assignable models. Cached for performance and recached whenever
     *    the assignedCollection is changed.
     *
     * @property {String} cacheName
     * The name of the cached collection if the collection is stored in the XM cache.
     *
     * @property {Array} segmentedCollections
     * An array of collections, each of whom are a subset of totalCollection.
     *
     * @property {Array} segments
     * We allow the assignable checkboxes to be grouped by segment, such as module.
     * If this array is length one then there is no segmentation, and the one value
     * of the array becomes the header of the box.
     *
     * @property {String} title
     * Used by the workspace to title the menu item for the box.
     *
     * @property {XM.Collection} totalCollection
     * The collection of all possible assignable models.
     *
     * @property {String} totalCollectionName
     * The name in the the XM namespace of the collection. Used to making new
     * segmentedCollections.
     *
     * @property {Boolean} translateLabels
     * We want to translate the labels if they are hardcoded into our system (such as privileges)
     * but not if they are user-defined.
     *
     * @property {String} type
     * Camelized name of assignable model. Used for drilling down from the assignment
     *    (link) model to the assignable model.
     */
    published: {
      assignedCollection: null,
      assignedIds: null,
      cacheName: "",
      segmentedCollections: null,
      segments: null,
      title: "",
      totalCollection: null,
      totalCollectionName: "",
      translateLabels: true,
      type: ""
    },

    // TODO: you'll notice the CSS looks bad. You can fix it by uncommenting the three lines here
    // in components, and swap in the commented kind, above. Problem is, the scroller disappears
    // inexplicably if you do this.
    components: [
      //{kind: "onyx.GroupboxHeader", content: "_roles".loc()},
      //{kind: "XV.ScrollableGroupbox", components: [
      {kind: "Repeater", name: "segmentRepeater", fit: true, onSetupItem: "setupSegment", segmentIndex: 0, components: [
        {kind: "onyx.GroupboxHeader", name: "segmentHeader", content: ""},
        {kind: "Repeater", name: "checkboxRepeater", fit: true, onSetupItem: "setupCheckbox", components: [
          {kind: "XV.CheckboxWidget", name: "checkbox" }
        ]}
      ]}
      //]}
    ],
    /**
     * Applies special formatting to a checkbox after it has been clicked, if applicable.
     * This method should be overriden by the subkind if applicable.
     */
    applyPostCheckFormatting: function (checkbox, model) {
    },
    /**
     * Makes sure that the assignedIds field is kept in synch with the assignedCollection field
     */
    assignedCollectionChanged: function () {
      this.mapIds();
    },
    /**
     * Handles bubbled checkbox event changes and prevents them from bubbling further.
     * Note that this method is afflicted with an insane bug.
     */
    checkboxChange: function (inSender, inEvent) {
      var that = this,
        checkbox = inEvent.originator,
        originatorName = checkbox.name,
        value = inEvent.value,
        checkedModel,
        newModel;

      // BEGIN HACK
      var tempChecked, segmentNum, checkboxNum;
      try {
        tempChecked = checkbox.$.input.checked;
        segmentNum = checkbox.parent.parent.parent.indexInContainer();
        checkboxNum = checkbox.parent.indexInContainer();
      } catch (error) {
        XT.log("Crazy hack failed. Not bothering with it.");
      }
      //END HACK

        //
        // The record type in totalCollection is XM.Privilege and the
        // record type in assignedCollection is XM.UserAccountPrivilegeAssignment,
        // so we have to navigate this.
        //
      if (value) {
        // filter returns an array and we want a model: that's why I [0]
        // assumption: no duplicate originator names
        checkedModel = _.filter(this.getTotalCollection().models, function (model) {
          return model.get("name") === originatorName;
        })[0];
        // XXX I would love to revisit this when I have another two hours to burn on crazy bugs
        // the issue is that by creating the model we uncheck somehow the checkbox. Or maybe we're replacing
        // the checkbox with a different checkbox that itself is unchecked. Adding to the craziness is
        // that inEvent disappears at the same time. In WTF1land everything is normal. In WTF2land everything
        // is zany. And the problem disappears entirely when I set a breakpoint! The hack above and below
        // cannot possibly stand the test of time. But after 2 hours I'm ready to move on for now.
        // XT.log("WTF1?: " + this.$.segmentRepeater.children[segmentNum].children[1].children[checkboxNum].$.checkbox.$.input.checked);
        newModel = this.getAssignmentModel(checkedModel);
        // XT.log("WTF2?: " + this.$.segmentRepeater.children[segmentNum].children[1].children[checkboxNum].$.checkbox.$.input.checked);
        this.getAssignedCollection().add(newModel);
      } else {
        checkedModel = _.filter(this.getAssignedCollection().models, function (model) {
          // we don't want to redestroy a destroyed model, because there's probably a living one
          // behind it that actually is the one to destroy
          return !(model.getStatus() & XM.Model.DESTROYED) &&
            model.get(that.getType()) &&
            model.get(that.getType()).get("name") === originatorName;
        })[0];
        if (!checkedModel) {
          XT.log("No model to destroy. This is probably a bug."); // XXX
        }
        // XT.log("WTF1?: " + this.$.segmentRepeater.children[segmentNum].children[1].children[checkboxNum].$.checkbox.$.input.checked);
        checkedModel.destroy();
        // XT.log("WTF2?: " + this.$.segmentRepeater.children[segmentNum].children[1].children[checkboxNum].$.checkbox.$.input.checked);
      }
      // BEGIN HACK
      try {
        if (tempChecked !== this.$.segmentRepeater.children[segmentNum].children[1].children[checkboxNum].$.checkbox.$.input.checked) {
          XT.log("applying hack: setting checkbox to " + tempChecked);
          checkbox = this.$.segmentRepeater.children[segmentNum].children[1].children[checkboxNum].$.checkbox;
          checkbox.$.input.checked = tempChecked;
          this.render();
        }
      } catch (error) {
        XT.log("Crazy hack failed. Not bothering with it.");
      }
      // END HACK

      this.applyPostCheckFormatting(checkbox, checkedModel);
      return true;
    },
    /**
     * Populates totalCollection field (either from the cache or through a fetch)
     * and calls for the totalCollection to be segmentized.
     */
    create: function () {
      this.inherited(arguments);

      var i,
        that = this,
        comparator = function (model) {
          return model.get("name");
        };

      this.setSegmentedCollections([]);

      for (i = 0; i < this.getSegments().length; i++) {
        this.getSegmentedCollections()[i] = new XM[this.getTotalCollectionName()]();
        this.getSegmentedCollections()[i].comparator = comparator;
      }
      //
      // Get the collection from the cache if it exists
      //
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
     * Creates a new assignment model to add to the assignedCollection.
     * We rely on the subkinds to override this function, as implemetations are varied.
     */
    getAssignmentModel: function () {
      return null;
    },

    /**
     * Updates the cache of assignedIds based on the assignedCollection.
     */
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
    /**
     * Called by the segmentRepeater. Sets the header of the segment and awakens
     * the checkboxRepeater.
     */
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

      //
      // Suppress the header if there's just one segment
      //
      if (this.getSegments().length < 2) {
        header.setStyle("visibility: hidden;");
      }



      return true;
    },
    /**
     * Sets up a checkbox: label, value, checkiness.
     */
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
    /**
     * This is the method that the parent container will typically call to
     * create this box. All logic and rendering flows from here.
     */
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
     * Render this AssignmentBox by firing off the segment repeater.
     * We can only render if we know *both* what the options and and also
     * what's already assigned. These both can happen asynchronously,
     * which is why we have to check and only execute when both are done.
     */
    tryToRender: function () {
      if (this.getAssignedCollection() && this.getSegmentedCollections()[0]) {
        this.$.segmentRepeater.setCount(this.getSegments().length);
      }
    }
  };

  enyo.kind(enyoObj);
}());
