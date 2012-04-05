// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_tax_assignment');

/**
  @class

  @extends XT.Record
*/
XM.TaxAssignment = XT.Record.extend(XM._TaxAssignment,
  /** @scope XM.TaxAssignment.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  /** @private
 
    Array of XM.TaxAssignment records that have taxZone AND taxType AND taxCode property conflicts...
  */
  recordConflicts: function() {
    if(this.isDirty()) {
      var taxZone = this.get('taxZone'),
          taxType = this.get('taxType'),
          taxCode = this.get('taxCode'),
          id = this.get('id'),
          qry;

      if(taxZone && taxType && taxCode && id) {
        qry = SC.Query.local(XM.TaxAssignment, { 
          conditions: "id != {id} "
                      + "AND taxZone = {taxZone} "
                      + "AND taxType = {taxType} "
                      + "AND taxCode = {taxCode} ", 
          parameters: { 
            id: id,
            taxZone: taxZone,
            taxType: taxType,
            taxCode: taxCode
          } 
        });
        this._xm_recordConflicts = XT.store.find(qry);
      }
    }    
    return this._xm_recordConflicts || [];
  }.property('taxZone', 'taxType', 'taxCode', 'id').cacheable(),
  
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

    // return errors array
    return errors;
  }.observes('recordConflictsLength')
  
});

