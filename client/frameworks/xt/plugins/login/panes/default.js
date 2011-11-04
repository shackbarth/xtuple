
/*globals Login */

sc_require("views/status_icon");

/** @class


*/
Login.DefaultPane = XT.MainPane.extend(
  /** @scope Login.DefaultPane.prototype */ {
  
    childViews: "mainBlock".w(),

    mainBlock: XT.View.design(SC.Animatable, {
      layout: { height: 200, width: 400, top: 100, centerX: 0 },
      classNames: "main-block-container".w(),
      childViews: "imageBlock messageBlock sessionIcon userIcon".w(),
      transitions: {
        height: { duration: .25, timing: SC.Animatable.TRANSITION_EASE_IN_OUT },
      },
      
    imageBlock: XT.View.design({
      layout: { height: 100, top: 0, left: 0, right: 0 },
      classNames: "image-block-container".w(),
      childViews: "logo".w(),

    logo: SC.ImageView.design({
      layout: { centerY: 0, centerX: 0, width: 270, height: 80 },
      useImageQueue: NO,
      value: "image-block-logo",
      }), // logo
      }), // imageBlock

    messageBlock: XT.View.design(SC.Animatable, {
      layout: { height: 100, bottom: 0, left: 0, right: 0 },
      classNames: "message-block-container".w(),
      childViews: "messageLabel loginBlock".w(),
      transitions: {
        height: { duration: .25, timing: SC.Animatable.TRANSITION_EASE_IN_OUT },
      },

    messageLabel: SC.LabelView.design({
      layout: { height: 25, left: 0, right: 0, bottom: 25 },
      classNames: "message-block-messages".w(),
      tagName: "h3",
      valueBinding: SC.Binding.from("XT.MessageController.loadingStatus").oneWay() 
      }), // messageLabel

    loginBlock: XT.View.design(SC.Animatable, {
      layout: { height: 114, top: 0, width: 200, centerX: 0 },
      classNames: "login-block-container".w(),
      childViews: "usernameField passwordField loginButton".w(),
      isVisible: NO,
      transitions: {
        opacity: { duration: .5, timing: SC.Animatable.TRANSITION_CSS_EASE },
        centerX: { duration: .5, timing: SC.Animatable.TRANSITION_EASE_IN_OUT },
      },

    usernameField: SC.TextFieldView.design({
      layout: { top: 10, width: 150, height: 25, centerX: 0 },
      classNames: "login-username".w(),
      hint: "username",
      valueBinding: "XT.Session._username",
      isEnabledBinding: "XT.Session.loginInputIsEnabled"

      }), // usernameField

    passwordField: SC.TextFieldView.design({
      layout: { top: 45, width: 150, height: 25, centerX: 0 },
      classNames: "login-password".w(),
      hint: "password",
      isPassword: YES, 
      valueBinding: "XT.Session._password",
      isEnabledBinding: "XT.Session.loginInputIsEnabled"

      }), // passwordField

    loginButton: SC.ButtonView.design({
      layout: { top: 80, width: 80, height: 24, centerX: 35 },
      title: "login",
      action: "submit",
      isEnabledBinding: SC.Binding.from("XT.Session.loginIsEnabled").oneWay(),
      target: XT.Session.statechart

      }), // loginButton

      }), // loginBlock

      }), // messageBlock

    sessionIcon: Login.StatusIconView.design({
      classNames: "loading-session-icon-container".w(),
      imageClass: "loading-session-icon" 
      }),

    userIcon: Login.StatusIconView.design({
      classNames: "loading-user-icon-container".w(),
      imageClass: "loading-user-icon"
      })

      }) // mainBlock

}) ;
