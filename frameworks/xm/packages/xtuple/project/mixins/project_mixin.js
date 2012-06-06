// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ¬©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @namespace
*/
XM.ProjectMixin =  {	

  /**
    @type Quantity
  */
  budgetedHoursTotal: 0,

  /**
    @type Quantity
  */ 
  actualHoursTotal: 0,

  /**
    @type Money
  */
  budgetedExpensesTotal: 0,

  /**  
    @type Money
  */
  actualExpensesTotal: 0,

  /**
    @type Quantity
  */
  balanceHoursTotal: function() {
    var hours = this.get('budgetedHoursTotal') - this.get('actualHoursTotal');
    return hours.toQuantity();
  }.property('budgetedHoursTotal','actualHoursTotal'),

  /**
    @type Money
  */
  balanceExpensesTotal: function() {
    var expenses = this.get('budgetedExpensesTotal') - this.get('actualExpensesTotal');
    return expenses.toMoney();
  }.property('budgetedExpensesTotal','actualExpensesTotal'),

  //..................................................
  // METHODS
  //

  updateBudgetedHours: function() {
    var tasks = this.get('tasks'),
        K = SC.Record,
        budgetedHours = 0;
    for (var i = 0; i < tasks.get('length'); i++) {
      var task = tasks.objectAt(i),
          status = task.get('status'),
          hours = (status & K.DESTROYED)? 0 : task.get('budgetedHours');
      budgetedHours = budgetedHours + hours;
    }
    this.setIfChanged('budgetedHoursTotal', budgetedHours.toQuantity());
  },	

  updateActualHours: function() {
    var tasks = this.get('tasks'),
        K = SC.Record,
        actualHours = 0;
    for (var i = 0; i < tasks.get('length'); i++) {
      var task = tasks.objectAt(i),
          status = task.get('status'),
          hours = (status & K.DESTROYED)? 0 : task.get('actualHours');
      actualHours = actualHours + hours;
    }
    this.setIfChanged('actualHoursTotal', actualHours.toQuantity());
  },

  updateBudgetedExpenses: function() {
    var tasks = this.get('tasks'),
        K = SC.Record,
        budgetedExpenses = 0;
    for (var i = 0; i < tasks.get('length'); i++) {
      var task = tasks.objectAt(i),
          status = task.get('status'),
          expenses = (status & K.DESTROYED)? 0 : task.get('budgetedExpenses');
      budgetedExpenses = budgetedExpenses + expenses;
    }
    this.setIfChanged('budgetedExpensesTotal', budgetedExpenses.toMoney());
  },	

  updateActualExpenses: function() {
    var tasks = this.get('tasks'),
        K = SC.Record,
        actualExpenses = 0;
    for (var i = 0; i < tasks.get('length'); i++) {
      var task = tasks.objectAt(i),
          status = task.get('status'),
          expenses = (status & K.DESTROYED)? 0 : task.get('actualExpenses');
      actualExpenses = actualExpenses + expenses;
    }
    this.setIfChanged('actualExpensesTotal', actualExpenses.toMoney());
  },
  
  //..................................................
  // OBSERVERS
  //

  statusDidChange: function(){
    var status = this.get('status'),
        K = SC.Record;
    if (status === K.READY_CLEAN) {
      this.number.set('isEditable', false);
      this.updateActualHours(),
      this.updateBudgetedHours();
      this.updateActualExpenses(),
      this.updateBudgetedExpenses();
    }
  }.observes('status')

};

