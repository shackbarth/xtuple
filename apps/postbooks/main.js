// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT XM Postbooks */

SC.ENABLE_CSS_TRANSITIONS = false;

XT.DataSource.prototype.logLevels = SC.Object.create({
  warn:  false,
  info:  false,
  error: false
});

function main() {
  XT.dataSource = XT.DataSource.create({ name: 'XT.dataSource' });
  XT.store = XT.Store.create().from(XT.dataSource);
  XT.dataSource.getSession();

  // Use the new package system out of the box for now.
  XT.package = SC.Package.create();
  XT.run();

  // setTimeout(Postbooks.RenderModelHierarchy, 0);
  Postbooks.LoadUserInterface();
}
