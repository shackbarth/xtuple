
/**
*/
enyo.kind(
  /** */ {

  name: "App",
  kind: "Panels",
  fit: true,
  layoutKind: "CarouselArranger",
	draggable: false,
	arrangerKind: "CardSlideInArranger",
  
  components: [
    { name: "loginScreen", kind: "XT.LoginScreen" },
    { name: "loginScreenChoices", kind: "XT.LoginScreenChoices" },
    { name: "mainFrameScreen", kind: "XT.MainFrameScreen" }
  ],
  
  start: function() {
    XT.dataSource = new XT.DataSource();
    this.renderInto(document.body);
    
    // temporary
    this.$.loginScreen.$.loginUsername.setValue("admin");
    this.$.loginScreen.$.loginPassword.setValue("admin");
    this.$.loginScreen.$.loginOrganization.setValue("40beta");
  }
    
});