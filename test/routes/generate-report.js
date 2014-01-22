var assert = require("chai").assert,
  emailRoute = require("../../node-datasource/routes/email");

describe('Generate Report Report', function () {
  'use strict';

  var invoice = {
    recordType: 'XM.Invoice',
    id: 1
  };

  describe.skip('#email', function () {

  });
  describe('#print', function () {
    it('should return a printable version of this object', function (done) {
      var report = new XM.bi.Report(invoice);

      report.on('print:success', function () {
        done();
      });

      report.trigger('print');
    });
  });
});

