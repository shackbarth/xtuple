// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_project_task');

/**
  @class

  @extends XT.Record
*/
XM.ProjectTask = XT.Record.extend(XM._ProjectTask,
/** @scope XM.ProjectTask.prototype */ {

// .................................................
// CALCULATED PROPERTIES
//

balanceHours: function() {
  var value = this.get('budgetedHours') - this.get('actualHours');
  return SC.Math.round(value, XT.QTY_SCALE);
}.property('budgetedHours','actualHours'),

balanceExpenses: function() {
  var value = this.get('budgetedExpenses') - this.get('actualExpenses');
  return SC.Math.round(value, XT.MONEY_SCALE);
}.property('budgetedExpenses','actualExpenses'),

//..................................................
// METHODS
//

//..................................................
// OBSERVERS
//

newProjectTask: function() {
  var status = this.get('status');
  if (status == SC.Record.READY_NEW) {
    if (!owner) this.set('owner', this.getPath('project.owner'));
    if (!assignedTo) this.set('assignedTo', this.getPath('project.assignedTo'));
    if (!startDate) this.set('startDate', this.getPath('project.startDate'));
    if (!dueDate) this.set('dueDate', this.getPath('project.dueDate'));
    if (!assignDate) this.set('assignDate', this.getPath('project.assignDate'));		   
  }
}.observes('status'),

});

