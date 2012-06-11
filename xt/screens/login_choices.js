
/**
*/
enyo.kind(
  /** @scope XT.LoginScreen.prototype */ {

  name: "XT.LoginScreenChoices",
  
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
                  content: "Please, select from..."
                }
              ]
            }            
          ]
        }
      ]
    }
  ]
    
});