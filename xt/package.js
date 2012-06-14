enyo.depends(
  "foundation",
  "screens",
  
  // if development mode is true go ahead and load
  // the developer helper bar
  DEVELOPMENT_MODE? "developer": ""
);