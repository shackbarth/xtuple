// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ProjectTaskAlarm
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ProjectTaskAlarm = {
  /** @scope XM.ProjectTaskAlarm.prototype */
  
  className: 'XM.ProjectTaskAlarm',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
      "read": true,
      "update": true,
      "delete": true
    }
  },

  //..................................................
  // ATTRIBUTES
  //
  
  /**
    @type Number
  */
  guid: SC.Record.attr(Number),

  /**
    @type Number
  */
  number: SC.Record.attr(Number),

  /**
    @type XM.ProjectTask
  */
  projectTask: SC.Record.toOne('XM.ProjectTask'),

  /**
    @type Boolean
  */
  isEvent: SC.Record.attr(Boolean, {
    defaultValue: false
  }),

  /**
    @type String
  */
  eventRecipient: SC.Record.attr(String, {
    defaultValue: function() {
      return arguments[0].getPath("store.dataSource").session.userName;
    }
  }),

  /**
    @type Boolean
  */
  isMessage: SC.Record.attr(Boolean, {
    defaultValue: false
  }),

  /**
    @type String
  */
  messageRecipient: SC.Record.attr(String, {
    defaultValue: function() {
      return arguments[0].getPath("store.dataSource").session.userName;
    }
  }),

  /**
    @type Number
  */
  offset: SC.Record.attr(Number, {
    defaultValue: 15
  }),

  /**
    @type String
  */
  qualifier: SC.Record.attr(String, {
    defaultValue: 'MB'
  }),

  /**
    @type Date
  */
  time: SC.Record.attr(XT.DateTime, {
    useIsoDate: true,
    defaultValue: function() {
      return XT.DateTime.create().toFormattedString(SC.DATETIME_ISO8601);
    }
  }),

  /**
    @type Date
  */
  trigger: SC.Record.attr(XT.DateTime, {
    useIsoDate: true
  })

};
