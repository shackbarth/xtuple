
/**
*/
enyo.kind(
  /** */ {

  name: "App",
  
  kind: "Control",
  
  components: [
    { name: "loginScreen", kind: "XT.LoginScreen" },
    { name: "loginScreenChoices", kind: "XT.LoginScreenChoices" },
    { name: "mainFrameScreen", kind: "XT.MainFrameScreen" }
  ],
  
  start: function() {
    XT.dataSource = new XT.DataSource();
    this.$.loginScreen.renderInto(document.body);
  }
    
});