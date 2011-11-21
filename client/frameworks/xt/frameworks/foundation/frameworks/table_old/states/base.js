
sc_require("mixins/helpers");

/**
  Slightly overloaded for convenience and a layer of abstraction
  for future modification as the need arrises.
*/
XT.State = SC.State.extend(
  XT.Helpers, {

  /**
    Once the table has been set, try to set it on any known substates.
    In turn they should also propagate this downward.
  */
  initStateTable: function() {
  
    // grab the array of substates from this state
    var states = this.substates, self = this;

    // iterate over them and add the reference to the owner/table
    states.forEach(function(state) { state.set("table", self.get("table")); });

  }.observes("table"),

  /**
    Overload this to achieve other routine setup actions.
  */
  initState: function() {

    // make sure to do all the normal stuff
    sc_super();

    // try to see if we have a table set (top of initialization chain)
    if(this.get("table"))

      // then go ahead and start the downward chain by calling the
      // initStateTable method
      this.initStateTable();
  },

});
