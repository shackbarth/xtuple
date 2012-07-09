/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, 
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {
  
  enyo.kind({
    name: "XV.Login",
    kind: "XV.ScreenCarousel",
    classes: "xt-login",
    components: [
      { name: "loginScreen", kind: "XV.LoginScreen" },
      { name: "dashboard", kind: "XV.Dashboard" }
    ],
    carouselEvents: {
      acquiredSession: "dashboard"
    }
  
  });
  
  enyo.kind({
    name: "XV.LoginScreen",
    kind: "XV.ScreenCarousel",
    classes: "xt-login-screen",
    carouselEvents: {
      multipleSessions: "sessionSelection"
    },
    components: [
      { name: "userLogin", kind: "XV.UserLoginScreen" },
      { name: "sessionSelection", kind: "XV.SessionSelectionScreen" }
    ],
    create: function () {
      this.inherited(arguments);

      // temporary
      var form = XV.loginForm;
      form.$.username.setValue("admin");
      form.$.password.setValue("Assemble!Aurora");
      form.$.organization.setValue("aurora");
    }
  });
  
  enyo.kind({
    name: "XV.UserLoginScreen",
    kind: "Control",
    classes: "xt-user-login-screen",
    components: [
      { name: "block", kind: "XV.UserLoginBlock" },
      { name: "logo", kind: "XV.LoginLogoBlock" }
    ]
  });

  enyo.kind({
    name: "XV.LoginLogoBlock",
    kind: "Control",
    classes: "xt-login-logo-block"
  });
  
  enyo.kind({
    name: "XV.UserLoginBlock",
    kind: "Control",
    classes: "xt-user-login-block enyo-unselectable",
    components: [
      { name: "subBlock", kind: "XV.UserLoginSubBlock" }
    ]
  });

  enyo.kind({
    name: "XV.UserLoginSubBlock",
    kind: "Control",
    classes: "xt-user-login-sub-block enyo-unselectable",
    components: [
      { name: "form", kind: "XV.UserLoginForm" }
    ]
  });

  enyo.kind({
    name: "XV.UserLoginForm",
    kind: "Control",
    classes: "xt-user-login-form enyo-unselectable",
    create: function () {
      this.inherited(arguments);
      XV.loginForm = this;
    },
    components: [
      { name: "username", kind: "XV.LoginInput", placeholder: "Username" },
      { name: "password", kind: "XV.LoginInputPassword", placeholder: "Password" },
      { name: "organization", kind: "XV.LoginInput", placeholder: "Organization" },
      { name: "login", kind: "XV.LoginButton", content: "Login" }
    ],
    handlers: {
      onButtonTapped: "buttonTapped"
    },
    buttonTapped: function () {
      var owner = this.$;
      var credentials = {
        username: owner.username.getValue(),
        password: owner.password.getValue(),
        organization: owner.organization.getValue()
      };
      var self = this;
      XT.session.acquireSession(credentials, function (response) {
        if (response.code === 1) {
          self.bubble("multipleSessions", {eventName: "multipleSessions"});
        } else if (response.code === 4) {
          self.bubble("sessionAcquired", {eventName: "sessionAcquired"});
        } else { /* error? */ }
      });
    }
  });

  enyo.kind({
    name: "XV.LoginInput",
    kind: "XV.Input",
    classes: "xt-login-input"
  });

  enyo.kind({
    name: "XV.LoginInputPassword",
    kind: "XV.LoginInput",
    type: "password"
  });

  enyo.kind({
    name: "XV.LoginButton",
    kind: "XV.Button",
    classes: "xt-login-button"
  });
  
  enyo.kind({
    name: "XV.AvailableSessions",
    kind: "Control",
    classes: "xt-available-sessions",
    components: [
      { name: "wrapper", classes: "xt-available-sessions-wrapper", components: [
        { name: "list", kind: "List", classes: "xt-available-sessions-list", multiSelect: false, onSetupItem: "setupRow", components: [
          { name: "item", kind: "XV.SessionSelectionRow" }
        ] }
      ] }
    ],

    //components: [
    //  { name: "list", kind: "List", multiSelect: false, onSetupItem: "setupRow", components: [
    //    { name: "item", kind: "XV.SessionSelectionRow" } ]}
    //],
    rendered: function () {
      var sessions;

      this.inherited(arguments);

      if (this.hasNode() && XT.session && this.getShowing()) {
        sessions = XT.session.getAvailableSessions() || [];
        this.$.list.setCount(sessions.length);
        this.$.list.reset();
      }
    },
    setupRow: function (inSender, inEvent) {
      var row = this.$.item;
      var idx = inEvent.index;
      var data = XT.session.getAvailableSessions()[idx].sessionData;

      var ts = XT.toReadableTimestamp(data.created);
      row.$.username.setContent(data.username);
      row.$.organization.setContent(data.organization);
      row.$.created.setContent(ts);
      row.$.sid.setContent(data.sid);
    }

  });

  enyo.kind({
    name: "XV.SessionSelectionRow",
    kind: "Control",
    classes: "xt-session-selection-row",
    components: [
      { name: "username", classes: "xt-session-row-element" },
      { name: "organization", classes: "xt-session-row-element" },
      { name: "created", classes: "xt-session-row-element" },
      { name: "sid", classes: "xt-session-row-element" }
    ]

  });
  
  enyo.kind({
    name: "XV.SessionSelectionScreen",
    kind: "Control",
    classes: "xt-session-selection-screen",
    components: [
      { name: "toolbar", kind: "onyx.Toolbar", components: [
        { name: "label", content: "Please select from the following sessions" },
        { name: "button", kind: "onyx.Button", content: "New Session" }
      ]},
      { name: "sessions", kind: "XV.AvailableSessions" }
    ],
    tap: function (inSender, inEvent) {
      var self = this;
      var origin = inEvent.originator;
      var idx = inEvent.index;
      var owner = origin.owner;

      // if the originator is the new-session button
      if (origin.name === "button") {
        XT.session.selectSession("FORCE_NEW_SESSION", function () {
          self.bubble("acquiredSession", {eventName: "acquiredSession"});
        });
      } else {

        // we check to see if this was a row and if so handle
        // that instead
        if (owner.name === "item" || idx) {
          XT.session.selectSession(idx, function () {
            self.bubble("acquiredSession", {eventName: "acquiredSession"});
          });
        }
      }
    },
    didBecomeActive: function () {
      this.$.sessions.rendered();
    }
  });

}());