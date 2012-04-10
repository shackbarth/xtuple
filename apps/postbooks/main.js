// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT XM Postbooks */

SC.ENABLE_CSS_TRANSITIONS = false;

XM.DataSource.prototype.logLevels = SC.Object.create({
  warn:  false,
  info:  false,
  error: false
});

function main() {
  XM.dataSource = XM.DataSource.create({ name: 'XM.dataSource' });
  XM.store = XM.Store.create().from(XM.dataSource);
  XM.dataSource.getSession();
  XM.run();

  // setTimeout(Postbooks.RenderModelHierarchy, 0);
  Postbooks.LoadUserInterface();
}
