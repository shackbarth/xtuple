
/**
  HACK.............................................
*/
Console.main = function main() {
  XT.dataSource = XT.DataSource.create({ name: 'XT.dataSource' });
  XT.store = XT.Store.create().from(XT.dataSource);
  //XT.dataSource.getSession('admin', 'admin', '380postbooks');

  // use the new package system out of the box for now
  XT.package = XT.Package.create();
  XT.run();
};

function main() { Console.main(); }
