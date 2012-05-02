// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @patch

  This code is automatically generated and will be over-written. Do not edit directly.
*/
SC.Patch.create( /** @scope XM.BankAccount.prototype */ { 
  
  target: 'XM.BankAccount',

  body: {
  
    /**
      @type Boolean
    */
    usedByPayables: SC.Record.attr(Boolean, {
      defaultValue: false
    }),
  
    /**
      @type Number
    */
    nextCheckNumber: SC.Record.attr(Number),
  
    /**
      @type Number
    */
    checkForm: SC.Record.attr(Number),
  
    /**
      @type Number
    */
    routing: SC.Record.attr(Number),
  
    /**
      @type Boolean
    */
    isAchEnabled: SC.Record.attr(Boolean),
  
    /**
      @type Boolean
    */
    achGenerateCheckNumber: SC.Record.attr(Boolean),
  
    /**
      @type Number
    */
    achLeadTime: SC.Record.attr(Number),
  
    /**
      @type String
    */
    achOriginType: SC.Record.attr(String),
  
    /**
      @type String
    */
    achOriginName: SC.Record.attr(String),
  
    /**
      @type String
    */
    achOrigin: SC.Record.attr(String),
  
    /**
      @type Boolean
    */
    achDestinationType: SC.Record.attr(Boolean),
  
    /**
      @type Boolean
    */
    achDestinationName: SC.Record.attr(Boolean),
  
    /**
      @type Boolean
    */
    achDestination: SC.Record.attr(Boolean),
  
    /**
      @type Number
    */
    achDestinationFederal: SC.Record.attr(Number)

  }

});
