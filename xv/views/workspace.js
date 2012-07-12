/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, Backbone:true, enyo:true, XT:true */

(function () {

  enyo.kind({
      name: "XV.WorkspacePanels",
      kind: "FittableRows",
      realtimeFit: true,
      wrap: false,
      classes: "panels enyo-border-box",
      bgcolors: ["red", "green", "blue", "indigo", "violet"],
      published: {
        modelType: ""
      },
      events: {
        onFieldChanged: ""
      },
      components: [
        { kind: "Panels", name: "topPanel", style: "height: 300px;", arrangerKind: "CarouselArranger"},
        { kind: "Panels", fit: true, name: "bottomPanel", arrangerKind: "CarouselArranger"}
      ],
      /**
       * Set the layout of the workspace as soon as we know what the model is.
       * The layout is determined by the XV.WorkspacePanelDescriptor variable
       * in XT/foundation.js. This function is very much a work in progress. It
       * will have to accommodate every kind of input type.
       *
       */
      modelTypeChanged: function () {
        var box, boxRow, iField, iRow, fieldDesc, field, label;
        for (var iBox = 0; iBox < XV.WorkspacePanelDescriptor[this.modelType].length; iBox++) {
          var boxDesc = XV.WorkspacePanelDescriptor[this.modelType][iBox];
          if (boxDesc.boxType) {
            /**
             * Grids are a special case that must be rendered per their own logic.
             * All one-to-many relationships will be rendered as a grid (?)
             */
            box = this.createComponent({
                kind: boxDesc.boxType,
                container: boxDesc.location === 'top' ? this.$.topPanel : this.$.bottomPanel,
                name: boxDesc.title
              });
            box.setDescriptor(boxDesc);
            box.renderWidget();

          } else {
            /**
             * General case: this box is not a grid, it's just a list of labeled fields
             */
            box = this.createComponent({
                kind: "onyx.Groupbox",
                container: boxDesc.location === 'top' ? this.$.topPanel : this.$.bottomPanel,
                style: "height: 250px; width: 400px; background-color: AntiqueWhite; margin-right: 5px;",
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
                  { tag: "b", content: label.loc() + ": ", style: "padding-right: 10px;"}
                ]
              });

              this.createComponent({
                kind: fieldDesc.fieldType ? fieldDesc.fieldType : "onyx.Input",
                style: "",
                name: fieldDesc.fieldName,
                container: field,
                onchange: "doFieldChanged"
              });
            }
          }
        }
        this.render();
      },
      addControl: function (inControl) {
        this.inherited(arguments);
        var i = this.indexOfControl(inControl);
        inControl.setContent(i);
      },
      /**
       * Scrolls the display to the requested box.
       * @Param {String} name The title of the box to scroll to
       */
      gotoBox: function (name) {
        // fun! we have to find if the box is on the top or bottom,
        // and if so, which index it is. Once we know if it's in the
        // top or the bottom, and which index, it's easy to jump there.

        var topIndex = 0;
        var bottomIndex = 0;
        for (var iBox = 0; iBox < XV.WorkspacePanelDescriptor[this.modelType].length; iBox++) {
          var boxDesc = XV.WorkspacePanelDescriptor[this.modelType][iBox];
          if (boxDesc.title === name && boxDesc.location === 'top') {
            this.$.topPanel.setIndex(topIndex);
            return;
          } else if (boxDesc.title === name && boxDesc.location === 'bottom') {
            this.$.bottomPanel.setIndex(bottomIndex);
            return;
          } else if (boxDesc.location === 'top') {
            topIndex++;
          } else if (boxDesc.location === 'bottom') {
            bottomIndex++;
          }
        }
      },
      updateFields: function (model) {
        // TODO: this is more of a reset-all than an update


        // XXX this gets called for all the relational subobjects
        // as well and we don't really want to deal with those
        // because we've already dealt with them under the master
        // model.
        if (model.get("type") !== this.getModelType()) {
          return;
        }
        XT.log("update with model: " + model.get("type"));



        //
        // Look through the entire specification...
        //
        for (var iBox = 0; iBox < XV.WorkspacePanelDescriptor[this.modelType].length; iBox++) {
          var boxDesc = XV.WorkspacePanelDescriptor[this.modelType][iBox];
          for (var iField = 0; iField < boxDesc.fields.length; iField++) {
            var fieldDesc = boxDesc.fields[iField];
            var fieldName = boxDesc.fields[iField].fieldName;
            if (fieldName) {
              /**
               * Update the view field with the model value
               */
              if (boxDesc.boxType === 'GridWidget') {
                /**
                 * Don't send just the field over. Send the whole model over
                 */
                this.$[boxDesc.title].setValue(model.getValue(boxDesc.title.toLowerCase()));
                // TODO: toLowerCase is a hackish way to navigate case sensitivity here
              } else {
                /**
                 * Default case: populate the field
                 */
                this.$[fieldName].setValue(model.getValue(fieldName));
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
        modelType: "Project", // TODO: this has to be the empty string
        // TODO: wait to load the menu items until we know the model type for real
        model: null
      },
      handlers: {
        onFieldChanged: "doFieldChanged"
      },
      components: [

        {kind: "FittableRows", classes: "left", components: [
          {kind: "onyx.Toolbar", components: [
            {content: "Project"}
          ]},
          {kind: "List", fit: true, touch: true, onSetupItem: "setupItem", components: [
            {name: "item", classes: "item enyo-border-box", ontap: "itemTap"}
          ]}
        ]},
        {kind: "FittableRows", components: [
          {kind: "onyx.Toolbar", components: [
            {content: "Project"},
            { kind: "onyx.Button", content: "Save Changes" }
          ]},
          {kind: "XV.WorkspacePanels", name: "workspacePanels", fit: true}
        ]}
      ],
      create: function () {
        this.inherited(arguments);
        this.$.list.setCount(XV.WorkspacePanelDescriptor[this.getModelType()].length);
      },
      rendered: function () {
        this.inherited(arguments);
        this.$.list.select(0);
      },
      doFieldChanged: function (inEvent, inSender) {
        var prefix, suffix;

        XT.log("field changed");
        //var fieldName = inSender.name;
        var newValue = inSender.getValue();

        var updateObject = {};
        updateObject[inSender.name] = newValue;
        this.getModel().set(updateObject);

        //
        // persist immediately
        // XXX this is an important design decision TBD
        //
        this.getModel().save();
      },
      // list
      setupItem: function (inSender, inEvent) {
        this.$.item.setContent(XV.WorkspacePanelDescriptor[this.getModelType()][inEvent.index].title);
        this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
      },
      itemTap: function (inSender, inEvent) {
        var p = XV.WorkspacePanelDescriptor[this.getModelType()][inEvent.index];
        this.$.workspacePanels.gotoBox(p.title);
      },
      setOptions: function (model) {
        //
        // Determine the model that will back this view
        //
        var modelType = model.get("type");
        // Magic/convention: trip off the word Info to get the heavyweight class
        if (modelType.substring(modelType.length - 4) === "Info") {
          modelType = modelType.substring(0, modelType.length - 4);
        }
        var id = model.get("guid");

        //
        // Setting the model type also renders the workspace. We really can't do
        // that until we know the model type.
        //
        this.$.workspacePanels.setModelType(modelType);

        //console.log("Workspace is fetching " + modelType + " " + id);

        //
        // Set up a listener for changes in the model
        //
        var Klass = Backbone.Relational.store.getObjectByName("XM." + modelType);
        var m = new Klass();
        this.setModel(m);
        m.on("change", enyo.bind(this, "modelDidChange"));


        //
        // Fetch the model
        //
        m.fetch({id: id});
        XT.log("Workspace is fetching " + modelType + " " + id);


      },
      modelDidChange: function (model, value, options) {
        XT.log("Model changed: " + JSON.stringify(model.toJSON()));
        this.$.workspacePanels.updateFields(model);
      }

    });
}());
