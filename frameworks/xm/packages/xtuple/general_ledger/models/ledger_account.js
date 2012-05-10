// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_ledger_account');

/**
  @class

  @extends XT.Record
*/
XM.LedgerAccount = XM.Document.extend(XM._LedgerAccount,
	/** @scope XM.LedgerAccount.prototype */ {

	documentKey: 'number',

	// .................................................
	// CALCULATED PROPERTIES
	//

	number: SC.Record.attr(String, {
		fromType: function(record, key, value) {
			var segmentSize = XT.session.settings.get('GLMainSize');
			return value.substr(0,segmentSize);
		} 
	}),

	duplicate: function() {
		var status = this.get('status');
		if (status == SC.Record.Ready_NEW || status == SC.Record.READY_DIRTY) {
			var clauses = [], 
					params = {}, 
					company = this.get('company'),
					profitCenter = this.get('profitCenter'),
					number = this.get('number'),
					subAccount = this.get('subAccount'),
					conditions,
					qry;
			
			if (company > 0) {
				clauses.push('company = {company}'),
				params.company = company;
			}
			if (profitCenter > 0) {
				clauses.push('profitCenter = {profitCenter}'),
				params.profitCenter = profitCenter;
			}
			if (number > 0) {
				clauses.push('number = {number}'),
				params.number = number;
			}		
			if (subAccount > 0) {
				clauses.push('subAccount = {subAccount}'),
				params.subAccount = subAccount;
			}	
			
			conditions = clauses.join('AND');
			
			qry = SC.Query.local(XM.LedgerAccount, {
				conditions: conditions,
				parameters: params
			});
			this._xm_duplicate = XT.store.find(qry);
		}
		return this._xm_duplicate || [];
	}.property('company','profitCenter','number','subAccount').cacheable(),
  
	/** @private */
  duplicateLength: 0,
  
  /** @private */
  duplicateLengthBinding: SC.Binding.from('*duplicate.length').noDelay(),

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

    // validate effective and expires date range
    isErr = this.get('duplicateLength') > 0 ? true : false;
    err = XT.errors.findProperty('code', 'xt1003');
    this.updateErrors(err, isErr);

    
    // return errors array
    return errors;
  }.observes('duplicateLength')
});

XM.LedgerAccount.mixin( /** @scope XM.LayoutIncomeStatementDetail */ {

/**
  @static
  @constant
  @type String
  @default A
*/
  ASSET: 'A',

/**
  @static
  @constant
  @type String
  @default E
*/
  EXPENSE: 'E',

/**
  @static
  @constant
  @type String
  @default L
*/
  LIABILITY: 'L',

/**
  @static
  @constant
  @type String
  @default Q
*/
  EQUITY: 'Q',

/**
  @static
  @constant
  @type String
  @default R
*/
  REVENUE: 'R'

});
