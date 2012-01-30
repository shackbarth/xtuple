// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XM.Activity
  @version 0.2
*/
XM.ProjectTask = XM.Activity.extend(
    /** @scope XM.ProjectTask.prototype */ {

  className: 'XM.ProjectTask',

  /**
  @type String
  */
  name: SC.Record.attr(String, {
    isRequired: YES
  }),
  
  /**
  @type XM.Project
  */
  project: SC.Record.toOne('XM.Project', {
    inverse:  'tasks',
    isMaster: NO
  }),
  
  /**
  @type SC.DateTime
  */
  startDate: SC.Record.attr(SC.DateTime, { 
    format: '%Y-%m-%d' 
  }),
  
  /**
  @type SC.DateTime
  */
  dueDate: SC.Record.attr(SC.DateTime, { 
    format: '%Y-%m-%d',
    isRequired: YES
  }),
  
  /**
  @type SC.DateTime
  */
  assignDate: SC.Record.attr(SC.DateTime, { 
    format: '%Y-%m-%d' 
  }),
  
  /**
  @type SC.DateTime
  */
  completeDate: SC.Record.attr(SC.DateTime, { 
    format: '%Y-%m-%d' 
  }),
  
  /**
  @type Number
  */
  budgetedHours:  SC.Record.attr(Number),
  
  /**
  @type Number
  */
  actualHours:    SC.Record.attr(Number),
  
  /**
  @type Number
  */
  budgetedExpenses: SC.Record.attr(Number),
  
  /**
  @type Number
  */
  actualExpenses:   SC.Record.attr(Number),
  
  /**
  @type XM.ProjectTaskAlarm
  */
  alarms: SC.Record.toMany('XM.ProjectTaskAlarm', {
    isNested: YES,
    inverse: 'alarms'
  }),
  
  /**
  @type XM.ProjectTaskComment
  */
  comments: XM.Record.toMany('XM.ProjectTaskComment', {
    isNested: YES
  }),

  // ..........................................................
  // CALCULATED PROPERTIES
  //

  /**
  @field
  @type Number
  */
  balanceHours: function() {
    var value = this.get('budgetedHours') - this.get('actualHours');
    return value;
  }.property('budgetedHours','actualHours'),


  /**
  @field
  @type Number
  */
  balanceExpenses: function() {
    var value = this.get('budgetedExpenses') - this.get('actualExpenses');
    return value;
  }.property('budgetedExpenses','actualExpenses'),

});
