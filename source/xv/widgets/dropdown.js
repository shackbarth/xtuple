/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XM:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.DropdownWidget",
    kind: "enyo.Control",
    classes: "xv-dropdownwidget",
    events: {
      onValueChange: ""
    },
    published: {
      label: "",
      value: null,
      collection: null,
      disabled: false,
      idAttribute: "id",
      nameAttribute: "name",
      valueAttribute: null
    },
    handlers: {
      onSelect: "itemSelected"
    },
    components: [
      {kind: "onyx.InputDecorator", classes: "xv-input-decorator",
        components: [
        {name: "label", content: "", classes: "xv-label"},
        {kind: "onyx.PickerDecorator",
          components: [
          {content: "_none".loc(), classes: "xv-picker"},
          {name: "picker", kind: "onyx.Picker"}
        ]}
      ]}
    ],
    collectionChanged: function () {
      var nameAttribute = this.getNameAttribute(),
        collection = XT.getObjectByName(this.getCollection()),
        i,
        name,
        callback,
        didStartup = false,
        that = this,
        model;
        
      // If we don't have data yet, try again after start up tasks complete
      if (!collection) {
        if (didStartup) {
          XT.log('Could not find collection ' + this.getCollection());
          return;
        }
        callback = function () {
          didStartup = true;
          that.collectionChanged();
        };
        XT.getStartupManager().registerCallback(callback);
        return;
      }
      
      // Get set up
      this.$.picker.createComponent({
        value: null,
        content: "_none".loc()
      });
      for (i = 0; i < collection.models.length; i++) {
        model = collection.models[i];
        name = model.get(nameAttribute);
        this.$.picker.createComponent({ value: model, content: name });
      }
      this.render();
    },
    create: function () {
      this.inherited(arguments);
      if (this.getCollection()) { this.collectionChanged(); }
      this.labelChanged();
    },
    disabledChange: function (inSender, inEvent) {
      this.addRemoveClass("onyx-disabled", inEvent.originator.disabled);
    },
    itemSelected: function (inSender, inEvent) {
      var value = this.$.picker.getSelected().value,
        attribute = this.getValueAttribute();
      this.setValue(attribute ? value[attribute] : value);
    },
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.name).loc()) + ":";
      this.$.label.setContent(label);
    },
    setValue: function (value, options) {
      options = options || {};
      var inEvent,
        oldValue = this.getValue();
      if (value !== oldValue) {
        if (!this._selectValue(value)) { value = null; }
        if (value !== oldValue) {
          this.value = value;
          if (!options.silent) {
            inEvent = { originator: this, value: value };
            this.doValueChange(inEvent);
          }
        }
      }
    },
    /** @private */
    _selectValue: function (value) {
      value = (!value || this.getValueAttribute()) ? value : value.id;
      var component = _.find(this.$.picker.getComponents(), function (c) {
        if (c.kind === "onyx.MenuItem") {
          return (c.value ? c.value.id : null) === value;
        }
      });
      if (!component) { value = null; }
      this.$.picker.setSelected(component);
      return value;
    }
  });

  // ..........................................................
  // ACCOUNT TYPE
  //
  
  enyo.kind({
    name: "XV.AccountTypeDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.accountTypes"
    }
  });

  // ..........................................................
  // COMMENT TYPE
  //
  
  enyo.kind({
    name: "XV.CommentTypeDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.commentTypes"
    }
  });
  
  // ..........................................................
  // INCIDENT CATEGORY
  //
  
  enyo.kind({
    name: "XV.IncidentCategoryDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.incidentCategories"
    }
  });
  
  // ..........................................................
  // INCIDENT RESOLUTION
  //
  
  enyo.kind({
    name: "XV.IncidentResolutionDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.incidentResolutions"
    }
  });
  
  // ..........................................................
  // INCIDENT SEVERITY
  //
  
  enyo.kind({
    name: "XV.IncidentSeverityDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.incidentSeverities"
    }
  });

  // ..........................................................
  // OPPORTUNITY SOURCE
  //
  
  enyo.kind({
    name: "XV.OpportunitySourceDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.opportunitySources"
    }
  });
  
  // ..........................................................
  // OPPORTUNITY STAGE
  //
  
  enyo.kind({
    name: "XV.OpportunityStageDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.opportunityStages"
    }
  });
  
  // ..........................................................
  // OPPORTUNITY TYPE
  //
  
  enyo.kind({
    name: "XV.OpportunityTypeDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.opportunityTypes"
    }
  });
  
  // ..........................................................
  // PRIORITY
  //
  
  enyo.kind({
    name: "XV.PriorityDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.priorities"
    }
  });
  
  // ..........................................................
  // PROJECT STATUS
  //
  
  enyo.kind({
    name: "XV.ProjectStatusDropdown",
    kind: "XV.DropdownWidget",
    published: {
      collection: "XM.projectStatuses",
      valueAttribute: "id"
    }
  });
  
}());
