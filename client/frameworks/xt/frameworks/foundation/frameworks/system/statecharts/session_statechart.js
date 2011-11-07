
/*globals XT */

/** @class

*/
XT.SessionStatechart = XT.Statechart.extend(
  /** @scope XT.SessionStatechart.prototype */ {

  trace: YES,
  rootState: XT.State.design({
    
    initialSubstate: "LOGGEDOUT",

    autoInitStatechart: NO,

    LOGGEDOUT: XT.State.design({
      

      /** @private
        During initialization will perform the proper animations and
        events to show the login form. After the initialization of the
        application this cannot be run unless the entire application
        is restarted. 

        @todo Incomplete. Needs significant work. I won't like how
          tightly coupled this is to the view that now resides in the
          Postbooks namespace - should that be moved down?
      */
      showLogin: function() {
        Login.showLogin();
      }.handleEvents("noSession"),

      /**
        When logging in is enabled and the login button is clicked,
        the submit event will be fired and we will try to log in based
        as the user-input as it is currently.
      */
      tryToLogin: function() {
        this.gotoState("LOGGINGIN");
      }.handleEvents("submit"),

      LOGGINGIN: XT.TaskState.design({
        
        tasks: [
          { status: {
              message: "_logging in".loc(),
              property: "loadingStatus",
              image: "loading-user-icon" } },
          { target: "XT.Session",
            method: "set",
            args: ["loginInputIsEnabled",NO],
            complete: function() { return YES; } },
          { target: "Login",
            method: "showLoggingIn",
            complete: function() { return YES; } },
          { hold: "loginSet" },
          { status: {
              image: "loading-user-icon",
              active: NO } }
        ],
        complete: "LOGGEDIN",
        fail: "LOGGEDOUT"

      }),
      // LOGGINGIN: XT.State.design({
      //   enterState: function() {
      //     XT.MessageController.set("loadingStatus", "_logging in".loc());
      //     XT.StatusImageController.getImage("loading-user-icon").set("isActive", YES);
      //     var o = this.get("owner"),
      //     lb = Postbooks.getPath("mainPage.basePane.mainBlock.messageBlock.loginBlock");
      //     lb.adjust("centerX", -((.5 * lb.get("layout").width)-10));
      //     lb.adjust("opacity", .5);
      //     o.set("loginIsEnabled", NO);
      //     o.set("loginInputIsEnabled", NO);
      //     o._login();
      //   },
      //   complete: function(e) {
      //     XT.StatusImageController.getImage("loading-user-icon").set("isActive", NO);
      //     if(e && e === "success") {
      //       XT.MessageController.set("loadingStatus", "_success".loc());
      //       this.invokeLater(this.gotoState, 800, "LOGGEDIN");
      //     } else if(e && e === "fail") {
      //       XT.MessageController.set("loadingStatus", "_failed to login".loc());
      //       var o = this.get("owner"),
      //           lb = Postbooks.getPath("mainPage.basePane.mainBlock.messageBlock.loginBlock");
      //       lb.adjust("centerX", 0);
      //       lb.adjust("opacity", 1);
      //       o.set("loginIsEnabled", YES);
      //       o.set("loginInputIsEnabled", YES);
      //       this.gotoState("LOGGEDOUT");
      //     }
      //   }.handleEvents("success", "fail"),
      // })
    }),

    /**
      The remainder of session specific login tasks are handled
      here.
    */
    LOGGEDIN: XT.TaskState.design({
      
      tasks: [

        // need to acquire a valid session id for this new session
        { method: "_acquireSessionId",
          target: "XT.Session",
          status: {
            message: "_acquiring new session id".loc(),
            property: "loadingStatus",
            image: "loading-session-icon" } }
             
      ],
      complete: function() {

        // make sure to notify the primary application statechart
        // that we've completed our login if it is waiting for us
        XT.PostbooksStatechart.sendEvent(XT.WAIT_SIGNAL);
      },
      fail: function() {
        
        // on failure the entire application needs to fail
        XT.PostbooksStatechart.gotoState("ERROR");
      }
        
    })

  })

}) ;
