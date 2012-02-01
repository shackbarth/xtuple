
/*globals Plugin */

sc_require("views/status_image");

/** @class
  This is the default (base) page for the Login plugin.
*/
Plugin.pages.login = Plugin.Page.create(
  /** @scope Plugin.pages.login.prototype */ {

  defaultView: Plugin.View.design({

    childViews: "mainBlock".w(),

    mainBlock: XT.AnimationView.design({
      layout: { centerY: 0, height: 200, width: 400, centerX: 0 },
      classNames: "main-block-container".w(),
      childViews: "imageBlock messageBlock sessionIcon userIcon".w(),
      isVisible: YES,
      // xtTransitions: {
      //   height:     { duration: .5, timing: SC.Animatable.TRANSITION_EASE_IN_OUT },
      // },
      xtWillAppend: function() {
        this._adjustTop();
      },
      xtAnimationEvents: {
        "mainBlock-show": [
          { start: 200 },
          { call: "mainBlock-expand" },
          { call: "loginBlock-show", path: "messageBlock.loginBlock" }
        ],
        "mainBlock-expand": [
          { call: function() { this._adjustTop(); } },
          { start: 200 },
          { property: "height", value: 325 },
          { immediate: YES },
          { call: "messageBlock-expand", path: "messageBlock" }
        ]
      },
      _adjustTop: function() {
        this.disableAnimation();
        var frame = XT.BASE_PANE.get("frame"),
            height = 325,
            top = (~~(frame.height / 2) - (height / 2)) - Plugin.DEFAULT_TOP_PADDING;
        if(top > Plugin.DEFAULT_TOP_PADDING) this.adjust("top", top).updateLayout();
        this.enableAnimation();
      },
      basePaneFrameBinding: SC.Binding.from("XT.BASE_PANE.frame").oneWay(),
      _basePaneObserver: function() {
        var iv = this.get("isVisibleInWindow");
        if(iv) { this._adjustTop(); }
      }.observes("basePaneFrame"),
      
    imageBlock: XT.View.design({
      layout: { height: 100, top: 0, left: 0, right: 0 },
      classNames: "image-block-container".w(),
      childViews: "logo".w(),

    logo: SC.ImageView.design({
      layout: { centerY: 0, centerX: 0, width: 270, height: 80 },
      value: "image-block-logo",
      }), // logo
      }), // imageBlock

    // messageBlock: XT.View.design(SC.Animatable, {
    messageBlock: XT.AnimationView.design({
      layout: { height: 100, bottom: 0, left: 0, right: 0 },
      classNames: "message-block-container".w(),
      childViews: "messageLabel loginBlock".w(),
      // xtTransitions: {
      //   height:     { duration: .5, timing: SC.Animatable.TRANSITION_EASE_IN_OUT },
      // },
      xtAnimationEvents: {
        "messageBlock-expand": [
          { property: "height", value: 200 },
        ]
      },

    messageLabel: SC.LabelView.design({
      layout: { height: 25, left: 0, right: 0, bottom: 25 },
      classNames: "message-block-messages".w(),
      tagName: "h3",
      valueBinding: SC.Binding.from("XT.MessageController.loadingStatus").oneWay() 
      }), // messageLabel

    loginBlock: XT.AnimationView.design({
      layout: { height: 114, top: 0, width: 200, centerX: 0 },
      classNames: "login-block-container".w(),
      childViews: "usernameField passwordField loginButton serverStatusIcon".w(),
      isVisible: NO,
      // xtTransitions: {
      //   opacity:    { duration: .5, timing: SC.Animatable.TRANSITION_EASE_IN_OUT },
      //   centerX:    { duration: .5, timing: SC.Animatable.TRANSITION_EASE_IN_OUT },
      // },
      xtAnimationEvents: {
        "loginBlock-show": [
          { start: 400 },
          { disableAnimation: YES },
          { property: "opacity", value: 0.0, immediate: YES },
          { property: "isVisible", value: YES, set: YES },
          { immediate: YES },
          { enableAnimation: YES, wait: 100 },
          { property: "opacity", value: 1.0, wait: 300 }
        ],
        "loginBlock-login": [
          { property: "centerX", value: -90 },
          { property: "opacity", value: .5 }
        ],
        "loginBlock-reset": [
          { property: "centerX", value: 0 },
          { property: "opacity", value: 1.0 },
          { call: function() { XT.StatusImageController.deactivateCurrent(); } },
        ]

      },

    usernameField: SC.TextFieldView.design({
      layout: { top: 10, width: 150, height: 25, centerX: 0 },
      classNames: "login-username".w(),
      hint: "username",
      valueBinding: "XT.Session._username",
      isEnabledBinding: "XT.Session.loginInputIsEnabled",
      loginIsEnabledBinding: "XT.Session.loginIsEnabled",
      keyUp: function(evt) {
        if(evt.keyCode === SC.Event.KEY_RETURN)
          if(this.get("loginIsEnabled"))
            XT.Session.statechart.sendEvent("submit");
        return YES;
      }

      }), // usernameField

    passwordField: SC.TextFieldView.design({
      layout: { top: 45, width: 150, height: 25, centerX: 0 },
      classNames: "login-password".w(),
      hint: "password",
      isPassword: YES, 
      valueBinding: "XT.Session._password",
      isEnabledBinding: "XT.Session.loginInputIsEnabled",
      loginIsEnabledBinding: "XT.Session.loginIsEnabled",
      keyUp: function(evt) {
        if(evt.keyCode === SC.Event.KEY_RETURN)
          if(this.get("loginIsEnabled"))
            XT.Session.statechart.sendEvent("submit");
        return YES;
      }

      }), // passwordField

    loginButton: SC.ButtonView.design({
      layout: { top: 80, width: 80, height: 24, right: 25 },
      title: "login",
      action: "submit",
      isEnabledBinding: SC.Binding.from("XT.Session.loginIsEnabled").oneWay(),
      target: XT.Session.statechart

      }), // loginButton

    serverStatusIcon: XT.StatusImageView.design({
      layout: { top: 84, width: 16, height: 16, left: 25 },
      isVisible: YES,
      classNames: "login-server-status".w(),
      imageClass: "login-server-status-icon",
      isActiveBinding: "XT.DataSource.serverIsAvailable",
      toolTipBinding: "XT.DataSource.serverIsAvailableTooltip",
      mouseEntered: function() {
        var tt = this.get("toolTip"),
            was = XT.MessageController.get("loadingStatus");
        XT.MessageController.set("loadingStatus", tt);
        this._prevMessage = was;
      },
      mouseExited: function() {
        var was = this._prevMessage;
        if(was) XT.MessageController.set("loadingStatus", was);
      }
      }), // serverStatusIcon

      }), // loginBlock

      }), // messageBlock

    sessionIcon: Plugin.views.StatusIconView.design({
      classNames: "loading-session-icon-container".w(),
      imageClass: "loading-session-icon" 
      }),

    userIcon: Plugin.views.StatusIconView.design({
      classNames: "loading-user-icon-container".w(),
      imageClass: "loading-user-icon"
      })

      }) // mainBlock

  }) // defaultView

}) ;
