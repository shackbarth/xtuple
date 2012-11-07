enyo.depends(
  // TODO: figure out how to include tools without wiping out the StartupManager queue
  //"tools",
  // onyx and layout need to come from the client (/base) app or else the relative image
  // urls get computed wrong from less
  //"onyx",
  //"layout",
  "date_format/date_format.js",
  "gts-plugins/DatePicker"
);
