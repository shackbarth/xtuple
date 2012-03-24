
/**
  HACK.............................................
*/
Console.main = function main() {
  XM.dataSource = XM.DataSource.create({ name: 'XM.dataSource' });
  XM.store = XM.Store.create().from(XM.dataSource);
  XM.dataSource.getSession();

  // use the new package system out of the box for now
  XM.package = SC.Package.create();
  XM.run();
};

function main() { Console.main(); }
