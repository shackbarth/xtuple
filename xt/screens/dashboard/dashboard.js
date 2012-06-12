
enyo.kind({
  name: "XT.MainFrameCol1",
  style: "width: 320px; background-color: #000;"
});

enyo.kind({
  name: "XT.MainFrameCol2",
  style: "background-color: #333; color: #fff;",
  fit: true
});

enyo.kind({
  name: "XT.MainFrameColumns",
  kind: "FittableColumns",
  fit: true,
  components: [
    { name: "col1", kind: "XT.MainFrameCol1" },
    { name: "col2", kind: "XT.MainFrameCol2" }
  ]
});

/**
*/
enyo.kind(
  /** @scope XT.MainFrameScreen.prototype */ {

  name: "XT.MainFrameScreen",
  
  kind: "FittableRows",
  
  fit: true,
  
  components: [
    { name: "mainToolbar", kind: "onyx.Toolbar", components: [ { name: "something", content: "something" }] },
    { name: "mainColumns", kind: "XT.MainFrameColumns" }
  ]  

});