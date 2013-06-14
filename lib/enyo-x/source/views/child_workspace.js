/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, onyx:true, enyo:true, XT:true */

(function () {

  /**
    @name XV.ChildWorkspaceContainer
    @class The ChildWorkspaceContainer is used for handling child items within
    a larger workspace, e.g. QuoteLineItems within the Quote workspace.

    It takes a normal workspace as its workspace, but as a
    container acts more like a ListRelationsEditorBox. Notably, it does not
    save changes to the DB, because that is disallowed for child models.
    Rather, it just sets the models, then the user will back out of this screen
    into the master workspace and save everything from there.
    @extends XV.WorkspaceContainer
   */
  enyo.kind(/** @lends XV.ChildWorkspaceContainer# */{
    name: "XV.ChildWorkspaceContainer",
    kind: "XV.WorkspaceContainer",
    /**
      index: the index of the model of the backing collection that's currently
      presented in the workspace
     */
    published: {
      collection: null,
      modelIndex: "",
      listRelations: null
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
            src: "/assets/menu-icon-lock.png"},
          {kind: "onyx.Button", name: "printButton", showing: false,
            content: "_print".loc(), onclick: "print"},
          {kind: "onyx.Button", name: "newButton",
            content: "_new".loc(), onclick: "newItem"},
          {kind: "onyx.Button", name: "deleteButton",
            content: "_delete".loc(), onclick: "deleteItem"},
          {kind: "onyx.Button", name: "prevButton",
            content: "_previous".loc(), onclick: "prevItem"},
          {kind: "onyx.Button", name: "nextButton",
            content: "_next".loc(), onclick: "nextItem"}//,
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
        ]},
        {kind: "onyx.Popup", name: "lockPopup", centered: true,
          modal: true, floating: true, components: [
          {name: "lockMessage", content: ""},
          {tag: "br"},
          {kind: "onyx.Button", content: "_ok".loc(), ontap: "lockOk",
            classes: "onyx-blue xv-popup-button"}
        ]}
      ]}
    ],
    /**
      Two changes from the default. First, do not ask the user if they want
      to save, because we're not saving here anyway. Second, we have to keep the
      spawning list relations up to date in case there has been a destroyed model,
      so do that now.
     */
    close: function (options) {
      options.force = true;
      if (this.getListRelations()) {
        this.getListRelations().lengthChanged();
      }
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
        * index: the index of the collection to start with (default 0)
        * listRelations The listRelations kind that spawned this child workspace
    */
    setWorkspace: function (options) {
      var menuItems = [],
        prop,
        headerAttrs,
        workspace = options.workspace;

      this.setCollection(options.collection);
      this.setModelIndex(options.index || 0);
      if (!workspace) {
        XT.log("This should never happen");
        return;
      }

      this.destroyWorkspace();
      workspace = this.createComponent({
        name: "workspace",
        container: this.$.contentPanel,
        kind: workspace,
        fit: true
      });
      headerAttrs = workspace.getHeaderAttrs() || [];
      if (headerAttrs.length) {
        this.$.header.show();
      } else {
        this.$.header.hide();
      }
      this.render();

      if (this.getCollection().length === 0) {
        // nothing yet to edit, so create a new model
        var Model = this.getCollection().model;
        var model = new Model(null, {isNew: true});
        this.getCollection().add(model);
      }

      // Keep track of the list relations that launched this child workspace container
      if (options.listRelations) {
        this.setListRelations(options.listRelations);
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
        parent = model ? model.getParent(true) : false,
        that = this;

      this.$.deleteButton.setDisabled(true);
      if (model) {
        this.$.lockImage.setShowing(!parent.hasLockKey());
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
        this.$.prevButton.setDisabled(index === 0);
        this.$.nextButton.setDisabled(index === this.getCollection().length - 1);
      }
    },
    /**
      Like the super function, except that we don't try to update functions
      that don't exist.
     */
    statusChanged: function (inSender, inEvent) {
      var K = XM.Model,
        status = inEvent.status,
        message;

      // Toggle spinner popup
      if (status & K.BUSY) {
        if (status === K.BUSY_COMMITTING) {
          message = "_saving".loc() + "...";
        }
        this.spinnerShow(message);
      } else {
        this.spinnerHide();
      }
    }
  });



}());
