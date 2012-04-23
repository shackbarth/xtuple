// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require('mixins/_contact');

/** @class

  (Document your Model here)

  @extends XM.Documents
  @extends XM.Document
*/
XM.Contact = XM.Document.extend(XM._Contact, XM.Documents,
/** @scope XM.Contact.prototype */ {

  // ..........................................................
  // CALCULATED PROPERTIES
  //

  numberPolicy: XT.AUTO_NUMBER,

  /**
  @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    defaultValue: true
  }),

  /**
  @type String
  */
  name: function() {
    var name = [],
        first = this.get('firstName'),
        mid = this.get('middleName'),
        last = this.get('lastName'),
        suf = this.get('suffix');
    if (first) name.push(first);
    if (mid) name.push(mid);
    if (last) name.push(last);
    if (suf) name.push(suf);
    return name.join(' ');
  }.property('firstName', 'middleName', 'lastName', 'suffix').cacheable(),

  // ..........................................................
  // OBSERVERS
  //

  validate: function() {
    var flen = this.get('firstName')? this.get('firstName').length : 0,
        llen = this.get('lastName')? this.get('lastName').length : 0,
        errors = arguments.callee.base.apply(this, arguments),
        nameErr = XT.errors.findProperty('code', 'xt1002');

    // Validate Name
    this.updateErrors(nameErr, !(flen || llen));

    return errors;
  }.observes('firstName', 'lastName'),

});
