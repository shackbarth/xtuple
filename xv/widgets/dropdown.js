/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.DropdownWidget",
    kind: "enyo.Control",
    events: {
      onchange: "",
      onFieldChanged: ""
    },
    published: {
      collection: null,
      disabled: false,
      idAttribute: "id",
      nameAttribute: "name"
    },
    handlers: {
      onSelect: "itemSelected"
    },
    components: [
      {kind: "onyx.PickerDecorator", components: [
        {},
        {name: "picker", kind: "onyx.Picker"}
      ]}
    ],
    collectionChanged: function () {
      var idAttribute = this.getIdAttribute(),
        nameAttribute = this.getNameAttribute(),
        collection = XT.getObjectByName(this.getCollection()),
        i,
        id,
        name,
        callback,
        didStartup = false,
        that = this;
        
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
      this.$.picker.createComponent({ idValue: "", content: "" });
      for (i = 0; i < collection.models.length; i++) {
        id = collection.models[i].get(idAttribute);
        name = collection.models[i].get(nameAttribute);
        this.$.picker.createComponent({ value: id, content: name });
      }
      this.render();
    },
    create: function () {
      this.inherited(arguments);
      if (this.getCollection()) { this.collectionChanged(); }
    },
    disabledChange: function (inSender, inEvent) {
      this.addRemoveClass("onyx-disabled", inEvent.originator.disabled);
    },
    getValue: function () {
      return this.$.picker.getSelected() ? this.$.picker.getSelected().value : undefined;
    },
    itemSelected: function (inSender, inEvent) {
      this.bubble("onchange", inEvent);
      this.doFieldChanged(this, inEvent);
      return true;
    },
    setValue: function (value, options) {
      options = options || {};
      var id = value && value.id ? value.id : value,
        component = _.find(this.$.picker.getComponents(), function (component) {
          return component.value === id;
        });
      if (component) { this.$.picker.setSelected(component); }
      if (!options.silent) { this.doFieldChanged(value); }
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
      collection: "XM.projectStatuses"
    }
  });
  
}());
