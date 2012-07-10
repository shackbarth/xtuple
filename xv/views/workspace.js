/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, enyo:true*/

(function () {

  var XV = XV || {};
  XV.WorkspacePanelDescriptor = {
    Project: // the key is uppercase because the model name is uppercase
      [{
        title: "Project Info",
        location: "top",
        fields: [
          { label: "Number", fieldName: "number", placeholder: "Enter project number" },
          { label: "Name", fieldName: "name", placeholder: "Enter project name" },
          { label: "Notes", fieldName: "notes", placeholder: "Enter project notes" }
        ]
      },
      {
        title: "Schedule",
        location: "top",
        fields: [
          { label: "Owner", fieldName: "owner.propername", placeholder: "This will have to be a dropdown" },
          { label: "Assigned To", fieldName: "assignedTo.propername", placeholder: "This will have to be a dropdown" },
          { label: "Due", fieldName: "dueDate", fieldType: "DateWidget" }
        ]
      },
      //{
        //title: "Billing",
        //location: "top",
        //fields: [
        //  { label: "Customer", fieldName: "projectCustomer", placeholder: "The customer to be billed" },
        //  { label: "Rate", fieldName: "projectRate", placeholder: "Enter project rate" },
        //]
      //},
      {
        title: "Tasks",
        location: "bottom",
        boxType: "Grid",
        fields: [
          { label: "Number", fieldName: "tasks.number", width: "100" },
          { label: "Name", fieldName: "tasks.name", width: "100" },
          { label: "Notes", fieldName: "tasks.notes", width: "120" },
          { label: "Actual Hours", fieldName: "tasks.actualHours", width: "120" },
          { label: "Actual Expenses", fieldName: "tasks.actualExpenses", width: "120" }
        ]
      }/*,
      {
        title: "Comments",
        location: "bottom",
        boxType: "Grid",
        fields: [
          { label: "Date", width: "120" },
          { label: "Type", width: "80" },
          { label: "User", width: "80" },
          { label: "Comment", width: "300" }
        ]
      }*/
    ]
  };


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
      components: [
        { kind: "Panels", name: "topPanel", style: "height: 300px;", arrangerKind: "CarouselArranger"},
        { kind: "Panels", fit: true, name: "bottomPanel", arrangerKind: "CarouselArranger"}
      ],
      modelTypeChanged: function () {
        for (var iBox = 0; iBox < XV.WorkspacePanelDescriptor[this.modelType].length; iBox++) {
          var boxDesc = XV.WorkspacePanelDescriptor[this.modelType][iBox];
          if (boxDesc.boxType === 'Grid') {

            var box = this.createComponent({
                kind: "onyx.Groupbox",
                container: boxDesc.location === 'top' ? this.$.topPanel : this.$.bottomPanel,
                style: "height: 200px; width: 700px; margin-right: 5px; font-size: 12px;",
                components: [
                  { kind: "onyx.GroupboxHeader", content: boxDesc.title }
                ]
              });

            var boxContent = this.createComponent({
                kind: "onyx.Groupbox",
                classes: "onyx-toolbar-inline",
                container: box,
                style: "background-color: white;"
              });

            for (var iField = 0; iField < boxDesc.fields.length; iField++) {
              var fieldDesc = boxDesc.fields[iField];
              var boxColumn = this.createComponent({
                kind: "onyx.Groupbox",
                container: boxContent,
                style: "width: " + fieldDesc.width + "px; "
              });

              this.createComponent({ container: boxColumn, content: fieldDesc.label, style: "width: " + fieldDesc.width + "px;" });
              for (var iRow = 0; iRow < 8; iRow++) {
                this.createComponent({
                  kind: "onyx.Input",
                  container: boxColumn,
                  name: fieldDesc.fieldName + "_" + iRow,
                  placeholder: fieldDesc.label,
                  style: "width: " + fieldDesc.width + "px; "
                });

              }
            }

          } else {

            var box = this.createComponent({
                kind: "onyx.Groupbox",
                container: boxDesc.location === 'top' ? this.$.topPanel : this.$.bottomPanel,
                style: "height: 250px; width: 400px; background-color: AntiqueWhite; margin-right: 5px;",
                components: [
                  {kind: "onyx.GroupboxHeader", content: boxDesc.title}
                ]
              });
            for (var iField = 0; iField < boxDesc.fields.length; iField++) {
              var fieldDesc = boxDesc.fields[iField];
              var field = this.createComponent({
                kind: "onyx.InputDecorator",
                style: "font-size: 12px",
                container: box,
                components: [
                  { tag: "b", content: fieldDesc.label + ": ", style: "padding-right: 10px;"}
                ]
              });

              if (fieldDesc.fieldType) {
                this.createComponent(
                  { kind: fieldDesc.fieldType,
                    style: "",
                    name: fieldDesc.fieldName,
                    container: field
                  }
                );
              } else {
                this.createComponent(
                  {
                    kind: "onyx.Input",
                    style: "",
                    container: field,
                    name: fieldDesc.fieldName,
                    placeholder: fieldDesc.placeholder
                  }
                );
              }
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
      gotoBox: function (name) {
        // fun! we have to find if the box is on the top or bottom,
        // and if so, which index it is

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

        //
        // Look through the entire specification...
        //
        for (var iBox = 0; iBox < XV.WorkspacePanelDescriptor[this.modelType].length; iBox++) {
          var boxDesc = XV.WorkspacePanelDescriptor[this.modelType][iBox];
          for (var iField = 0; iField < boxDesc.fields.length; iField++) {
            var fieldDesc = boxDesc.fields[iField];
            var fieldName = boxDesc.fields[iField].fieldName;
            if(fieldName) {
              console.log("field is " + fieldName);

              //
              // Find the corresponding field in the model
              //
              var applicableModel = model;
              var fieldNameDetail = fieldName;
              while(fieldNameDetail.indexOf('\.') >= 0) {
                var prefix = fieldNameDetail.substring(0, fieldNameDetail.indexOf('\.'));
                var suffix = fieldNameDetail.substring(fieldNameDetail.indexOf('\.') + 1);
                applicableModel = applicableModel.get(prefix);
                fieldNameDetail = suffix;
              }

              if(applicableModel && applicableModel.length) {
                // this is a collection. Fill in the grid.
                for(var iList = 0; iList < applicableModel.length; iList++) {
                  this.$[fieldName + "_" + iList].setValue(applicableModel.models[iList].get(fieldNameDetail));
                }


              } else if(applicableModel && applicableModel.get(fieldNameDetail)) {
                //
                // Update the view field with the model value
                //
                //console.log("value is " + applicableModel.get(fieldNameDetail));
                this.$[fieldName].setValue(applicableModel.get(fieldNameDetail));
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
      // list
      setupItem: function (inSender, inEvent) {
        this.$.item.setContent(XV.WorkspacePanelDescriptor[this.getModelType()][inEvent.index].title);
        this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
      },
      itemTap: function (inSender, inEvent) {
        var p = XV.WorkspacePanelDescriptor[this.getModelType()][inEvent.index];
        this.$.workspacePanels.gotoBox(p.title);
      },
      setOptions: function (options) {
        //
        // Determine the model that will back this view
        //
        var modelType = options.get("type");
        // Magic/convention: trip off the word Info to get the heavyweight class
        if(modelType.substring(modelType.length - 4) === "Info") {
          modelType = modelType.substring(0, modelType.length - 4);
        }
        var id = options.get("guid");

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
        m.on("change", enyo.bind(this, "modelDidChange"));


        //
        // Fetch the model
        //
        m.fetch({id: id});
        console.log("Workspace is fetching " + modelType + " " + id);


      },
      modelDidChange: function (model, value, options) {
        //console.log("Model changed: " + JSON.stringify(model.toJSON()));
        this.$.workspacePanels.updateFields(model);
      }

    });
}());
