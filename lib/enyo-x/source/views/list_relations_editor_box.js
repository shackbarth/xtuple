/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, enyo:true*/

(function () {

  var _events = "change readOnlyChange statusChange";

  /**
    @name XV.RelationsEditor
    @class Use to define the editor for {@link XV.ListRelationsEditorBox}.
    @extends XV.Groupbox
  */
  var editor = enyo.mixin(XV.EditorMixin, /** @lends XV.RelationsEditor# */{
    name: "XV.RelationsEditor",
    kind: "XV.Groupbox",
    handlers: {
      onValueChange: "controlValueChanged"
    },
    /**
    @todo Document the destroy method.
    */
    destroy: function () {
      if (this.value) {
        this.value.off(_events, this.attributesChanged, this);
        this.value.off("notify", this.notify, this);
      }
      this.value = null;
      this.inherited(arguments);
    },
    /**
    @todo Document the setValue method.
    */
    setValue: function (value) {
      if (this.value) {
        this.value.off(_events, this.attributesChanged, this);
        this.value.off("notify", this.notify, this);
      }
      this.value = value;
      if (value) {
        this.value.on(_events, this.attributesChanged, this);
        this.value.on("notify", this.notify, this);
      }
      this.attributesChanged(value);
      if (this.valueChanged) { this.valueChanged(value); }
    }

  });
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
      fitButtons: true
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
      this.$.list.refresh();
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
        classes: "xv-groupbox-buttons",
        components: [
          {kind: "onyx.Button", name: "newButton", onclick: "newItem",
            content: "_new".loc(), classes: "xv-groupbox-button-left"},
          {kind: "onyx.Button", name: "deleteButton", onclick: "deleteItem",
            content: "_delete".loc(), classes: "xv-groupbox-button-center",
            disabled: true},
          {kind: "onyx.Button", name: "prevButton", onclick: "prevItem",
            content: "<", classes: "xv-groupbox-button-center",
            disabled: true},
          {kind: "onyx.Button", name: "nextButton", onclick: "nextItem",
            content: ">", classes: "xv-groupbox-button-center",
            disabled: true},
          {kind: "onyx.Button", name: "doneButton", onclick: "doneItem",
            content: "_done".loc(), classes: "xv-groupbox-button-right",
            disabled: true, fit: this.getFitButtons()}
        ]
      });

    },
    /**
      Marks the model of the selected item to be deleted on save
      and remove it from its parent collection and the Enyo list
    */
    deleteItem: function () {
      var index = this.$.list.getFirstSelected(),
        model = index ? this.$.list.getModel(index) : null,
        collection = this.getValue();
      this.$.list.getSelection().deselect(index, false);
      model.destroy();
      collection.remove(model);
      this.$.list.lengthChanged();
    },
    /**
      Disables or enables the view
     */
    disabledChanged: function () {
      this.$.newButton.setDisabled(this.getDisabled());
      // complicated logic we need to disable and enable the
      // done and delete buttons is here:
      this.selectionChanged();
    },
    /**
      Close the edit session and return to read-only summary view
    */
    doneItem: function () {
      var index = this.$.list.getFirstSelected(),
        selection = this.$.list.getSelection();
      selection.deselect(index);
    },
    /**
      Add a new model to the collection and bring up a blank editor to fill it in
    */
    newItem: function () {
      var collection = this.$.list.getValue(),
        Klass = collection.model,
        model = new Klass(null, {isNew: true});
      this.$.editor.clear();
      collection.add(model);
      this.$.list.select(collection.length - 1);
    },
    /**
      Move to edit the next item in the collection.
    */
    nextItem: function () {
      var index = this.$.list.getFirstSelected() - 0;
      this.$.list.select(index + 1);
    },
    /**
      Move to edit the previous line in the collection.
    */
    prevItem: function () {
      var index = this.$.list.getFirstSelected() - 0;
      this.$.list.select(index - 1);
    },
    /**
    @todo Document the selectionChanged method.
    */
    selectionChanged: function () {
      var index = this.$.list.getFirstSelected(),
        model = index ? this.$.list.getModel(index) : null,
        K = XM.Model,
        that = this;
      this.$.deleteButton.setDisabled(true);
      this.$.doneButton.setDisabled(!index || this.getDisabled());
      if (index) {
        this.$.editor.setValue(model);
        if (model.isNew() ||
          model.isBusy() && model._prevStatus === K.READY_NEW) {
          this.$.deleteButton.setDisabled(this.getDisabled());
        } else {
          model.used({
            success: function (resp) {
              that.$.deleteButton.setDisabled(resp || that.getDisabled());
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
    @todo Document the valueChanged method.
    */
    valueChanged: function () {
      var value = this.getValue();
      this.$.list.setValue(value);
    }
  });

}());
