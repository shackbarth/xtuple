// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT XM Postbooks sc_assert */

SC.THROW_ALL_ERRORS = true;

SC.ENABLE_CSS_TRANSITIONS = true;

Postbooks.USE_320_TILES = true;

XT.DataSource.prototype.logLevels = SC.Object.create({
  warn:  false,
  info:  false,
  error: false
});

function main() {
  Postbooks.statechart.initStatechart();
}
