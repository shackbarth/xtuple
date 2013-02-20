var zombieAuth = require("./zombie_auth");

zombieAuth.loadApp('admin', 'somenew', undefined, function () {
  var m = new XM.Contact(null, {isNew: true});

  // TODO: actually use vows and assert etc.
  if (!m.isReadOnly("type")) {
    console.log("Fail! Type should be readonly");
    process.exit(1);
  }

  console.log("All tests pass");
  process.exit(0);
});
