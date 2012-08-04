/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.DropdownWidget",
    kind: "enyo.Control",
    events: {
      onValueChange: ""
    },
    published: {
      value: null,
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
      this.$.picker.createComponent({ idValue: "", content: "" });
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
    },
    disabledChange: function (inSender, inEvent) {
      this.addRemoveClass("onyx-disabled", inEvent.originator.disabled);
    },
    itemSelected: function (inSender, inEvent) {
      var value = this.$.picker.getSelected().value;
      this.setValue(value);
    },
    setValue: function (value, options) {
      options = options || {};
      var inEvent = { originator: this, value: value };
      if (this._selectValue(value)) {
        this.value = value;
        if (!options.silent) {
          this.doValueChange(inEvent);
        }
      }
    },
    /** @private */
    _selectValue: function (value) {
      if (!value) { return; }
      var component = _.find(this.$.picker.getComponents(), function (c) {
        return (c.value ? c.value.id : null) === value.id;
      });
      if (component) {
        this.$.picker.setSelected(component);
        return true;
      }
      return false;
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
