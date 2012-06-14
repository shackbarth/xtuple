
enyo.kind(
  /** */ {

  /** */
  name: "XT.Dashboard",
  
  /** */
  kind: "FittableRows",
  
  /** */
  classes: "dashboard bggrad",
  
  /** */
  fit: true,
  
  /** */
  components: [
    { name: "container", fit: false, classes: "dashboard-icons-container", components: [
      { name: "icons", kind: "XT.DashboardIcons" } ]}
  ]
    
});