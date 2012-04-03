// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_tax_registration');

/**
  @class

  @extends XM.Document
*/
XM.TaxRegistration = XM.Document.extend(XM._TaxRegistration,
  /** @scope XM.TaxRegistration.prototype */ {

  numberPolicy: XT.MANUAL_NUMBER,

  // .................................................
  // CALCULATED PROPERTIES
  //

  /** @private
 
    Array of XM.TaxRegistration records that have taxZone AND taxAuthority AND number property conflicts...
  */
  recordConflicts: function() {console.log('Entered recordConflicts!!!!!');
    var status = this.get('status');
    if(status == SC.Record.READY_NEW || status == SC.Record.READY_DIRTY) {
      var taxZone = this.get('taxZone'),
          taxAuthority = this.get('taxAuthority'),
          number = this.get('number'),
          id = this.get('id'),
          qry;
      qry = SC.Query.local(XM.TaxRegistration, {
        conditions: "taxZone = {taxzone} "
                    + "AND taxAuthority = {taxAuthority} "
                    + "AND number = {number} "
                    + "AND id != {id} ",
        parameters: {  
          taxZone: taxZone,
          taxAuthority: taxAuthority,
          number: number,
          id: id
        }
      });
      this._xm_recordConflicts = XT.store.find(qry);
    }    
    return this._xm_recordConflicts || [];
  }.property('taxZone', 'taxAuthority', 'number').cacheable(),
  
  /** @private */
  recordConflictsLength: 0,
  
  /** @private */
  recordConflictsLengthBinding: SC.Binding.from('*recordConflicts.length').noDelay(),
  
  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

  /* @private */
  validate: function() {
    var errors = arguments.callee.base.apply(this, arguments),
        isErr, err;

    // validate existing record conflicts
    isErr = this.get('recordConflictsLength') > 0 ? true : false;
    err = XT.errors.findProperty('code', 'xt1005');
    this.updateErrors(err, isErr);

    // validate expires date is after effective date
    var effective = this.get('effective'),
        expires = this.get('expires');
    isErr = SC.DateTime.compareDate(effective, expires) > 0;
    err = XT.errors.findProperty('code', 'xt1004');
    this.updateErrors(err, isErr);
    
    // return errors array
    return errors;
  }.observes('effective', 'expires', 'recordConflictsLength')
  
});
