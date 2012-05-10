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
  recordConflicts: function() {
    if(this.isDirty()) {
      var taxZone = this.get('taxZone'),
          taxAuthority = this.get('taxAuthority'),
          number = this.get('number'),
          id = this.get('id'),
          qry;
      if(taxZone && taxAuthority && number && id) {
        qry = SC.Query.local(XM.TaxRegistration, { 
          conditions: "id != {id} " +
                      "AND taxZone = {taxZone} " +
                      "AND taxAuthority = {taxAuthority} " +
                      "AND number = {number} ", 
          parameters: { 
            id: id,
            taxZone: taxZone,
            taxAuthority: taxAuthority,
            number: number
          } 
        });
        this._xm_recordConflicts = XT.store.find(qry);
      }
    }    
    return this._xm_recordConflicts || [];
  }.property('taxZone', 'taxAuthority', 'number', 'id').cacheable(),
  
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
    err = XT.errors.findProperty('code', 'xt1006');
    this.updateErrors(err, isErr);

    // validate expires date is after effective date
    var effective = this.get('effective'),
        expires = this.get('expires');
    isErr = XT.DateTime.compareDate(effective, expires) > 0;
    err = XT.errors.findProperty('code', 'xt1004');
    this.updateErrors(err, isErr);
    
    // return errors array
    return errors;
  }.observes('effective', 'expires', 'recordConflictsLength')
  
});
