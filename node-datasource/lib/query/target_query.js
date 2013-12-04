/*
 *
 * select xt.get($${"query":{"orderBy":[{"attribute":"number"}],"rowOffset":0,"rowLimit":50,"parameters":[{"attribute":"isPosted","operator":"=","value":false},{"attribute":"invoiceDate","operator":">=","isCharacteristic":false,"value":"2013-12-03T00:00:00.000Z"}]},"nameSpace":"XM","type":"InvoiceListItem","encoding":"rjson","username":"admin","encryptionKey":"qmxit0z12ejc3di"}$$)
 */

(function () {
  'use strict';

  var _ = require('underscore'),
    moment = require('moment');
  _.mixin(require('congruence'));

  var Query = require('./query');

  /**
   * @constructor
   */
  function TargetQuery (template, query) {
    Query.call(this, template, query);
  }

  module.exports = TargetQuery;

})();
