
/**
  The resting state for the table once initializiation is complete.
*/
XT.Ready = XT.State.extend({

  //..............................................
  // Default Properties
  //

  initialSubstate: "SELECTION",

  //..............................................
  // Substates
  //

  "SELECTION":     SC.State.plugin("XT.Selection"),

  //..............................................
  // Actions
  //

  //..............................................
  // Methods
  //

  enterState: function() {},

});
