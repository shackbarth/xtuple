// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/**
  @class

  @extends SC.Object
*/

XT.Dispatch = SC.Object.extend(
  /** @scope SC.Dispatch.prototype */ {

  // ..........................................................
  // PROPERTIES
  //

  /**
    Walk like a duck.

    @type Boolean
  */
  isDispatch: true,

  /**
    The record type making the call.

    @type SC.Record
  */
  className: null,

  /**
    The name of the function to call.

    @type String|function
  */
  functionName: null,

  /**
    Optional hash of parameters.  These are the arguments to run against
    the function

    @type Hash
  */
  parameters: null,

  /**
    The target object.
  */
  target: null,

  /**
    Callback

    @type function
  */
  action: null

})
