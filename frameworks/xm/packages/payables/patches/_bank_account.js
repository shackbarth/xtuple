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
      defaultValue: false,
      label: '_usedByPayables'.loc()
    }),
  
    /**
      @type Number
    */
    nextCheckNumber: SC.Record.attr(Number, {
      label: '_nextCheckNumber'.loc()
    }),
  
    /**
      @type Number
    */
    checkForm: SC.Record.attr(Number, {
      label: '_checkForm'.loc()
    }),
  
    /**
      @type Number
    */
    routing: SC.Record.attr(Number, {
      label: '_routing'.loc()
    }),
  
    /**
      @type Boolean
    */
    isAchEnabled: SC.Record.attr(Boolean, {
      label: '_isAchEnabled'.loc()
    }),
  
    /**
      @type Boolean
    */
    achGenerateCheckNumber: SC.Record.attr(Boolean, {
      label: '_achGenerateCheckNumber'.loc()
    }),
  
    /**
      @type Number
    */
    achLeadTime: SC.Record.attr(Number, {
      label: '_achLeadTime'.loc()
    }),
  
    /**
      @type String
    */
    achOriginType: SC.Record.attr(String, {
      label: '_achOriginType'.loc()
    }),
  
    /**
      @type String
    */
    achOriginName: SC.Record.attr(String, {
      label: '_achOriginName'.loc()
    }),
  
    /**
      @type String
    */
    achOrigin: SC.Record.attr(String, {
      label: '_achOrigin'.loc()
    }),
  
    /**
      @type Boolean
    */
    achDestinationType: SC.Record.attr(Boolean, {
      label: '_achDestinationType'.loc()
    }),
  
    /**
      @type Boolean
    */
    achDestinationName: SC.Record.attr(Boolean, {
      label: '_achDestinationName'.loc()
    }),
  
    /**
      @type Boolean
    */
    achDestination: SC.Record.attr(Boolean, {
      label: '_achDestination'.loc()
    }),
  
    /**
      @type Number
    */
    achDestinationFederal: SC.Record.attr(Number, {
      label: '_achDestinationFederal'.loc()
    })

  }

});
