
/*globals XT */

/** @namespace

*/
XT.PostbooksStatechart = XT.Statechart.create(
  /** @scope XT.PostbooksStatechart.prototype */ {

  /** @property */
  name: "XT.PostbooksStatechart",

  autoInitStatechart: NO,
  trace: YES,
  rootState: XT.State.extend({

    initialSubstate: "INITIALIZING",

    INITIALIZING: XT.TaskState.extend({
      tasks: [
        { target: "XT.Router",
          method: "start",
          complete: YES },
        { target: "XT.Session",
          method: "start",
          complete: YES }
      ],
      complete: "READY",
      fail: "ERROR"

    }),

    ERROR: XT.State.extend({
      enterState: function() {
        this.error(
          "The application cannot continue after encountering " +
          "a fatal error. This should really put an error screen " +
          "up that is clean and easy on the eyes...also reporting " +
          "so we know what happened, that sort of thing. Needs to " +
          "delete objects that will have been registered or might have " +
          "been so they aren't accessible and parts of the application " +
          "still try to run.", YES
        );
      }
    }),

    READY: XT.TaskState.extend({

    })
  })

}) ;
