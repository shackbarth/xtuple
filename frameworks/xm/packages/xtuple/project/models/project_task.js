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
  
  /**
    @type Number
  */
  balanceHours: function() {
    var value = this.get('budgetedHours') || 0 - this.get('actualHours') || 0;
    return SC.Math.round(value, XT.QTY_SCALE);
  }.property('budgetedHours','actualHours'),

  /**
    @type Number
  */
  balanceExpenses: function() {
    var value = this.get('budgetedExpenses') || 0 - this.get('actualExpenses') || 0;
    return SC.Math.round(value, XT.MONEY_SCALE);
  }.property('budgetedExpenses','actualExpenses'),
  
  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //
  
  budgetedHoursDidChange: function() {
    this.get('project').updateBudgetedHours();
  }.observes('budgetedHours'),
  
  actualHoursDidChange: function() {
    this.get('project').updateActualHours();
  }.observes('actualHours'),
  
  budgetedExpensesDidChange: function() {
    this.get('project').updateBudgetedExpenses();
  }.observes('budgetedExpenses'),
  
  actualExpensesDidChange: function() {
    this.get('project').updateActualExpenses();
  }.observes('actualExpenses'),
  
  /**
    Ensure no over lapping numbers.
  */
  numberDidChange: function() {
    var tasks  = this.getPath('project.tasks'),
        number = this.get('number'),
        id = this.get('id'),
        isErr = false,
        err = XT.errors.findProperty('code', 'xt1007');
    if (id && number && tasks) {
      for (var i = 0; i < tasks.get('length'); i++) {
        var task = tasks.objectAt(i);
        if (task.get('number') === number &&
            task.get('id') !== id &&
           (task.get('status') & SC.Record.DESTROYED)  === 0) {
          isErr = true;
        }
      }
    }
    this.updateErrors(err, isErr);
  }.observes('number', 'project', 'id'),
  
  /**
    Pull in project defaults where applicable.
  */
  projectDidChange: function() {
    if (this.get('status') === SC.Record.READY_NEW && this.get('project')) {
      if (!this.get('owner')) this.set('owner', this.getPath('project.owner'));
      if (!this.get('assignedTo')) this.set('assignedTo', this.getPath('project.assignedTo'));
      if (!this.get('startDate')) this.set('startDate', this.getPath('project.startDate'));
      if (!this.get('dueDate')) this.set('dueDate', this.getPath('project.dueDate'));
      if (!this.get('assignDate')) this.set('assignDate', this.getPath('project.assignDate'));
      if (!this.get('completeDate')) this.set('completeDate', this.getPath('project.completeDate'));
    }
  }.observes('project', 'status')

});

