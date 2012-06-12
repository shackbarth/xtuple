
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
    { name: "loginScreen", kind: "XT.LoginScreen" }
  ],
  
  start: function() {
    XT.dataSource = new XT.DataSource();
    this.renderInto(document.body);
    
    // temporary
    //this.$.loginScreen.$.loginUsername.setValue("admin");
    //this.$.loginScreen.$.loginPassword.setValue("Assemble!Aurora");
    //this.$.loginScreen.$.loginOrganization.setValue("aurora");
  }
    
});