
/**
*/
enyo.kind(
  /** @scope XT.LoginScreen.prototype */ {

  name: "XT.LoginScreen",
  
  kind: "Control",
  
  classes: "login-screen onyx",
  
  components: [
    {
      name: "loginContainer",
      kind: "Control",
      classes: "login-screen-container",
      components: [
        {
          name: "loginBlock",
          kind: "FittableRows",
          fit: true,
          components: [
            {
              name: "row1",
              classes: "login-input-row",
              components: [
                {
                  name: "loginHeader",
                  kind: "onyx.Toolbar",
                  content: "Please, login"
                }
              ]
            },
            {
              name: "row2",
              kind: "onyx.InputDecorator",
              classes: "login-input-row",
              components: [
                {
                  name: "loginUsername",
                  kind: "onyx.Input",
                  placeholder: "Username"
                }
              ]
            },
            {
              name: "row3",
              kind: "onyx.InputDecorator",
              classes: "login-input-row",
              components: [
                {
                  name: "loginPassword",
                  kind: "onyx.Input",
                  type: "password",
                  placeholder: "Password"
                }
              ]
            },
            {
              name: "row4",
              kind: "onyx.InputDecorator",
              classes: "login-input-row",
              components: [
                {
                  name: "loginOrganization",
                  kind: "onyx.Input",
                  placeholder: "Organization"
                }
              ]
            },
            {
              name: "row5",
              classes: "login-input-row",
              components: [
                {
                  name: "loginButton",
                  kind: "onyx.Button",
                  content: "Login"
                }
              ],
              tap: function() {
                
                // TODO: without statecharts or time to develop
                // a controller mechanism like them, this is a
                // very manual process...
                var container = this.owner;
                var credentials = {
                  username: container.$.loginUsername.getValue(),
                  password: container.$.loginPassword.getValue(),
                  organization: container.$.loginOrganization.getValue()
                };
                
                XT.session.acquireSession(credentials, function(response) {
                  container.$.loginUsername.setValue("");
                  container.$.loginPassword.setValue("");
                  container.$.loginOrganization.setValue("");
                  
                  var screen;
                  
                  if (response.code === 1) {
                    XT.app.setIndex(1);
                    screen = XT.app.$.loginScreenChoices.$.loginSelectionList;
                    screen.setActiveSessions(response.data);
                  } else if (response.code === 4) {
                    XT.app.setIndex(2);
                  } else {
                    console.error("WTF IS THIS ", response);
                  }
                });
              }
            }
          ]
        }
      ]
    }
  ]
    
});