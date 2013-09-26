/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true*/
/*global enyo:true, XM:true, XT:true, _:true, Backbone:true */


(function () {

  /**
   @name XV.AssignmentBox
   @class An assignment box is a groupbox that manages the assignment of a set of
   available options to an object. For example, setting up the privileges that
   are associated with a role.<br />
   Derived from <a href="http://enyojs.com/api/#enyo.Scroller">enyo.Scroller</a>.
   @extends enyo.Scroller
   */
  enyo.kind(/** @lends XV.AssignmentBox# */{
    name: "XV.AssignmentBox",
    kind: "Scroller",
    fit: true,
    horizontal: "hidden",
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
     * @property {String} nameAttribute
     * The attribute of the label field to appear in the checkbox widget.
     *
     * @property {Array} restrictedValues
     * An array of the values that we want to see in this assignment box. Values not in
     *    this array will be suppressed. If this is null (as by default) then no suppression
     *    will occur.
     *
     * @property {Array} segmentedCollections
     * An array of collections, each of whom are a subset of totalCollection.
     *
     * @property {Array} segments
     * We allow the assignable checkboxes to be grouped by segment.
     *    If this array is length one then there is no segmentation, and the one value
     *    of the array becomes the header of the box. If the array is length zero then
     *    we dynamically generate the segments based on the incoming data. It must be
     *    overridden by the implementation to be something other than null, though.
     *
     * @property {String} modelName
     * The collection of all possible assignable models.
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
     *    but not if they are user-defined.
     *
     * @property {String} type
     * Camelized name of assignable model. Used for drilling down from the assignment
     *    (link) model to the assignable model. It is important that this be the attribute
     *    in the assignment model that contains the assignable model.
     *
     * @property {Object} query
     * A query to filter the collection by
     */
    published: {
      assignedCollection: null,
      assignedIds: null,
      attr: null,
      cacheName: "",
      nameAttribute: "name",
      restrictedValues: null,
      segmentedCollections: null,
      segments: null,
      modelName: null,
      totalCollection: null,
      totalCollectionName: "",
      translateLabels: true,
      type: "",
      query: null,
      disabled: false
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
     * Applies special formatting to a checkbox after it has been clicked, if applicable.
     * This method should be overriden by the subkind if applicable.
     */
    applyPostCheckFormatting: function (checkbox, model) {
    },
    /**
     * Handles bubbled checkbox event changes and prevents them from bubbling further.
     */
    checkboxChange: function (inSender, inEvent) {
      var that = this,
        checkbox = inEvent.originator,
        originatorName = checkbox.name,
        value = inEvent.value,
        checkedModel,
        newModel,
        nameAttr = this.getNameAttribute();

      //
      // The record type in totalCollection is XM.Privilege and the
      // record type in assignedCollection is XM.UserAccountPrivilegeAssignment,
      // so we have to navigate this.
      //
      if (value) {
        // filter returns an array and we want a model: that's why I [0]
        // assumption: no duplicate originator names
        checkedModel = _.filter(this.getTotalCollection().models, function (model) {
          return model.getValue(nameAttr) === originatorName;
        })[0];
        newModel = this.getAssignmentModel(checkedModel);

        this.getAssignedCollection().add(newModel);

      } else {
        checkedModel = _.filter(this.getAssignedCollection().models, function (model) {
          // we don't want to redestroy a destroyed model, because there's probably a living one
          // behind it that actually is the one to destroy
          return !(model.getStatus() & XM.Model.DESTROYED) &&
            model.get(that.getType()) &&
            model.get(that.getType()).getValue(nameAttr) === originatorName;
        })[0];
        if (!checkedModel) {
          XT.log("No model to destroy. This is probably a bug.");
        }
        checkedModel.destroy();
      }

      // force a refresh of the mapIds cache
      this.mapIds();
      this.tryToRender();
      this.applyPostCheckFormatting(checkbox, checkedModel);
      return true;
    },

    /**
     * Populates totalCollection field (either from the cache or through a fetch)
     * and calls for the totalCollection to be segmentized.
     */
    create: function () {
      var Coll;

      this.inherited(arguments);

      //
      // Get the collection from the cache if it exists
      //
      if (this.getCacheName() && XT.getObjectByName(this.getCacheName())) {
        this.setTotalCollection(XT.getObjectByName(this.getCacheName()));
        this.segmentizeTotalCollection();
      } else {
        Coll = Backbone.Relational.store.getObjectByName(this.getTotalCollectionName());
        this.setTotalCollection(new Coll());
        this.fetch();
      }
    },
    disabledChanged: function () {
      this.tryToRender();
    },
    /**
     * Creates a new assignment model to add to the assignedCollection.
     * We rely on the subkinds to override this function, as implemetations are varied.
     */
    getAssignmentModel: function (value) {
      var attrs = {},
        Klass = XT.getObjectByName(this.getModelName());
      attrs[this.getType()] = value;
      return new Klass(attrs, {isNew: true});
    },

    /**
      Refresh the `totalCollection`.
    */
    fetch: function () {
      var that = this,
        options = {
          query: this.getQuery(),
          success: function () {
            that.segmentizeTotalCollection();
          }
        };
      this.getTotalCollection().fetch(options);
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

        if (model.getStatus() & XM.Model.DESTROYED) {
          // don't add destroyed models to cache
          return null;
        }
        return model.get(that.getType()).id;
      }));
    },
    /**
     * Called by the segmentRepeater. Sets the header of the segment and awakens
     * the checkboxRepeater.
     */
    setupSegment: function (inSender, inEvent) {
      var index = inEvent.index,
        row = inEvent.item,
        header = row.$.segmentHeader,
        segment,
        camelize = function (str) {
          var ret = str.replace((/([\s|\-|\_|\n])([^\s|\-|\_|\n]?)/g),
            function (str, separater, character) {
              return character ? character.toUpperCase() : '';
            });
          var first = ret.charAt(0),
            lower = first.toLowerCase();
          return first !== lower ? lower + ret.slice(1) : ret;
        };

      if (inEvent.originator.name !== 'segmentRepeater') {
        // not sure why the checkbox repeater is bringing us here, but ignore
        // the return true at the bottom of setupCheckbox should have fixed this
        return;
      }

      inSender.segmentIndex = index;

      if (header && (this.getSegments().length < 2 || this.getSegmentedCollections()[index].length === 0)) {
        //
        // Suppress the header if there's just one segment, or if the segment is empty of boxes to assign
        //
        header.parent.removeChild(header);

      } else if (header) {
        segment = this.getSegments()[index] || "setup";
        header.setContent(("_" + camelize(segment)).loc());
      }

      row.$.checkboxRepeater.setCount(this.getSegmentedCollections()[index].length);

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
        name = data.getValue(this.getNameAttribute()),
        title = name.camelize(),
        label = this.getTranslateLabels() ? ("_" + title).loc() : name,
        disabled = this.getDisabled();

      row.setLabel(label);
      row.setName(name);
      row.setDisabled(disabled);
      if (_.indexOf(this.getAssignedIds(), data.id) >= 0) {
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
      this.mapIds();
      /*
       * We wait to do this until we have the granted collection
       */
      this.tryToRender();
    },

    segmentizeTotalCollection: function () {
      var i, group, model, name, lowercaseSegments, pertinentSegment, Coll,
        nameAttr = this.getNameAttribute(),
        comparator = function (model) {
          return model.getValue(nameAttr);
        };
      this.setSegmentedCollections([]);

      if (this.getSegments().length === 0) {
        // generate the segments dynamically based on the incoming models' modules
        for (i = 0; i < this.getTotalCollection().length; i++) {
          model = this.getTotalCollection().models[i];
          group = model.get("module");
          if (this.getModelSegment) {
            group = this.getModelSegment(model.getValue(nameAttr), group);
          }
          if (this.getSegments().indexOf(group) < 0) {
            this.getSegments().push(group);
          }
          // alphebetize
          this.getSegments().sort();
        }
      }
      lowercaseSegments = _.map(this.getSegments(), function (segment) {
        return segment.toLowerCase();
      });


      for (i = 0; i < this.getSegments().length; i++) {
        Coll = Backbone.Relational.store.getObjectByName(this.getTotalCollectionName());
        this.getSegmentedCollections()[i] = new Coll();
        this.getSegmentedCollections()[i].comparator = comparator;
      }
      for (i = 0; i < this.getTotalCollection().length; i++) {
        model = this.getTotalCollection().models[i];
        name = model.getValue(nameAttr);
        group = model.get("module") || "";
        if (this.getModelSegment) {
          group = this.getModelSegment(name, group);
        }
        if (!this.getRestrictedValues() || this.getRestrictedValues().indexOf(name) >= 0) {
          pertinentSegment = Math.max(0, lowercaseSegments.indexOf(group.toLowerCase()));
          this.getSegmentedCollections()[pertinentSegment].add(model);
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
      var checkbox;
      if (this.getAssignedCollection() &&
          this.getSegmentedCollections() !== null &&
          this.getSegmentedCollections().length) {
        this.$.segmentRepeater.setCount(this.getSegments().length);
      }
    },
    /**
     * Apply a half-ghosty underchecking style to the checkbox if we want to. Used here to
     * denote that a privilege is grated via a role but not directly to a user.
     */
    undercheckCheckbox: function (checkbox, isUnderchecked) {
      if (!checkbox.$.input) {
        // harmless bug: do nothing
        // TODO: check this out
      } else if (isUnderchecked && !checkbox.$.input.checked) {
        checkbox.$.input.addClass("xv-half-check");
      } else {
        checkbox.$.input.removeClass("xv-half-check");
      }
    }
  });
}());
