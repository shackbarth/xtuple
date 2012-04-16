
/**
  HACK.............................................
*/
Console.main = function main() {
  XT.dataSource = XT.DataSource.create({ name: 'XT.dataSource' });
  XT.store = XT.Store.create().from(XT.dataSource);

  // use the new package system out of the box for now
  XT.package = XT.Package.create();
  XT.run();

  // go ahead and grab a default session since this is all just
  // used for development anyways right now
  XT.session.acquireSession('admin', 'admin', '380postbooks');

  SC.Logger.warn("Don't forget to type `XT.package.loadAll()`");
};

function main() { Console.main(); }
