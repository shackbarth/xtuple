// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/**
  @class


  @extends SC.Object
*/

XM.Dispatch = SC.Object.extend(
  /** @scope SC.Dispatch.prototype */ {

  // ..........................................................
  // PROPERTIES
  //

  /**
    Walk like a duck.

    @type Boolean
  */
  isDispatch: YES,

  /**
    The record type making the call.

    @type SC.Record
  */
  className: null,

  /**
    The name of the function to call.

    @type String
  */
  functionName: null,

  /**
    Optional hash of parameters.  These are the arguments to run against
    the function

    @type Hash
  */
  parameters: null,
  
  /**
    Callback
    
    @type function
  */
  callback: null

})




