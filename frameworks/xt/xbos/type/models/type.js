// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  This class specifies class types that may be used elsewhere
  to make associations between available functionality and 
  specific classes that implement it.
  
  For example you can use type to define what class types 
  may be assigned Characteristics, what class types may be roles
  for Accounts, or what class type a Document Assignment 
  belongs to.

  @extends XM.Record
  @version 0.1
*/
XM.Type = SC.Record.extend(
    /** @scope XM.Type.prototype */ {

  className: 'XM.Type',

  isEditable: false,
   
  /**
  This should be the class name equivilent of the type.
  
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  This should be translatable text.
  
  @type String
  */
  description: SC.Record.attr(String),
  
});
