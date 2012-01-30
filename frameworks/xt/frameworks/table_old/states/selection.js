
/**
  
*/
XT.Selection = XT.State.extend({

  //..............................................
  // Default Properties
  //

  initialSubstate: "SELECTIONDISABLED",

  //..............................................
  // Substates
  //

  "SELECTIONENABLED": SC.State.extend({
    

    // THIS SHOULD BE BROKEN DOWN EVEN FURTHER TO REMAIN
    // CONSISTENT - AS IN - SUBSTATES THAT REFLECT SELECTION TYPES

    select: function(storeKey) {

      // grab the controller
      // var controller = this.getPath("table.tableController");
      var controller = this.get("table");

      // find the record for the store key using the controller method
      var record = controller.recordFromStoreKey(storeKey);

      // grab the current selection
      var selection = controller.get("selection");

      if(controller.allowsMultipleCollection === YES) {

        record.set("isSelected", YES);

        controller.selectObject(record, YES);

      } else {

        record.set("isSelected", YES);

        // try to select it
        controller.selectObject(record);

      }

      // we handled this event
      return YES;
    },

    rowsUpdated: function() {

      // this was fired for asynchronous execution
      // go ahead and start up the table-delegates
      // rowsUpdated method
      this.get("table").rowsUpdated();
    },
  }),

  "SELECTIONDISABLED": SC.State.extend({

    select: function() { return YES; },
    rowsUpdated: function() { return YES; },

  }),

  //..............................................
  // Actions
  //

  //..............................................
  // Methods
  //

  enterState: function() {
    // var controller = this.getPath("table.tableController");
    var controller = this.get("table");
    if(controller.allowsSelection === YES) {
      this.gotoState("SELECTIONENABLED", this);
    } else { this.gotoState("SELECTIONDISABLED", this); }
  },

});

