  enyo.kind({
      name: "XV.WorkspacePanels",
      kind: "FittableRows",
      realtimeFit: true,
      wrap: false,
      classes: "panels enyo-border-box",
      bgcolors: ["red", "green", "blue", "indigo", "violet"],
      components: [
        { kind: "Panels", name: "topPanel", style: "height: 300px;", arrangerKind: "CarouselArranger"},
        { kind: "Panels", fit:true, name: "bottomPanel", arrangerKind: "CarouselArranger"}
      ],
      create: function () {
        this.inherited(arguments);
        for(var iBox = 0; iBox < XV.WorkspacePanelDescriptor.length; iBox++) {
          var boxDesc = XV.WorkspacePanelDescriptor[iBox];
          if(boxDesc.boxType === 'Grid') {

            var box = this.createComponent({
                kind: "onyx.Groupbox",
                container: boxDesc.location === 'top' ? this.$.topPanel : this.$.bottomPanel,
                style: "height: 200px; width: 700px; margin-right: 5px;",
                components: [
                  { kind: "onyx.GroupboxHeader", content: boxDesc.title},
                ]
              });

            var boxContent = this.createComponent({
                kind: "onyx.Groupbox",
                classes: "onyx-toolbar-inline",
                container: box,
                style: "background-color: white;"});

            for(var iField = 0; iField < boxDesc.fields.length; iField++) {
              var fieldDesc = boxDesc.fields[iField];
              var boxColumn = this.createComponent({
                kind: "onyx.Groupbox",
                container: boxContent,
                style: "width: " + fieldDesc.width + "px; "
              });

              this.createComponent({ container: boxColumn, content: fieldDesc.label, style: "width: " + fieldDesc.width + "px;" });
              for(iRow = 0; iRow < 8; iRow++) {
                this.createComponent({
                  kind: "onyx.Input",
                  container: boxColumn,
                  name: fieldDesc.fieldName,
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
            for(var iField = 0; iField < boxDesc.fields.length; iField++) {
              var fieldDesc = boxDesc.fields[iField];
              var field = this.createComponent(
                { kind: "onyx.InputDecorator",
                  style: "",
                  container: box,
                  components: [
                    { tag: "b", content: fieldDesc.label + ": ", style: "padding-right: 10px;"}
                  ]
                }
              );

              if(fieldDesc.fieldType) {
                this.createComponent(
                  { kind: fieldDesc.fieldType,
                    style: "",
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
      },
      addControl: function(inControl) {
          this.inherited(arguments);
          var i = this.indexOfControl(inControl);
          inControl.setContent(i);
      },
      gotoBox: function (name) {
        // fun! we have to find if the box is on the top or bottom,
        // and if so, which index it is
        console.log("going to panel: " + name);

        var topIndex = 0;
        var bottomIndex = 0;
        for(var iBox = 0; iBox < XV.WorkspacePanelDescriptor.length; iBox++) {
          var boxDesc = XV.WorkspacePanelDescriptor[iBox];
          if(boxDesc.title === name && boxDesc.location === 'top') {
            this.$.topPanel.setIndex(topIndex);
            return;
          } else if(boxDesc.title === name && boxDesc.location === 'bottom') {
            this.$.bottomPanel.setIndex(bottomIndex);
            return;
          } else if(boxDesc.location === 'top') {
            topIndex++;
          } else if(boxDesc.location === 'bottom') {
            bottomIndex++;
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
      create: function() {
          this.inherited(arguments);
          this.$.list.setCount(XV.WorkspacePanelDescriptor.length);
      },
      rendered: function() {
          this.inherited(arguments);
          this.$.list.select(0);
      },
      // list
      setupItem: function(inSender, inEvent) {
          this.$.item.setContent(XV.WorkspacePanelDescriptor[inEvent.index].title);
          this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
      },
      itemTap: function(inSender, inEvent) {
          var p = XV.WorkspacePanelDescriptor[inEvent.index];
          this.$.workspacePanels.gotoBox(p.title);
      }
  });
