
/**
  HACK.............................................
*/
Console.main = function main() {
  XM.dataSource = XM.DataSource.create({ name: 'XM.dataSource' });
  XM.store = XM.Store.create().from(XM.dataSource);
  XM.dataSource.getSession();
  // XM.session.load();
};

function main() { Console.main(); }
