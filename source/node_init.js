// TODO: it will be nice to just use source/package.js as the file that package.json
// points to. In order for that to be possible, X.depends in node will have to be able
// to recurse, and we would have to deal with the DOM-specific code in core.js.

X.depends(
  "foundation.js",
  "error.js",
  "log.js",
  "datasource.js",
  "date.js",
  "math.js",
  "request.js",
  "response.js",
  "session.js",
  "locale.js",
  "ext/proto/string.js",
  "ext/string.js",
  "ext/startup_task.js"
);
