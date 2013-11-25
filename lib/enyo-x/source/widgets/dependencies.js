/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true, strict:false*/
/*global enyo:true, XT:true, XM:true, XV:true, _:true, Backbone:true */

(function () {

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
    published: {
      suppressedId: ""
    },
    classes: "xv-dependency-picker",
    showLabel: false,
    noneText: "_delete".loc(),
    noneClasses: "xv-negative",
    idAttribute: "uuid",
    orderBy: [
      {attribute: 'sequence'}
    ],
    filter: function (models, options) {
      var suppressedId = this.getSuppressedId();

      return _.filter(models || [], function (model) {
        return model.id !== suppressedId;
      });
    }
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
      parentId: "",
      disabled: false
    },
    handlers: {
      onValueChange: "controlValueChanged"
    },
    components: [
      {kind: "XV.DependencyPicker"}
    ],
    disabledChanged: function (oldValue) {
      this.$.dependencyPicker.setDisabled(this.disabled);
    },
    controlValueChanged: function (inSender, inEvent) {
      var value = inSender.getValue(),
        model = this.getValue();
      if (_.isObject(value)) {
        model.set("id", value.id);
      } else {
        model.off("change");
        model.unset("id"); // So we can destroy w/o triggering sync
        model.destroy();
      }
      return true;
    },
    parentIdChanged: function () {
      var picker = this.$.dependencyPicker;

      picker.setSuppressedId(this.getParentId());
      picker.buildList();
    },
    setCollection: function (collection) {
      this.$.dependencyPicker.setCollection(collection);
    },
    valueChanged: function () {
      var picker = this.$.dependencyPicker,
        model = this.getValue(),
        id = model.get("id");

      picker.setValue(id, {silent: true});
    }
  });

  var _changed = function (model) {
    var ids = this._successors.pluck("id").toString();
    this.setValue({successors: ids});
  };

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
    events: {
      onValueChange: ""
    },
    published: {
      attr: null,
      model: null,
      workflow: null,
      parentId: "",
      successors: null,
      disabled: false
    },
    components: [
      {kind: "onyx.GroupboxHeader", content: "_successors".loc()},
      {kind: "Repeater", count: 0, onSetupItem: "setupItem", components: [
        {kind: "XV.DependencyItem"}
      ]},
      {kind: "FittableColumns", classes: "xv-dependency-buttons",
        components: [
        {kind: "onyx.Button", name: "newButton",
          classes: "icon-plus-sign-alt xv-dependency-button", onclick: "newItem"}
      ]}
    ],
    create: function () {
      this.inherited(arguments);
      this._successors = new Backbone.Collection();
      this._successors.on("remove", _changed, this);
    },
    disabledChanged: function () {
      this.$.newButton.setDisabled(this.disabled);
    },
    /**
     Kick off the repeater.
     */
    lengthChanged: function () {
      this.$.repeater.setCount(this._successors.length);
    },
    newItem: function () {
      var model = new Backbone.Model();
      model.on("change", _changed, this);
      this._successors.add(model);
      this.lengthChanged();
    },
    /**
      Render the repeaterlist.
     */
    setupItem: function (inSender, inEvent) {
      var item = inEvent.item.$.dependencyItem,
        successor = this._successors.at(inEvent.index),
        workflow = this.getWorkflow();
      item.setDisabled(this.disabled);
      item.setCollection(workflow);
      item.setParentId(this.getParentId());
      item.setValue(successor);
      return true;
    },

    setValue: function (value, options) {
      options = options || {};
      var attr = this.getAttr(),
        changed = {},
        keys = _.keys(value),
        key,
        set,
        i;

      // Loop through the properties and update calling
      // appropriate "set" functions and add to "changed"
      // object if applicable
      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        set = 'set' + key.slice(0, 1).toUpperCase() + key.slice(1);
        this[set](value[key]);
        if (attr[key]) {
          changed[attr[key]] = value[key];
        }
      }

      // Bubble changes if applicable
      if (!_.isEmpty(changed) && !options.silent) {
        this.doValueChange({value: changed});
      }
    },

    successorsChanged: function () {
      var successors = this.getSuccessors(),
        that = this,
        models = [];

      successors =  successors ? successors.split(",") : [];

      // Handle as an array internally
      _.each(successors, function (successor) {
        var model = new Backbone.Model();
        model.set("id", successor);
        model.on("change", _changed, that);
        models.push(model);
      });
      this._successors.reset(models);
      this.lengthChanged();
    }

  });

}());
