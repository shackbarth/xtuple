
/*globals XT */

/** @namespace

*/
XT.PostbooksStatechart = SC.Statechart.create(
  /** @scope XT.PostbooksStatechart.prototype */ {

  autoInitStatechart: NO,
  trace: YES,
  rootState: SC.State.extend({

    initialSubstate: "INITIALIZING",

    "INITIALIZING": XT.TaskState.extend({
      tasks: [
        { target: "XT.Session",
          method: "start",
          complete: YES },
        { target: "XT.Router",
          method: "start",
          complete: YES }
      ],
      complete: "READY",
      fail: "ERROR"

    }),
    ERROR: SC.State.extend({

    }),
    // INITIALIZING: SC.State.extend({
    //   enterState: function() {

    //     // essentially triggering an event tree to
    //     // execute once the state transition is complete
    //     return SC.Async.perform("startup");
    //   },
    //   startup: function() {

    //     // now that we are queued to execute, block until
    //     // the state transition is complete so it
    //     // can properly respond
    //     this.statechart.resumeGotoState();
    //     while(XT.DEFAULT_STARTUP.length > 0) {
    //       var next = XT.DEFAULT_STARTUP.shift();
    //       next = SC.objectForPropertyPath(next);
    //       if(SC.typeOf(next) !== SC.T_OBJECT)
    //         throw "Could not find valid object during startup";
    //       var ret = next.start();
    //       if(ret === NO)
    //         throw "Startup routine failed";
    //     }
    //     this.statechart.gotoState("READY", this);
    //   }
    // }),
    READY: SC.State.extend({
      enterState: function() {
        console.log("YES?");
      }
    })
  })

}) ;


XT.DEFAULT_STARTUP = [
  "XT.Session",
  "XT.Router"
] ;
