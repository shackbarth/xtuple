/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  /**
    Must include a component called `list`.
    List must be of sub-kind `XV.ListRelations`.
    The `value` must be set to a collection of `XM.Info` models.

    @class
    @name XV.ListRelationsBox
    @extends XV.Groupbox
  */
  enyo.kind(/** @lends XV.ListRelationsBox# */{
    name: "XV.ListRelationsBox",
    kind: "XV.Groupbox",
    classes: "panel",
    published: {
      attr: null,
      value: null,
      title: "",
      parentKey: "",
      listRelations: "",
      searchList: "",
      canOpen: true
    },
    events: {
      onSearch: "",
      onWorkspace: ""
    },
    handlers: {
      onSelect: "selectionChanged",
      onDeselect: "selectionChanged",
      onParentStatusChange: "workspaceModelStatusChanged"
    },
    create: function () {
      this.inherited(arguments);
      var canAttach = this.getSearchList().length > 0,
        buttons;

      // Header
      this.createComponent({
        kind: "onyx.GroupboxHeader",
        content: this.getTitle()
      });

      // List
      this.createComponent({
        kind: this.getListRelations(),
        name: "list",
        attr: this.getAttr(),
        fit: true
      });

      // Buttons
      buttons = {kind: 'FittableColumns', classes: "xv-groupbox-buttons",
        components: [
      ]};
      var canOpen = this.getCanOpen();
      if (canOpen) {
        buttons.components.push(
        {kind: "onyx.Button", name: "newButton", onclick: "newItem",
          content: "_new".loc(), classes: "xv-groupbox-button-left",
          disabled: true});
      }
      if (canAttach) {
        buttons.components.push(
        {kind: "onyx.Button", name: "attachButton", onclick: "attachItem",
          content: "_attach".loc(), classes: "xv-groupbox-button-center",
          disabled: true},
        {kind: "onyx.Button", name: "detachButton", onclick: "detachItem",
          content: "_detach".loc(), classes: "xv-groupbox-button-center",
          disabled: true});
      }
      if (canOpen) {
        buttons.components.push(
        {kind: "onyx.Button", name: "openButton", onclick: "openItem",
          content: "_open".loc(), classes: "xv-groupbox-button-right",
          disabled: true, fit: canAttach});
      }
      this.createComponent(buttons);
    },
    attachItem: function () {
      var list = this.$.list,
        key = this.getParentKey(),
        parent = list.getParent(),
        searchList = this.getSearchList(),
        inEvent,

        // Callback to handle selection...
        callback = function (selectedModel) {

          // Instantiate the models involved
          var Klass = XT.getObjectByName(selectedModel.editableModel),
            model = new Klass({id: selectedModel.id}),
            InfoKlass = model.getRelation('account').relatedModel,
            infoModel = new InfoKlass({id: parent.id}),
            setAndSave = function () {
              var K = XM.Model,
                options = {};
              if (model.getStatus() === K.READY_CLEAN &&
                  infoModel.getStatus() === K.READY_CLEAN) {
                model.off('statusChange', setAndSave);
                infoModel.off('statusChange', setAndSave);

                // Callback to update our list with changes when save complete
                options.success = function () {
                  list.getValue().add(selectedModel);
                };

                // Set and save our contact with the new account relation
                model.set(key, infoModel);
                model.save(null, options);
              }
            };

          // When fetch complete, trigger set and save
          model.on('statusChange', setAndSave);
          infoModel.on('statusChange', setAndSave);

          // Go get the data
          model.fetch();
          infoModel.fetch();
        };

      // Open a search screen that excludes already attached records
      inEvent = {
        list: searchList,
        callback: callback,
        conditions: [{
          attribute: key,
          operator: "!=",
          value: parent,
          includeNull: true
        }]
      };
      this.doSearch(inEvent);
    },
    attrChanged: function () {
      this.$.list.setAttr(this.attr);
    },
    detachItem: function () {
      var list = this.$.list,
        key = this.parentKey,
        index = list.getFirstSelected(),
        infoModel = list.getModel(index),
        Klass = XT.getObjectByName(infoModel.editableModel),
        model = new Klass({id: infoModel.id}),
        setAndSave = function () {
          var K = XM.Model,
            options = {};
          if (model.getStatus() === K.READY_CLEAN) {
            model.off('statusChange', setAndSave);

            // Callback to update our list with changes when save complete
            options.success = function () {
              list.getValue().remove(infoModel);
              list.setCount(list.getValue().length);
              list.refresh();
            };

            // Set and save our contact without account relation
            model.set(key, null);
            model.save(null, options);
          }
        };

      // When fetch complete, trigger set and save
      model.on('statusChange', setAndSave);

      // Go get the data
      model.fetch();
    },
    newItem: function () {
      var list = this.$.list,
        parent = this.$.list.getParent(),
        workspace = XV.getWorkspace(list.value.model.prototype.recordType),
        key = this.parentKey,
        attributes = {},
        callback = function (model) {
          var Model = list.getValue().model,
            value = new Model({id: model.id}),
            options = {};
          options.success = function () {
            list.getValue().add(value);
          };
          value.fetch(options);
        },
        inEvent;
      attributes[key] = parent.id;
      inEvent = {
        originator: this,
        workspace: workspace,
        attributes: attributes,
        callback: callback
      };
      this.doWorkspace(inEvent);
    },
    openItem: function () {
      var list = this.$.list,
        index = list.getFirstSelected(),
        model = list.getModel(index),
        workspace = XV.getWorkspace(model.recordType),
        id = model.id,
        callback = function () {
          var options = {};
          options.success = function () {
            list.refresh();
          };
          // Refresh
          model.fetch(options);
        },
        inEvent = {
          workspace: workspace,
          id: id,
          callback: callback
        };

      this.doWorkspace(inEvent);
    },
    selectionChanged: function (inSender, inEvent) {
      var index = this.$.list.getFirstSelected(),
        model = index ? this.$.list.getModel(index) : null,
        canAttach = this.getSearchList().length > 0,
        couldNotRead = model ? !model.couldRead() : true,
        couldNotUpdate = model ? !model.couldUpdate() : true;
      if (canAttach) { this.$.detachButton.setDisabled(couldNotUpdate); }
      this.$.openButton.setDisabled(couldNotRead);
    },
    /**
      Whether or not the new and attach buttons are enabled is based on
      complex criteria based on the status of the workspace model, the
      permissions of the user, and attributes of the list model. Therefore
      this code can be executed based on changes coming from multiple
      possible areas, and this function consolidates this functionality.
     */
    updateButtons: function () {
      var value = this.getValue(), // Must be a collection of Info models
        canAttach = this.getSearchList().length > 0,
        editableModel = value && value.model.prototype.editableModel ?
          value.model.prototype.editableModel : null,
        Klass = editableModel ?
          XT.getObjectByName(editableModel) : null,
        K = XM.Model,
        parentModel = this.$.list.getParent(),
        // if the list is a DocumentsListRelations then there will be no getParent() model, but
        // in this case we do not want to disable the buttons, so we can set the status to be
        // anything except READY_NEW
        parentModelStatus = parentModel ? parentModel.getStatus() : null,
        canNotCreate = Klass ? !Klass.canCreate() || parentModelStatus === K.READY_NEW : true,
        canNotUpdate = Klass ? !Klass.canUpdate() || parentModelStatus === K.READY_NEW : true;

      if (this.getCanOpen()) {this.$.newButton.setDisabled(canNotCreate); }
      if (canAttach) { this.$.attachButton.setDisabled(canNotUpdate); }
    },
    valueChanged: function () {
      var value = this.getValue(); // Must be a collection of Info models

      this.$.list.setValue(value);
      this.updateButtons();
    },
    /**
      When the workspace containing this box has a change to the status of the model, it waterfalls
      down an event to be handled here. We will want to enable the new- and attach- buttons if
      the model is no longer in READY_NEW state
     */
    workspaceModelStatusChanged: function (inSender, inEvent) {
      if (inEvent.status & XM.Model.READY) {
        this.updateButtons();
      }
    }
  });

}());
