
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
        { method: "showBasePane" },
        { target: "XT.PluginManager",
          method: "start",
          complete: YES,
          status: {
            message: "loading plugins",
            property: "loadingStatus",
            image: "configuring-image" },
          wait: "next1" },
        { target: "XT.Router",
          method: "start",
          complete: YES,
          status: {
            message: "registering components",
            property: "loadingStatus",
            image: "registering-image" },
          wait: "next2" },
        { target: "XT.DataSource",
          method: "start",
          complete: YES,
          status: {
            message: "configuring sources",
            property: "loadingStatus",
            image: "records-image" },
          wait: "next3" },
        { target: "XT.Store",
          method: "start",
          complete: YES,
          wait: "next4",
          status: {
            message: "configuring local store",
            property: "loadingStatus",
            image: "user-image" } },
        { target: "XT.Session",
          method: "start",
          complete: YES,
          status: {
            message: "loading session data",
            property: "loadingStatus",
            image: "login-image" },
          wait: "next5" },
        { method: function() {
            var evts = [
              "next1",
              "next2",
              "next3",
              "next4",
              "next5"
            ];
            var ex = function() {
              if(evts.length > 0) {
                var d = evts.shift();
                XT.PostbooksStatechart.sendEvent(d);
                setTimeout(ex, 300);
              } else return YES;
            }
            ex();
            return YES;
          } }
      ],
      complete: "READY",
      fail: "ERROR",
      showBasePane: function() {

        // this will allow for smoother transitions in the future
        Postbooks.getPath("mainPage.basePane").append();
        XT.MessageController.set("loadingStatus", "Initializing");
        return YES;
      }
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
      enterState: function() {
        setTimeout(function() { XT.MessageController.set("loadingStatus", "preparing to launch application"); }, 1000);
        setTimeout(function() { 
          XT.Router.next();
        }, 3000);
      }
    })
  })

}) ;
