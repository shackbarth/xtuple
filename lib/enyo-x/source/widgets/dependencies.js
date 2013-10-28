/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true, strict:false*/
/*global enyo:true, XT:true, XM:true, XV:true, _:true */

(function () {

  _.extend(XV,/** @lends XV# */ {
    /**
      Constant for predecessor

      @default 1
    */
    PREDECESSOR: 1,

    /**
      Constant for successor

      @default 0
    */
    SUCCESSOR: 0
  });

  /**
    @name XV.DependencyPicker
    @class For the {@link XV.DependciesWidget} displays the list of dependencies
    that the user can select from to classify a workflow dependency.
    @extends XV.PickerWidget
   */
  enyo.kind(
    /** @lends XV.DependencyPicker# */{
    name: "XV.DependencyPicker",
    kind: "XV.PickerWidget",
    classes: "xv-dependency-picker",
    showLabel: false,
    showNone: false,
    orderBy: [
      {attribute: 'sequence'}
    ]
  });

  /**
    @name XV.DependencyItem
    @class Contains a set of fittable columns which make up a single row in a list of characteristics
      for the {@link XV.CharacteristicsWidget}.<br />
    Components: {@link XV.CharacteristicPicker}, {@link XV.InputWidget},
      {@link XV.DateWidget}, {@link XV.OptionsPicker}.<br />
    Derived from <a href="http://enyojs.com/api/#enyo.FittableColumns">enyo.FittableColumns</a>.
    @extends enyo.FittableColumns
   */
  enyo.kind(
      /** @lends XV.DependencyItem# */{
    name: "XV.DependencyItem",
    kind: "FittableColumns",
    classes: "xv-dependency-item",
    published: {
      value: null,
      disabled: false
    },
    handlers: {
      onValueChange: "controlValueChanged"
    },
    components: [
      {kind: "XV.DependencyPicker", attr: "successor",
        showLabel: false}
    ],
    disabledChanged: function (oldValue) {
      this.$.dependencyPicker.setDisabled(this.disabled);
    },
    controlValueChanged: function (inSender, inEvent) {
      // What to do here?
      return true;
    },
    getDependencyPicker: function () {
      return this.$.dependencyPicker;
    },
    valueChanged: function () {
      // Anything to do here?
    }
  });

  /**
    @name XV.DependenciesWidget
    @class Use to implement a box for entering and viewing dependencies.
    Made up of a header, a repeater (the control for making the list of dependency items),
      and fittable columns for the navigation buttons.<br />
    Components: {@link XV.DependencyItem}.
   */
  enyo.kind(/** @lends XV.DependenciesWidget# */{
    name: "XV.DependenciesWidget",
    classes: "xv-dependencies-widget",
    published: {
      attr: null,
      model: null,
      value: null,
      disabled: false,
      parentKey: null,
      dependencyType: XV.SUCCESSOR
    },
    components: [
      {kind: "onyx.GroupboxHeader", content: "_successors".loc()},
      {kind: "Repeater", count: 0, onSetupItem: "setupItem", components: [
        {kind: "XV.DependencyItem"}
      ]},
      {kind: "FittableColumns", classes: "xv-dependency-buttons",
        components: [
        {kind: "onyx.Button", name: "newButton",
          classes: "xv-dependency-button", onclick: "newItem",
          content: "_new".loc()}
      ]}
    ],
    disabledChanged: function () {
      this.$.newButton.setDisabled(this.disabled);
    },
    /**
      Remove bindings
     */
    destroy: function () {
      if (this.value) {
        this.value.off('add', this.lengthChanged, this);
        this.value.off('statusChange', this.lengthChanged, this);
      }
      this.inherited(arguments);
    },
    /**
     Kick off the repeater.
     */
    lengthChanged: function () {
      this.$.repeater.setCount(this.readyModels().length);
    },
    /**
     Add a new model to the collection.
     */
    newItem: function () {
      var Klass = XT.getObjectByName(this.getModel()),
        parentKey = this.getParentKey(),
        model = new Klass(null, { isNew: true }),
        collection = this.getValue();

      model.set(parentKey, collection[parentKey]);
      collection.add(model);
    },
    /**
      Returns an array of models in the collection whose status is ready.

      @return {Array} models
     */
    readyModels: function () {
      return _.filter(this.value.models, function (model) {
        return model.isReady();
      });
    },
    /**
      Created because setting collection using auto-generated function
      doesn't actually kick over collection changed.
    */
    setCollection: function (collection) {
      this.collection = collection;
      this.collectionChanged();
    },
    /**
      Render the repeaterlist.
     */
    setupItem: function (inSender, inEvent) {
      var item = inEvent.item.$.dependencyItem,
        model = this.readyModels()[inEvent.index],
        picker = item.getDependencyPicker(),
        parentKey = this.getParentKey(),
        depParent = model.get(parentKey),
        workflowParent = depParent.getParent(),
        collection = workflowParent.get("workflow");
      item.setValue(model);
      item.setDisabled(this.disabled);
      if (picker) {
        debugger;
        picker.setCollection(collection);
      }
      return true;
    },
    /**
      Sort by status, then order, then name
     */
    sort: function (a, b) {
      var astatus = a.getStatus(),
        bstatus = b.getStatus(),
        achar = a.get('successor'),
        bchar = b.get('successor'),
        aord = achar ? achar.get('sequence') : null,
        bord = bchar ? bchar.get('sequence') : null,
        aname,
        bname;
      if (astatus === bstatus) {
        if (aord === bord) {
          aname = achar ? achar.get('name') : null;
          bname = bchar ? bchar.get('name') : null;
          return aname < bname ? -1 : 1;
        }
        return aord < bord ? -1 : 1;
      }
      return astatus < bstatus ? -1 : 1;
    },
    /**
      @param {XM.Collection} value
     */
    setValue: function (value) {
      if (this.value) {
        this.value.off('add', this.lengthChanged, this);
        this.value.off('statusChange', this.lengthChanged, this);
      }
      this.value = value;
      this.value.on('add', this.lengthChanged, this);
      this.value.on('statusChange', this.lengthChanged, this);
      this.value.comparator = this.sort;
      this.value.sort();
      this.lengthChanged();
    }
  });

}());
