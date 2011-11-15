
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

        // need to startup the plugin manager so it can load
        // the login plugin (used by session)
        { target: "Plugin.Controller",
          method: "load",
          args: "Login" },

        // wait until the default login plugin is loaded and processed
        { hold: "PLUGIN_DID_LOAD:LOGIN" },

        // update initial status message to indicate action
        { status: {
            message: "_initPostbooks".loc(),
            property: "loadingStatus" } },

        { status: {
            message: "_initDatasource".loc(),
            property: "loadingStatus" },
          target: "XT.DataSource",
          method: "start" },

        // need to startup the session object to determine
        // the next few actions
        // all subsequent actions will be event driven

        { target: "XT.Session",
          method: "start",
          status: {
            message: "_loadingSession".loc(),
            property: "loadingStatus" } },

        // once the datasource and session are initialized properly
        // an event will be thrown letting us know to continue
        // with the remainder of the application so this
        // really just makes this (top-level) statechart block
        // until it is done

        { hold: XT.WAIT_SIGNAL }
        
      ],
      
      complete: "READY",
      fail: "ERROR",
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

      tasks: [

        { target: "Plugin.Controller",
          method: "load",
          args: "Dashboard" },

        { hold: "PLUGIN_DID_LOAD:DASHBOARD" },

        { target: "Dashboard",
          method: "focus",
          wait: YES,
          complete: function(result) { return result.isPlugin; } }
      ],

      complete: "IDLE",
      fail: "ERROR",

      IDLE: XT.State.extend()

    })
  })

}) ;
