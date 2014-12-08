/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XV:true, XM:true, _:true, onyx:true, enyo:true, XT:true */

(function () {

  /**
    @name XV.ChildWorkspace
    @class The ChildWorkspace A child workspace is a workspace plus modelAmnesty
    plus the RelationsEditorMixin, which makes sure that the child workspace
    is bound and unbound from its model

    @extends XV.Workspace
   */
  enyo.kind(enyo.mixin({
    name: "XV.ChildWorkspace",
    kind: "XV.Workspace",
    classes: "xv-child-workspace",
    modelAmnesty: true
  }, XV.RelationsEditorMixin));

  /**
    Set model bindings on a workspace
    @private
    @param{Object} Workspace
    @param{Object} Model
    @param{String} Action: 'on' or 'off'
  */
  var _setHeaderBindings = function (ws, model, action) {
    var headerAttrs = ws.getHeaderAttrs() || [],
      observers = "",
      attr,
      i;

    if (headerAttrs.length) {
      for (i = 0; i < headerAttrs.length; i++) {
        attr = headerAttrs[i];
        if (attr.indexOf(".") !== -1) { attr = attr.prefix(); }
        if (_.contains(model.getAttributeNames(), attr)) {
          observers = observers ? observers + " change:" + attr : "change:" + attr;
        }
      }
      model[action](observers, ws.headerValuesChanged, ws);
    }
  };

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
  enyo.kind(
    /** @lends XV.ChildWorkspaceContainer# */{
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
      {kind: "FittableRows", name: "navigationPanel", classes: "xv-menu-container", components: [
        {kind: "onyx.Toolbar", name: "menuToolbar", components: [
          {kind: "font.TextIcon", name: "backButton",
            content: "_back".loc(), ontap: "close", icon: "chevron-left"},
        ]},
        {name: "loginInfo", classes: "xv-header"},
        {name: "menu", kind: "List", fit: true, touch: true, classes: 'xv-navigator-menu',
           onSetupItem: "setupItem", components: [
          {name: "item", classes: "item enyo-border-box xv-list-item", ontap: "itemTap"}
        ]}
      ]},
      {kind: "FittableRows", name: "contentPanel", classes: 'xv-content-panel', components: [
        {kind: "onyx.MoreToolbar", name: "contentToolbar", components: [
          {kind: "onyx.Grabber", classes: "spacer"},
          {name: "title", classes: "xv-toolbar-label"},
          {name: "space", classes: "spacer", fit: true},
          {kind: "font.TextIcon", name: "lockImage", showing: false,
            content: "Locked", ontap: "lockTapped", icon: "lock", classes: "lock"},
          {kind: "font.TextIcon", name: "backPanelButton",
            content: "_back".loc(), ontap: "close", icon: "chevron-left"},
          {kind: "font.TextIcon", name: "newButton",
            content: "_new".loc(), ontap: "newItem", icon: "plus"},
          {kind: "font.TextIcon", name: "deleteButton", icon: "remove",
            content: "_delete".loc(), ontap: "deleteItem"},
          {kind: "font.TextIcon", name: "prevButton",
            content: "_previous".loc(), ontap: "prevItem", icon: "step-backward"},
          {kind: "font.TextIcon", name: "nextButton",
            content: "_next".loc(), ontap: "nextItem", icon: "step-forward"}//,
        ]},
        {name: "header", classes: "xv-header"},
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
    destroy: function () {
      var workSpace = this.$.workspace,
        model;

      // Handle special bindings for headers
      if (_.isNumber(this.modelIndex)) {
        model = this.getCollection().at(this.modelIndex);
        if (_.isObject(model)) {
          _setHeaderBindings(workSpace, model, "off");
        }
      }
      return this.inherited(arguments);
    },
    /**
      Popup confirmation, Delete the model of the selected item and remove it from the list.
    */
    deleteItem: function () {
      var model = this.getCollection().at(this.getModelIndex()),
        message = "_unsavedChanges".loc() + " " + "_saveYourWork?".loc(),
        callback = function (response) {
          if (response.answer) {
            this.getActive().doPrevious();
            // Waterfall down event - handled by lineItem grid box's valueChange function which "refreshes" the list
            model.on("statusChange", this.waterfall("onChildWorkspaceValueChange"));
            model.destroy();
          }
        };
      this.doNotify({
        type: XM.Model.YES_NO_CANCEL,
        message: "_deleteLine?".loc(),
        callback: callback
      });
    },
    /**
      Add a new model to the collection and bring up a blank editor to fill it in
    */
    newItem: function () {
      var collection = this.getCollection(),
        Klass = collection.model,
        model = new Klass(null, {isNew: true});
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
    setModelIndex: function (index) {
      var workSpace = this.$.workspace,
        model;

      // Handle special bindings for headers
      if (this.modelIndex !== index) {
        model = this.getCollection().at(this.modelIndex);
        if (_.isObject(model)) {
          _setHeaderBindings(workSpace, model, "off");
        }
        model = this.getCollection().at(index);
        _setHeaderBindings(workSpace, model, "on");
      }

      // Forward via normal means
      return this._setProperty("modelIndex", index, "modelIndexChanged");
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
        workspace = options.workspace,
        callback = options.callback;

      this.setCollection(options.collection);
      if (!workspace) {
        XT.log("This should never happen");
        return;
      }

      this.destroyWorkspace();
      workspace = this.createComponent({
        name: "workspace",
        container: this.$.contentPanel,
        kind: workspace,
        fit: true,
        callback: callback
      });

      headerAttrs = workspace.getHeaderAttrs() || [];
      this.setModelIndex(options.index || 0);
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
        this.$.workspace.headerValuesChanged();
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
