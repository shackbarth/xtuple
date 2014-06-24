/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XM:true, XV:true, XT:true, _:true, enyo:true*/

(function () {

  var _events = "change readOnlyChange statusChange refreshView";

  XV.RelationsEditorMixin = enyo.mixin({
    events: {
      onNotify: ""
    },
    published: {
      value: null
    },
    handlers: {
      onValueChange: "controlValueChanged"
    },
    bind: function (action) {
      if (this.value) {
        this.value[action](_events, this.attributesChanged, this);
        this.value[action]("notify", this.notify, this);
        if (this.value.meta) {
          this.value.meta[action]("change", this.attributesChanged, this);
        }
      }
    },
    destroy: function () {
      this.bind("off");
      this.value = null;
      this.inherited(arguments);
    },
    setValue: function (value) {
      this.bind("off");
      this.value = value;
      this.bind("on");
      this.attributesChanged(value);
      if (this.valueChanged) { this.valueChanged(value); }
    }

  }, XV.EditorMixin);

  /**
    @name XV.RelationsEditor
    @class Use to define the editor for {@link XV.ListRelationsEditorBox}.
    @extends XV.Groupbox
  */
  var editor = enyo.mixin({
    name: "XV.RelationsEditor",
    kind: "XV.Groupbox",
  }, XV.RelationsEditorMixin);
  enyo.kind(editor);

  /**
    @name XV.ListRelationsEditorBox
    @class Provides a container in which its components
    are a vertically stacked group of horizontal rows.<br />
    Made up of a header, panels, and a row of navigation buttons.<br />
    Must include a component called `list`.
    List must be of subkind {@link XV.ListRelations}.
    The `value` must be set to a collection of `XM.Model`.
    @extends XV.Groupbox
  */
  enyo.kind(/** @lends XV.ListRelationsEditorBox# */{
    name: "XV.ListRelationsEditorBox",
    kind: "XV.Groupbox",
    classes: "panel xv-relations-editor-box",
    published: {
      attr: null,
      disabled: false,
      value: null,
      title: "",
      parentKey: "",
      listRelations: "",
      editor: null,
      summary: null,
      childWorkspace: null,
      fitButtons: true
    },
    events: {
      onError: "",
      onChildWorkspace: ""
    },
    handlers: {
      onSelect: "selectionChanged",
      onDeselect: "selectionChanged",
      onTransitionFinish: "transitionFinished",
      onValueChange: "controlValueChanged"
    },
    /**
    @todo Document the attrChanged method.
    */
    attrChanged: function () {
      this.$.list.setAttr(this.attr);
    },
    /**
    @todo Document the controlValueChanged method.
    */
    controlValueChanged: function () {
      // this is getting called before the list is created
      if (this.$.list) {
        this.$.list.refresh();
      }
      return true;
    },
    /**
    @todo Document the create method.
    */
    create: function () {
      this.inherited(arguments);
      var editor = this.getEditor(),
        panels,
        control;

      // Header
      this.createComponent({
        kind: "onyx.GroupboxHeader",
        content: this.getTitle()
      });

      // List
      panels = {
        kind: "Panels",
        fit: true,
        arrangerKind: "CollapsingArranger",
        components: [
          {kind: editor, name: "editor"},
          {kind: this.getListRelations(), name: "list",
            attr: this.getAttr()}
        ]
      };
      control = this.createComponent(panels);
      control.setIndex(1);

      // Buttons
      this.createComponent({
        kind: "FittableColumns",
        name: "navigationButtonPanel",
        classes: "xv-buttons",
        components: [
          {kind: "onyx.Button", name: "newButton", onclick: "newItem",
          classes: "icon icon-plus"},
          {kind: "onyx.Button", name: "deleteButton", onclick: "deleteItem",
            disabled: true, classes: "icon-minus"},
          {kind: "onyx.Button", name: "prevButton", onclick: "prevItem",
            disabled: true, classes: "icon-chevron-left"},
          {kind: "onyx.Button", name: "nextButton", onclick: "nextItem",
            disabled: true, classes: "icon-chevron-right"},
          {kind: "onyx.Button", name: "doneButton", onclick: "doneItem",
            disabled: true, classes: "icon-ok"},
          {kind: "onyx.Button", name: "expandButton", ontap: "launchWorkspace",
            classes: "icon-resize-full"}
        ]
      });
      this.$.expandButton.setShowing(_.isString(this.getChildWorkspace()));
    },

    /**
      Marks the model of the selected item to be deleted on save
      and remove it from its parent collection and the Enyo list
    */
    deleteItem: function () {
      var index = this.$.list.getFirstSelected(),
        model = index ? this.$.list.getModel(index) : null;
      this.$.list.getSelection().deselect(index, false);
      model.destroy();
      this.$.list.lengthChanged();
    },
    destroy: function () {
      this.unbind();
      this.getValue().off("add remove", this.valueChanged, this);
      this.inherited(arguments);
    },
    /**
      Disables or enables the view
     */
    disabledChanged: function () {
      this.$.newButton.setDisabled(this.getDisabled());
      // complicated logic we need to disable and enable the
      // done and delete buttons is here:
      this.selectionChanged();
      this.$.expandButton.setDisabled(this.getDisabled());
    },
    /**
      Close the edit session and return to read-only summary view
    */
    doneItem: function () {
      var index = this.$.list.getFirstSelected(),
        selection = this.$.list.getSelection();
      if (this.validate() && index) {
        selection.deselect(index);
        if (this.$.list.$.page0 && !this.$.list.$.page0.hasNode()) {
          XT.log("Warning: page0 doesn't hasNode");
        } else if (this.$.list.$.page1 && !this.$.list.$.page1.hasNode()) {
          XT.log("Warning: page1 doesn't hasNode");
        }
        this.$.list.render();
      }
    },
    error: function (model, error) {
      var inEvent = {
        model: model,
        error: error
      };
      this.doError(inEvent);
    },
    launchWorkspace: function (inSender, inEvent) {
      var index = Number(this.$.list.getFirstSelected());
      this.doChildWorkspace({
        workspace: this.getChildWorkspace(),
        collection: this.getValue(),
        index: index,
        listRelations: this.$.list
      });
      return true;
    },
    /**
      Add a new model to the collection and bring up a blank editor to fill it in
    */
    newItem: function () {
      var collection = this.$.list.getValue(),
        Klass = collection.model,
        model = new Klass(null, {isNew: true}),
        components = this.$.editor.getComponents(),
        scroller,
        length,
        first;
      if (this.validate()) {
        this.$.editor.clear();
        collection.add(model);
        if (collection.comparator) { collection.sort(); }

        // Exclude models marked for deletion
        length = _.filter(collection.models, function (model) {
          return !model.isDestroyed();
        }).length;
        this.$.list.select(length - 1);

        // Scroll to top and set focus on first available widget
        scroller = _.find(components, function (c) {
          return c instanceof enyo.Scroller;
        });
        if (scroller) { scroller.scrollToTop(); }
        first = _.find(components, function (c) {
          return c.attr && !model.isReadOnly(c.attr);
        });
        if (first && first.focus) {
          first.focus();
        }
      }
    },
    /**
      Move to edit the next item in the collection.
    */
    nextItem: function () {
      var index = this.$.list.getFirstSelected() - 0;
      if (this.validate()) {
        this.$.list.select(index + 1);
      }
    },
    /**
      Move to edit the previous line in the collection.
    */
    prevItem: function () {
      var index = this.$.list.getFirstSelected() - 0;
      if (this.validate()) {
        this.$.list.select(index - 1);
      }
    },
    /**
    @todo Document the selectionChanged method.
    */
    selectionChanged: function () {
      var index = this.$.list.getFirstSelected(),
        model = index ? this.$.list.getModel(index) : null,
        K = XM.Model,
        that = this;
      this.unbind();
      this.$.deleteButton.setDisabled(true);
      this.$.doneButton.setDisabled(!index || this.getDisabled());
      if (model) {
        model.on("invalid", this.error, this); // Error event binding
        this.$.editor.setValue(model);
        if (model.isNew() ||
          model.isBusy() && model._prevStatus === K.READY_NEW) {
          this.$.deleteButton.setDisabled(this.getDisabled());
        } else {
          model.used({
            success: function (resp) {
              if (that.$.deleteButton) { // Sometimes the workspace has been closed
                that.$.deleteButton.setDisabled(resp || that.getDisabled());
              }
            }
          });
        }
        if (this.$.panels.getIndex()) { this.$.panels.setIndex(0); }
        this.$.prevButton.setDisabled(index - 0 === 0);
        this.$.nextButton.setDisabled(index - 0 === this.$.list.value.length - 1);
      } else {
        if (!this.$.panels.getIndex()) { this.$.panels.setIndex(1); }
        this.$.prevButton.setDisabled(true);
        this.$.nextButton.setDisabled(true);
      }
    },
    /**
    @todo Document the transitionFinished method.
    */
    transitionFinished: function (inSender, inEvent) {
      if (inEvent.originator.name === 'panels') {
        if (this.$.panels.getIndex() === 1) {
          this.doneItem();
        }
        return true;
      }
    },
    /**
      Remove current model bindings.
    */
    unbind: function () {
      var model = this.$.editor.getValue();
      if (model) {
        model.off("invalid", this.error, this);
      }
    },
    /**
      Returns whether a selected model is validate. If
      none selected returns `true`. If an error is found
      an error event is raised.

      @returns {Boolean}
    */
    validate: function () {
      var list = this.$.list,
        index = list.getFirstSelected() - 0,
        model = isNaN(index) ? false : list.getModel(index),
        error = model ? model.validate(model.attributes) : false;
      if (error) {
        this.error(model, error);
        return false;
      }
      return true;
    },
    /**
    @todo Document the valueChanged method.
    */
    valueChanged: function () {
      var value = this.getValue();
      // Make sure list refreshes if collection changed
      if (value) {
        value.once("add remove", this.valueChanged, this);
      }
      this.$.list.setValue(value);
    }
  });

}());
