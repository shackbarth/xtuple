/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, onyx:true, enyo:true, XT:true */

(function () {

  /**
    @class

    The ChildWorkspaceContainer is used for handling child items within
    a larger workspace, e.g. QuoteLineItems within the Quote workspace.

    It takes a normal workspace as its workspace, but as a
    container acts more like a ListRelationsEditorBox. Notably, it does not
    save changes to the DB, because that is disallowed for child models.
    Rather, it just sets the models, then the user will back out of this screen
    into the master workspace and save everything from there.
   */
  enyo.kind(/* @lends XV.ChildWorkspaceContainer */{
    name: "XV.ChildWorkspaceContainer",
    kind: "XV.WorkspaceContainer",
    /**
      index: the index of the model of the backing collection that's currently
      presented in the workspace
     */
    published: {
      collection: null,
      modelIndex: ""
    },
    components: [
      {kind: "FittableRows", name: "navigationPanel", classes: "left", components: [
        {kind: "onyx.Toolbar", name: "menuToolbar", components: [
          {kind: "onyx.Button", name: "backButton",
            content: "_back".loc(), onclick: "close"}
        ]},
        {name: "loginInfo", content: "", classes: "xv-navigator-header"},
        {name: "menu", kind: "List", fit: true, touch: true,
           onSetupItem: "setupItem", components: [
          {name: "item", classes: "item enyo-border-box", ontap: "itemTap"}
        ]}
      ]},
      {kind: "FittableRows", name: "contentPanel", components: [
        {kind: "onyx.MoreToolbar", name: "contentToolbar", components: [
          {kind: "onyx.Grabber"},
          {name: "title", style: "width: 200px"},
					// The MoreToolbar is a FittableColumnsLayout, so this spacer takes up all available space
          {name: "space", fit: true},
          {kind: "Image", showing: false, name: "lockImage", ontap: "lockTapped",
            src: "/client/lib/enyo-x/assets/menu-icon-lock.png"},
          {kind: "onyx.Button", name: "printButton", showing: false,
            content: "_print".loc(), onclick: "print"},
          {kind: "onyx.Button", name: "newButton",
            content: "_new".loc(), onclick: "newItem"},
          {kind: "onyx.Button", name: "deleteButton",
            content: "_delete".loc(), onclick: "deleteItem"},
          {kind: "onyx.Button", name: "prevButton",
            content: "<", onclick: "prevItem"},
          {kind: "onyx.Button", name: "nextButton",
            content: ">", onclick: "nextItem"}//,
          //{kind: "onyx.Button", name: "doneButton",
          //  content: "_done".loc(), onclick: "done"}
        ]},
        {name: "header", content: "_loading".loc(), classes: "xv-workspace-header"},
        {kind: "onyx.Popup", name: "spinnerPopup", centered: true,
          modal: true, floating: true, scrim: true,
          onHide: "popupHidden", components: [
          {kind: "onyx.Spinner"},
          {name: "spinnerMessage", content: "_loading".loc() + "..."}
        ]},
        // This is used by notify and could be used by other things as well.
        // We just don't want to break the api by re-naming it
        {kind: "onyx.Popup", name: "errorPopup", centered: true,
          modal: true, floating: true, scrim: true, components: [
          {name: "errorMessage", content: "_error".loc()},
          {tag: "br"},
          {kind: "onyx.Button", content: "_ok".loc(), ontap: "errorOk",
            classes: "onyx-blue xv-popup-button"}
        ]}
      ]}
    ],
    close: function (options) {
      options.force = true;
      this.inherited(arguments);
    },
    /**
      Delete the model of the selected item and remove it from the list
    */
    deleteItem: function () {
      this.getCollection().at(this.getModelIndex()).destroy();
      this.renderWorkspace();
    },
    /**
      Close the advanced edit session and return to summary view
    */
    //doneItem: function () {
    //  this.doPrevious();
    //},
    /**
      Add a new model to the collection and bring up a blank editor to fill it in
    */
    newItem: function () {
      var collection = this.getCollection(),
        Klass = collection.model,
        model = new Klass(null, {isNew: true});
      //this.$.editor.clear();
      collection.add(model);
      this.setModelIndex(collection.length - 1);
      this.renderWorkspace();
    },
    /**
      Move to edit the next item in the collection.
    */
    nextItem: function () {
      this.setModelIndex(this.getModelIndex() + 1);
      this.renderWorkspace();
    },
    /**
      Move to edit the previous line in the collection.
    */
    prevItem: function () {
      this.setModelIndex(this.getModelIndex() - 1);
      this.renderWorkspace();
    },
    /**
      Loads a workspace into the workspace container.
      Accepts the following options:
        * workspace: class name (required)
        * collection: the collection that backs this child workspace container
        * index: the index of the collection to start with (default 0) TODO

        * attributes: default attribute values for a new record.
        * success: function to call from the workspace when the workspace
          has either successfully fetched or created a model.
        * callback: function to call on either a successful save, or the user
          leaves the workspace without saving a new record. Passes the new or
          updated model as an argument.
    */
    setWorkspace: function (options) {
      var menuItems = [],
        prop,
        headerAttrs,
        workspace = options.workspace,
        callback = options.callback,
        attributes = options.attributes;

      this.setCollection(options.collection);
      this.setModelIndex(options.index || 0);
      if (workspace) {
        this.destroyWorkspace();
        workspace = this.createComponent({
          name: "workspace",
          container: this.$.contentPanel,
          kind: workspace,
          fit: true,
          callback: callback
        });
        headerAttrs = workspace.getHeaderAttrs() || [];
        if (headerAttrs.length) {
          this.$.header.show();
        } else {
          this.$.header.hide();
        }

        this.render();
      }

      // Build menu by finding all panels
      this.$.menu.setCount(0);
      for (prop in workspace.$) {
        if (workspace.$.hasOwnProperty(prop) &&
            workspace.$[prop] instanceof enyo.Panels) {
          menuItems = menuItems.concat(workspace.$[prop].getPanels());
        }
      }
      this.setMenuItems(menuItems);
      this.$.menu.setCount(menuItems.length);
      this.$.menu.render();


      // disable and enable navigation buttons as appropriate
      this.renderWorkspace();
    },
    renderWorkspace: function () {
      var index = this.getModelIndex(),
        model = this.getCollection().at(index),
        that = this;

      this.$.deleteButton.setDisabled(true);
      //this.$.doneButton.setDisabled(!index);
      //if (index) {
        this.$.workspace.setValue(model);
        this.$.workspace.attributesChanged(model);
        if (model.isNew()) {
          this.$.deleteButton.setDisabled(false);
        } else {
          model.used({
            success: function (resp) {
              that.$.deleteButton.setDisabled(resp);
            }
          });
        }
        //if (this.$.panels.getIndex()) { this.$.panels.setIndex(0); }
        this.$.prevButton.setDisabled(index - 0 === 0);
        this.$.nextButton.setDisabled(index - 0 === this.getCollection().length - 1);
      //} else {
        //if (!this.$.panels.getIndex()) { this.$.panels.setIndex(1); }
        //this.$.prevButton.setDisabled(true);
        //this.$.nextButton.setDisabled(true);
      //}

    }/*,

    statusChanged: function (inSender, inEvent) {
      var model = inEvent.model,
        K = XM.Model,
        status = inEvent.status,
        isNotReady = status !== K.READY_CLEAN && status !== K.READY_DIRTY,
        canCreate = model.getClass().canCreate(),
        canUpdate = model.canUpdate() || status === K.READY_NEW,
        isEditable = canUpdate && !model.isReadOnly(),
        canNotSave = !model.isDirty() || !isEditable,
        message;

      // Status dictates whether buttons are actionable

      if (canCreate && this.getAllowNew()) {
        this.$.saveAndNewButton.show();
      } else {
        this.$.saveAndNewButton.hide();
      }
      this.$.refreshButton.setDisabled(isNotReady);
      this.$.applyButton.setDisabled(canNotSave);
      this.$.saveAndNewButton.setDisabled(canNotSave);
      this.$.saveButton.setDisabled(canNotSave);


      // Toggle spinner popup
      if (status & K.BUSY) {
        if (status === K.BUSY_COMMITTING) {
          message = "_saving".loc() + "...";
        }
        this.spinnerShow(message);
      } else {
        this.spinnerHide();
      }
    }*/
  });



}());
