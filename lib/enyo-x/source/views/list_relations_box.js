/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, bitwise:false*/
/*global XT:true, XM:true, XV:true, enyo:true, Globalize:true, _:true */

(function () {

  // ..........................................................
  // LIST RELATIONS BOX
  //

  /**
    @name XV.ListRelationsBox
    @class Provides a container in which its components are a vertically stacked group
    of horizontal rows.<br />
    Made up of a header, scroller (with a list of related data), and a row of navigation buttons.<br />
    Must include a component called "list" that must be of subkind {@link XV.ListRelations}.
    The `value` must be set to a collection of `XM.Info` models.

    The superkind of {@link XV.DocumentsBox}.
    @extends XV.ListBox
  */
  enyo.kind(
    /** @lends XV.ListRelationsBox# */{
    name: "XV.ListRelationsBox",
    kind: "XV.ListBox",
    published: {
      disabled: false,
      parentKey: "",
      listRelations: "",
      searchList: "",
      canOpen: true
    },
    handlers: {
      onSelect: "selectionChanged",
      onDeselect: "selectionChanged",
      onParentStatusChange: "workspaceModelStatusChanged"
    },
    /**
     Builds the box that contains the list of relationships: a group box comprised of a header, a scrollable list,
    and navigation buttons.
      XXX something wrong with using the components list? #refactor
     */
    create: function () {
      this.inherited(arguments);
      var canAttach = this.getSearchList().length > 0,
        buttons;

      // Buttons
      buttons = {kind: 'FittableColumns', name: "buttonsPanel", classes: "xv-buttons",
        defaultKind: 'onyx.Button', components: [
      ]};
      var canOpen = this.getCanOpen();

      if (canOpen) {
        buttons.components.push(
          {kind: "onyx.Button", name: "newButton", onclick: "newItem",
            disabled: true, classes: "icon-plus"}
        );
      }
      if (canAttach) {
        buttons.components.push(
          {kind: "onyx.Button", name: "attachButton", onclick: "attachItem",
            disabled: true, classes: "icon-link"},
          {kind: "onyx.Button", name: "detachButton", onclick: "detachItem",
            disabled: true, classes: "icon-unlink"}
        );
      }
      if (canOpen) {
        buttons.components.push(
          {kind: "onyx.Button", name: "openButton", onclick: "openItem",
            disabled: true, classes: "icon-folder-open"}
        );
      }
      this.createComponent(buttons);
    },
    /**
     @todo Document the attachItem method.
     */
    attachItem: function (inSender, inEvent) {
      var that = this,
        list = this.$.list,
        ListModel = list.getValue().model,
        key = this.getParentKey(),
        parent = list.getParent(),
        searchList = this.getSearchList(),

        // Callback to handle selection...
        callback = function (selectedModel) {

          // Instantiate the models involved.
          // this looks a little backwards, because what's actually going
          // on here is that we're taking a related model of the workspace
          // that we're in and attaching it to an editable model of the
          // item that we've just selected. This is on purpose!
          // Meanwhile, we have to populate the list with a related model
          // of the item that we've just selected, as selectedModel refers
          // to an info model, which is not the type of model we want
          // to use in the list
          var Klass = XT.getObjectByName(selectedModel.editableModel),
            attrs = {},
            model;
          attrs[Klass.prototype.idAttribute] = selectedModel.id;
          model = Klass.findOrCreate(attrs);
          if (!model.getRelation(key)) {
            XT.log("Model", model.recordType, "has no relation", key,
              ". It's likely that the property is on the list relation",
              "but not the editable orm, or you have it as a number",
              "in the editable orm instead of a nested object");
          }

          var InfoKlass = model.getRelation(key).relatedModel,
            infoAttrs = {},
            listAttrs = {},
            infoModel,
            listModel,
            setAndSave = function () {
              var K = XM.Model,
                lock, effective, lockMessage,
                options = {};

              if (model.getStatus() === K.READY_CLEAN &&
                  infoModel.getStatus() === K.READY_CLEAN &&
                  listModel.getStatus() === K.READY_CLEAN) {
                model.off('statusChange', setAndSave);
                infoModel.off('statusChange', setAndSave);
                listModel.off('statusChange', setAndSave);

                lock = model.get("lock");
                if (lock && !lock.key) {
                  // someone else has this record locked. We are disallowed
                  // from editing it.
                  effective = Globalize.format(new Date(lock.effective), "t");
                  lockMessage = "_lockInfo".loc()
                    .replace("{user}", lock.username)
                    .replace("{effective}", effective);

                  that.doNotify({message: lockMessage});
                  return;
                }

                // Callback to update our list with changes when save complete
                options.success = function () {
                  list.getValue().add(listModel);
                  model.releaseLock();
                };

                // Set and save our record with the new relation
                model.set(key, infoModel);
                model.save(null, options);
              }
            };

          infoAttrs[InfoKlass.prototype.idAttribute] = parent.id;
          infoModel = InfoKlass.findOrCreate(infoAttrs);
          listAttrs[ListModel.prototype.idAttribute] = selectedModel.id;
          listModel = ListModel.findOrCreate(listAttrs);

          // When fetch complete, trigger set and save
          model.on('statusChange', setAndSave);
          infoModel.on('statusChange', setAndSave);
          listModel.on('statusChange', setAndSave);

          // Go get the data
          model.fetch();
          infoModel.fetch();
          listModel.fetch();
        };

      // Open a search screen that excludes already attached records
      // these two conditions work at cross purposes, and serve to
      // get a result which is just all the nulls, which is what we
      // want.
      inEvent.list = searchList;
      inEvent.callback = callback;
      if (!inEvent.conditions) { inEvent.conditions = []; }
      inEvent.conditions.push({
        attribute: key,
        operator: "!=",
        value: parent,
        includeNull: true
      });
      inEvent.conditions.push({
        attribute: key,
        operator: "=",
        value: parent,
        includeNull: true
      });
      this.doSearch(inEvent);
    },
    /**
     @todo Document the attrChanged method.
     */
    attrChanged: function () {
      this.$.list.setAttr(this.attr);
    },
    /**
     @todo Document the detachItem method.
     */
    detachItem: function () {
      var list = this.$.list,
        key = this.parentKey,
        index = list.getFirstSelected(),
        infoModel = list.getModel(index),
        Klass = XT.getObjectByName(infoModel.editableModel),
        attrs = {},
        model,
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
              model.releaseLock();
            };

            // Set and save our contact without account relation
            model.set(key, null);
            model.save(null, options);
          }
        };

      attrs[Klass.prototype.idAttribute] = infoModel.id;
      model = Klass.findOrCreate(attrs);

      // When fetch complete, trigger set and save
      model.on('statusChange', setAndSave);

      // Go get the data
      model.fetch();
    },
    /**
      Reconsider whether buttons should be disabled. this.valueChanged()
      conveniently does this for us, so we use it even though the value hasn't changed.
     */
    disabledChanged: function () {
      this.valueChanged();
    },
    getList: function () {
      return this.getListRelations();
    },
    /**
     Spawn a new workspace, linked as a child to the one containing this box.
     */
    newItem: function () {
      var list = this.$.list,
        parent = this.$.list.getParent(),
        key = this.getParentKey(),
        workspace = XV.getWorkspace(list.value.model.prototype.recordType),
        attributes = {},
        callback = function (model) {
          if (!model) { return; }
          var Model = list.getValue().model,
            attrs = {},
            value,
            options = {};
          attrs[Model.prototype.idAttribute] = model.id;
          value = Model.findOrCreate(attrs);
          options.success = function () {
            list.getValue().add(value, {silent: true});
            list.lengthChanged();
          };
          value.fetch(options);
        },
        inEvent;
      attributes[key] = parent.id;
      inEvent = {
        originator: this,
        workspace: workspace,
        attributes: attributes,
        callback: callback,
        allowNew: false
      };
      this.doWorkspace(inEvent);
    },
    /**
     @todo Document the openItem method.
     */
    openItem: function () {
      var list = this.$.list,
        index = list.getFirstSelected(),
        model = list.getModel(index),
        coll = list.getValue(),
        workspace = XV.getWorkspace(model.recordType),
        id = model.id,
        callback = function (m) {
          if (!m) { return; }
          var options = {};
          options.success = function () {
            coll.add(model, {silent: true}); // Fetch blew it away
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
    /**
     @todo Document the selectionChanged method.
     */
    selectionChanged: function (inSender, inEvent) {
      var index = this.$.list.getFirstSelected(),
        model = index ? this.$.list.getModel(index) : null,
        canAttach = this.getSearchList().length > 0,
        couldNotRead = model ? (model.couldRead ? !model.couldRead() : model.getClass ? !model.getClass().canRead() : true) : true,
        couldNotUpdate = model ? (model.couldUpdate ? !model.couldUpdate() : model.getClass ? !model.getClass().canUpdate() : true) : true;
      if (canAttach) { this.$.detachButton.setDisabled(couldNotUpdate || this.getDisabled()); }
      if (this.$.openButton) {
        this.$.openButton.setDisabled(couldNotRead || this.getDisabled());
      }
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
          value.model.prototype.editableModel :
          value && value.model.prototype.recordType,
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

      if (this.getCanOpen()) {this.$.newButton.setDisabled(canNotCreate || this.getDisabled()); }
      if (canAttach) { this.$.attachButton.setDisabled(canNotUpdate || this.getDisabled()); }
    },
    /**
     @todo Document the valueChanged method.
     */
    valueChanged: function () {
      var value = this.getValue(); // Must be a collection of Info models

      this.$.list.setValue(value);
      this.updateButtons();
    },
    /**
      When the workspace containing this box has a change to the status of the model, it waterfalls
      down an event to be handled here. We will want to enable the new- and attach- buttons if
      the model is no longer in READY_NEW state.
     */
    workspaceModelStatusChanged: function (inSender, inEvent) {
      if (inEvent.status & XM.Model.READY) {
        this.updateButtons();
      }
    }
  });

  // ..........................................................
  // LIST GROUP RELATIONS BOX
  //

  /** @class
    Abstract class used for many to many groupings.
  */
  enyo.kind({
    name: "XV.ListGroupRelationsBox",
    kind: "XV.ListRelationsBox",
    published: {
      groupItemKey: null
    },
    canOpen: false,
    updateButtons: function () {
      this.$.attachButton.setDisabled(false);
    },
    attachItem: function () {
      var attr = this.attr,
        list = this.$.list,
        ListModel = list.getValue().model,
        groupItemKey = this.getGroupItemKey(),
        parent = list.getParent(),
        searchList = this.getSearchList(),
        SearchList = XT.getObjectByName(searchList),
        collection = SearchList.prototype.collection,
        SearchCollection = XT.getObjectByName(collection),
        idAttribute = SearchCollection.prototype.model.prototype.idAttribute,
        ids = [],
        inEvent,

        // Callback to handle selection...
        callback = function (selectedModel) {
          var model = new ListModel(null, {isNew: true}),
            relationName = _.find(model.relations, function (relation) {
              return relation.key === groupItemKey;
            }).relatedModel,
            Klass,
            newSelectedModel;

          if (relationName !== selectedModel.recordType) {
            //There's a disconnect between the model type of the list and the model type of the relation
            Klass = XT.getObjectByName(relationName);
            newSelectedModel = new Klass();
            newSelectedModel.fetch({id: selectedModel.id, success: function () {
              model.set(groupItemKey, newSelectedModel);
              parent.get(attr).add(model);
            }, error: function () {
              //console.log(arguments);
            }});
          } else {
            model.set(groupItemKey, selectedModel);
            parent.get(attr).add(model);
          }
        };

      _.each(parent.get(attr).models, function (item) {
        var model = item.get(groupItemKey);
        ids.push(model.id);
      });

      // Open a search screen excluding objects already selected
      inEvent = {
        list: searchList,
        callback: callback
      };
      if (ids.length) {
        inEvent.conditions = [{
          attribute: idAttribute,
          operator: "NOT ANY",
          value: ids
        }];
      }
      this.doSearch(inEvent);
    },
    detachItem: function () {
      var list = this.$.list,
        index = list.getFirstSelected(),
        model = list.getModel(index);

      model.destroy();
      list.lengthChanged();
    },
    selectionChanged: function (inSender, inEvent) {
      var index = this.$.list.getFirstSelected();
      this.$.detachButton.setDisabled(!index);
    }
  });

}());
