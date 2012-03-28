// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.IncidentAlarm
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._IncidentAlarm = {
  /** @scope XM.IncidentAlarm.prototype */
  
  className: 'XM.IncidentAlarm',

  

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
  number: SC.Record.attr(Number, {
    label: '_number'.loc()
  }),

  /**
    @type XM.Incident
  */
  incident: SC.Record.toOne('XM.Incident', {
    label: '_incident'.loc()
  }),

  /**
    @type Boolean
  */
  isEvent: SC.Record.attr(Boolean, {
    defaultValue: false,
    label: '_isEvent'.loc()
  }),

  /**
    @type String
  */
  eventRecipient: SC.Record.attr(String, {
    defaultValue: function() {
      return arguments[0].getPath("store.dataSource").session.userName;
    },
    label: '_eventRecipient'.loc()
  }),

  /**
    @type Boolean
  */
  isMessage: SC.Record.attr(Boolean, {
    defaultValue: false,
    label: '_isMessage'.loc()
  }),

  /**
    @type String
  */
  messageRecipient: SC.Record.attr(String, {
    defaultValue: function() {
      return arguments[0].getPath("store.dataSource").session.userName;
    },
    label: '_messageRecipient'.loc()
  }),

  /**
    @type Number
  */
  offset: SC.Record.attr(Number, {
    defaultValue: 15,
    label: '_offset'.loc()
  }),

  /**
    @type String
  */
  qualifier: SC.Record.attr(String, {
    defaultValue: 'MB',
    label: '_qualifier'.loc()
  }),

  /**
    @type Date
  */
  time: SC.Record.attr(SC.DateTime, {
    useIsoDate: true,
    defaultValue: function() {
      return SC.DateTime.create().toFormattedString(SC.DATETIME_ISO8601);
    },
    label: '_time'.loc()
  }),

  /**
    @type Date
  */
  trigger: SC.Record.attr(SC.DateTime, {
    useIsoDate: true,
    label: '_trigger'.loc()
  })

};
