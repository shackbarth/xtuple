select xt.install_js('XM','Currency','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xtuple.com/CPAL for the full text of the software license. */

  XM.Currency = {};
  
  XM.Currency.isDispatchable = true;
  
  /**
   Return the value of a currency converted to another currency value on a given effective date.

   @param {Number} from currency id
   @param {Number} to currency id
   @param {Number} value to convert
   @param {String} effective date
   @returns {Number} 
  */
  XM.Currency.toCurrency = function(fromCurrencyId, toCurrencyId, value, effective) {
    return executeSql('select currToCurr($1, $2, $3, $4::date) as result', [fromCurrencyId, toCurrencyId, value, effective])[0].result;
  }
  
$$ );