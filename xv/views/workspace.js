/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, Backbone:true, enyo:true, XT:true */

(function () {

  /**
   * Manages the main content pane of the workspace. This is implemented
   * as two panels (top and bottom). The code in this kind is general-purpose
   * across all possible workspaces, and so it takes its cues from a JSON
   * descriptor object called XT.WorkspacePanelDescriptor.
   */
  enyo.kind({
      name: "XV.WorkspacePanels",
      kind: "FittableRows",
      realtimeFit: true,
      wrap: false,
      classes: "panels enyo-border-box",
      published: {
        modelType: ""
      },
      events: {
        onValueChanged: ""
      },
      components: [
        { kind: "Panels", name: "topPanel", style: "height: 300px;", arrangerKind: "CarouselArranger"},
        { kind: "Panels", fit: true, name: "bottomPanel", arrangerKind: "CarouselArranger"}
      ],
      /**
       * Set the layout of the workspace.
       * The layout is determined by the XV.util.getWorkspacePanelDescriptor() variable
       * in xv/xv.js.
       *
       */
      updateLayout: function () {
        var box,
          iField,
          fieldDesc,
          field,
          label;
        for (var iBox = 0; iBox < XV.util.getWorkspacePanelDescriptor()[this.modelType].length; iBox++) {
          var boxDesc = XV.util.getWorkspacePanelDescriptor()[this.modelType][iBox];
          if (boxDesc.kind) {
            /**
             * Grids are a special case that must be rendered per their own logic.
             * All one-to-many relationships will be rendered as a grid (?)
             */
            box = this.createComponent({
                kind: boxDesc.kind || "XV.InputWidget",
                container: boxDesc.location === 'bottom' ? this.$.bottomPanel : this.$.topPanel,
                name: boxDesc.title
              });
            if (boxDesc.customization) {
              box.setCustomization(boxDesc.customization);
            }
            box.setDescriptor(boxDesc);

          } else {
            /**
             * General case: this box is not a grid, it's just a list of labeled fields
             */
            box = this.createComponent({
                kind: "onyx.Groupbox",
                container: boxDesc.location === 'bottom' ? this.$.bottomPanel : this.$.topPanel,
                style: "min-height: 250px; width: 400px; background-color: white; margin-right: 5px;",
                components: [
                  {kind: "onyx.GroupboxHeader", content: boxDesc.title}
                ]
              });

            for (iField = 0; iField < boxDesc.fields.length; iField++) {
              fieldDesc = boxDesc.fields[iField];

              label = fieldDesc.label ? "_" + fieldDesc.label : "_" + fieldDesc.fieldName;
              field = this.createComponent({
                kind: "onyx.InputDecorator",
                style: "font-size: 12px",
                container: box,
                components: [
                /**
                 * This is the label
                 */
                  { tag: "span", content: label.loc() + ": ", style: "padding-right: 10px;"}
                ]
              });

              var widget = this.createComponent({
                kind: fieldDesc.kind || "XV.InputWidget",
                style: "border: 0px; ",
                name: fieldDesc.fieldName,
                container: field
              });

              /**
               * Used only for DropdownWidgets at the moment. If the descriptor mentions a model
               * type we want to send that down to the widget
               */
              if (fieldDesc.collection) {
                widget.setCollection(fieldDesc.collection);
              }
            }
          }
        }
        this.render();
      },
      /**
       * Scrolls the display to the requested box.
       * @Param {String} name The title of the box to scroll to
       */
      gotoBox: function (name) {
        // fun! we have to find if the box is on the top or bottom,
        // and if so, which index it is. Once we know if it's in the
        // top or the bottom, and which index, it's easy to jump there.
        var topIndex = 0,
          bottomIndex = 0,
          iBox;
        for (iBox = 0; iBox < XV.util.getWorkspacePanelDescriptor()[this.modelType].length; iBox++) {
          var boxDesc = XV.util.getWorkspacePanelDescriptor()[this.modelType][iBox];

          // Note that if the box location defaults to top if it's left empty in the descriptor
          if (boxDesc.title === name && boxDesc.location === 'bottom') {
            this.$.bottomPanel.setIndex(bottomIndex);
            return;
          } else if (boxDesc.title === name) {
            this.$.topPanel.setIndex(topIndex);
            return;
          } else if (boxDesc.location === 'bottom') {
            bottomIndex++;
          } else {
            topIndex++;
          }
        }
      },
      /**
       * Populates the fields of the workspace with the values from the model
       */
      updateFields: function (model) {
        var that = this,
          iBox,
          iField,
          fieldDesc,
          fieldName,
          fieldValue;
        /**
         * Fields that are computed asynchronously by the model may not be
         * accurate right now, so we have those fields trigger an event when
         * they are set, which we listed for here
         */
        model.on("announcedSet", function (announcedField, announcedValue) {
          that.$[announcedField].setValue(announcedValue);
        });

        XT.log("update with model: " + model.get("type"));

        //
        // Look through the entire specification...
        //
        for (iBox = 0; iBox < XV.util.getWorkspacePanelDescriptor()[this.modelType].length; iBox++) {
          var boxDesc = XV.util.getWorkspacePanelDescriptor()[this.modelType][iBox];

          if (boxDesc.kind) {
            /**
             * Don't send just the field over. Send the whole collection over
             */
            this.$[boxDesc.title].setValue(model.getValue(boxDesc.objectName));
          } else {
            /**
             * Default case: populate the fields
             */

            for (iField = 0; iField < boxDesc.fields.length; iField++) {
              fieldDesc = boxDesc.fields[iField];
              fieldName = boxDesc.fields[iField].fieldName;
              // argh! 0 is falsy but we want to populate 0 into fields if appropriate
              fieldValue = model.getValue(fieldName) || model.getValue(fieldName) === 0 ? model.getValue(fieldName) : "";
              if (fieldName) {
                /**
                 * Update the view field with the model value
                 */
                this.$[fieldName].setValue(fieldValue, {silent: true});
              }
            }
          }
        }
      }
    });

  enyo.kind({
      name: "XV.Workspace",
      kind: "Panels",
      classes: "app enyo-unselectable",
      realtimeFit: true,
      arrangerKind: "CollapsingArranger",
      published: {
        modelType: "",
        model: null
      },
      events: {
        onHistoryChanged: "",
        onModelSave: ""
      },
      handlers: {
        onValueChange: "valueChanged",
        onSubmodelUpdate: "doEnableSaveButton"
      },
      components: [
        {kind: "FittableRows", classes: "left", components: [
          {kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
            {name: "workspaceHeader" },
            {kind: "onyx.MenuDecorator", components: [
              {content: "_navigation".loc() },
              {kind: "onyx.Tooltip", content: "Tap to open..."},
              {kind: "onyx.Menu", name: "navigationMenu", components: [
                { content: "Dashboard" },
                { content: "CRM" },
                { content: "Setup" }
              ], ontap: "navigationSelected" }
            ]}
          ]},
          {
            kind: "Repeater",
            fit: true,
            touch: true,
            onSetupItem: "setupItem",
            name: "menuItems",
            components: [
              { name: "item", classes: "item enyo-border-box", ontap: "itemTap"}
            ]
          }
        ]},
        {kind: "FittableRows", components: [
          {kind: "onyx.Toolbar", components: [
            {content: ""},
            {
              kind: "onyx.Button",
              name: "saveButton",
              disabled: true,
              content: "_save".loc(),
              classes: "onyx-affirmative",
              onclick: "save"
            }
          ]},
          {kind: "XV.WorkspacePanels", name: "workspacePanels", fit: true},
          {
            name: "exitWarningPopup",
            classes: "onyx-sample-popup",
            kind: "onyx.Popup",
            centered: true,
            modal: true,
            floating: true,
            onShow: "popupShown",
            onHide: "popupHidden",
            components: [
              { content: "You have unsaved changes. Are you sure you want to leave?" },
              { tag: "br"},
              { kind: "onyx.Button", content: "Leave without saving", ontap: "forceExit" },
              { kind: "onyx.Button", content: "Save and leave", ontap: "saveAndLeave" },
              { kind: "onyx.Button", content: "Don't leave", ontap: "closeExitWarningPopup" }
            ]
          }
        ]}
      ],
      _exitDestination: null,
      /**
        Used by all of the various functions that want to signal an exit
        from this workspace
      */
      bubbleExit: function (destination) {
        this.bubble(destination, {eventName: destination});
      },
      closeExitWarningPopup: function () {
        this.$.exitWarningPopup.hide();
      },
      enableSaveButton: function () {
        this.$.saveButton.setDisabled(false);
      },
      forceExit: function () {
        this.closeExitWarningPopup();
        this.bubbleExit(this._exitDestination);
      },
      itemTap: function (inSender, inEvent) {
        var p = XV.util.getWorkspacePanelDescriptor()[this.getModelType()][inEvent.index];
        this.$.workspacePanels.gotoBox(p.title);
      },
      /**
        Essentially the callback function from backbone
      */
      modelDidChange: function (model, value, options) {
        if (model.status !== XM.Model.READY_CLEAN &&
            model.status !== XM.Model.READY_NEW) {
          return;
        }
        XT.log("Loading model into workspace: " + JSON.stringify(model.toJSON()));

        // Put the model in the history array
        XT.addToHistory("crm", model); // TODO: generalize for any module
        this.doHistoryChanged();

        // Pass this model onto the panels to update
        this.$.workspacePanels.updateFields(model);
      },
      /**
       * The user has selected a place to go from the navigation menu. Take
       * him there.
       */
      navigationSelected: function (inSender, inEvent) {
        var destination = inEvent.originator.content.toLowerCase(),
          model = this.getModel(),
          status = model.getStatus(),
          K = model.getClass();
        
        // Check for unsaved changes
        if (status & K.DIRTY) {
          this.$.exitWarningPopup.show();
          this._exitDestination = destination;
          return;
        }
        this.bubbleExit(destination);
      },
      /**
       * Save the model (with whatever changes have been made) to the datastore.
       */
      save: function () {
        this.getModel().save();
        this.$.saveButton.setDisabled(true);

        // Update the info object in the summary views
        var id = this.getModel().get("id");
        var recordType = this.getModel().recordType;

        // XXX just refreshing the model in backbone doesn't seem to work
        //var infoType = XV.util.stripModelNamePrefix(recordType) + 'Info';
        //var infoModel = new XM[infoType]();
        //infoModel.fetch({ id: id });

        enyo.Signals.send("onModelSave", { id: id, recordType: recordType });
      },
      saveAndLeave: function () {
        this.closeExitWarningPopup();
        this.save();
        this.bubbleExit(this._exitDestination);
      },
      // list
      setupItem: function (inSender, inEvent) {
        var title = XV.util.getWorkspacePanelDescriptor()[this.getModelType()][inEvent.index].title;
        inEvent.item.children[0].setContent(title);
        return true;
      },
      /**
       * Accepts the object that tells the workspace what to drill down into.
       * SetOptions is quite generic, because it can be called in a very generic
       * way from the main carousel event handler. Note also that the model parameter
       * doesn't need to be a complete model. It just has to have the appropriate
       * type and id properties
       */
      setOptions: function (model) {
        var modelType,
          Klass,
          id,
          m;
        // Delete all boxes before we try to render anything else
        this.wipe();

        // Determine the model that will back this view
        modelType = XV.util.infoToMasterModelName(model.recordType);

        // Setting the model type also renders the workspace. We really can't do
        // that until we know the model type.
        this.setModelType(modelType);
        var modelTypeDisplay = XV.util.stripModelNamePrefix(modelType).camelize();
        this.$.workspaceHeader.setContent(("_" + modelTypeDisplay).loc());
        this.setWorkspaceList();
        this.$.menuItems.render();

        this.$.workspacePanels.setModelType(modelType);
        this.$.workspacePanels.updateLayout();
        // force a refresh of the structure of the workspace even if the
        // model type hasn't really changed. This is to solve a bug whereby
        // the events weren't firing if you drilled down a second time

        // Set up a listener for changes in the model
        Klass = Backbone.Relational.store.getObjectByName(modelType);

        // Fetch the model
        id = model.id;
        m = new Klass();
        this.setModel(m);
        m.on("statusChange", enyo.bind(this, "modelDidChange"));
        if (id) {
          // id exists: pull pre-existing record for edit
          m.fetch({id: id});
          XT.log("Workspace is fetching " + modelType + " " + id);
        } else {
          // no id: this is a new record
          m.initialize(null, { isNew: true });
          XT.log("Workspace is fetching new " + modelType);
        }

      },
      setWorkspaceList: function () {
        var menuItems = XV.util.getWorkspacePanelDescriptor()[this.getModelType()];
        this.$.menuItems.setCount(menuItems.length);
      },
      /**
       * Update the model from changes to the UI. The interaction is handled here
       * and not in the widgets, which themselves are unaware of the model.
       * Exception: GridWidgets manage their own model, so those updates are not
       * performed here. The parameters coming in here are different if the sender
       * is an Input or a picker or a relational widget, so we have to be careful
       * when we parse out the appropriate values.
       * FIXME: If you click the persist button before a changed field is blurred,
       * then the change will not be persisted, as this function might not
       * be executed before the persist method. The way we disable the save button
       * until this function has successfully executed will help with this, but it's
       * not foolproof: let's say a user changes one field (which enables the save
       * button) and then changes a second but persists before blurring the second.
       */
      valueChanged: function (inSender, inEvent) {
        var value = inEvent.value,
          attributes = {},
          model = this.getModel();
        if (model) {
          attributes[inEvent.originator.name] = value;
          model.set(attributes);
          this.enableSaveButton();
        }
      },
      /**
       * Cleans out all the elements from a workspace.
       * FIXME this looks to work via the command line but not onscreen
       */
      wipe: function () {
        XV.util.removeAll(this.$.workspacePanels.$.topPanel);
        this.$.workspacePanels.$.topPanel.refresh();
        XV.util.removeAll(this.$.workspacePanels.$.bottomPanel);
        this.$.workspacePanels.$.bottomPanel.refresh();
      }
      
    });
    
}());
