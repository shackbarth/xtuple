
/**
  The error state for the table to keep it from doing just about
  anything else.
*/
XT.Error = XT.State.extend({

  //..............................................
  // Default Properties
  //

  //..............................................
  // Substates
  //

  //..............................................
  // Actions
  //

  /** @private */
  render: function(context) {
    
    // grab any messages from the stack
    var msgs = this.statechart.get("msgs");

    // iterate over them adding them to the context
    msgs.forEach(function(msg) {
      context.push(
        '<div class="xt-error-message">',
          msg,
        '</div>'
      );
    });
  },

  //..............................................
  // Methods
  //

  enterState: function() { 
    console.log(
      this.msg(
        "%@ entered error state and will not continue to execute".fmt(
          this.get("table"))
      )
    );
  },

});
