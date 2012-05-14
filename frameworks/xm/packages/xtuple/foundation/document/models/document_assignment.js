// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
/** @class

  (Document your Model here)

  @extends XT.Record
*/

XM.DocumentAssignment = XT.Record.extend(
/** @scope XM.DocumentAssignment.prototype */ {

  /**
    Walk like a duck.
  */
  isDocumentAssignment: true,

  // .................................................
  // CALCULATED PROPERTIES
  //

  // ..........................................................
  // METHODS
  //

  /**
    If status changes to DESTROYED, remove object from documents 
    array on the parent record.
  */
  destroy: function() {
    var record = this.get('parentRecord'),
        docs;

    docs = record.get('documents');
    docs.removeObject(this);
  },

  /**
    Returns the purpose as a localized string.
  
    @type String
  */
  purposeString: function() {
    var purpose = this.get('purpose'),
        K = XM.DocumentAssignment, ret;
    switch (purpose) {
      case K.SIBLING:
        ret = "_relatedTo".loc();
        break;
      case K.PARENT:
        ret = "_parent".loc();
        break;
      case K.CHILD:
        ret = "_child".loc();
        break;
      case K.DUPLICATE:
        ret = "_duplicate".loc();
        break;
      default:
        ret = "_error".loc();
    }
    return ret;
  }.property('toDoStatus').cacheable()

  // ..........................................................
  // OBSERVERS
  //

});


XM.DocumentAssignment.mixin( /** @scope XM.DocumentAssignment */ {

  /**
    Sibling (related to).

    @static
    @constant
    @type String
    @default S
  */
  SIBLING: 'S',

  /**
    Parent.

    @static
    @constant
    @type String
    @default A
  */
  PARENT: 'A',

  /**
    Child.

    @static
    @constant
    @type String
    @default C
  */
  CHILD: 'C',

  /**
    Duplicate.

    @static
    @constant
    @type String
    @default N
  */
  DUPLICATE: 'D'

});
