// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/
XM.Country = XM.Record.extend(
/** @scope XM.Country.prototype */ {

  className: 'XM.Country',

  createPrivilege: 'MaintainCountries',
  readPrivilege:   'ViewCountries',
  updatePrivilege: 'MaintainCountries',
  deletePrivilege: 'MaintainCountries',
  
  /**
  @type String
  */
  abbreviation: SC.Record.attr(String),
  
  /**
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  @type String
  */
  currencyName: SC.Record.attr(String),
  
  /**
  @type String
  */
  currencySymbol: SC.Record.attr(String),
  
  /**
  @type String
  */
  currencyAbbreviation: SC.Record.attr(String),
  
  /** 
  @type String
  */
  currencyNumber: SC.Record.attr(Number),
  
  /** 
  @type XM.State
  */
  states: SC.Record.toMany( 'XM.State', { 
    isMaster: NO,
    inverse:  'country' 
  }),

}) ;

