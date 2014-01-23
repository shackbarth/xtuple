var assert = require("chai").assert;

describe('XM.bi.Report', function () {
  'use strict';

  var invoice = {
    recordType: 'XM.Invoice',
    id: 60000
  };

  it('is sane', function () {
    var report = new XM.bi.Report(invoice);
    assert.isDefined(report.get('entity'));
    assert.equal(report.get('entity').id, 60000);
    assert.equal(report.get('entity').recordType, 'XM.Invoice');
  });

  describe('#url()', function () {
    it('should generate correct "print" url', function () {
      var report = new XM.bi.Report(invoice);

      assert.equal(report.url('print'), '/generate-report?nameSpace=XM&type=Invoice&id=60000&action=print');
    });
    it('should generate correct "email" url', function () {
      var report = new XM.bi.Report(invoice);

      assert.equal(report.url('email'), '/generate-report?nameSpace=XM&type=Invoice&id=60000&action=email');
    });
    it('should generate correct "download" url', function () {
      var report = new XM.bi.Report(invoice);

      assert.equal(report.url(), '/generate-report?nameSpace=XM&type=Invoice&id=60000');
      assert.equal(report.url('download'), '/generate-report?nameSpace=XM&type=Invoice&id=60000');
    });
  });

  describe.skip('#email', function () {
    this.timeout(10000);
    it('should return a printable version of this object', function (done) {
      var report = new XM.bi.Report(invoice);

      report.on('email:success', function () {
        done();
      });
      report.on('email:error', function () {
        assert.fail(arguments);
      });

      report.trigger('email');
    });
  });

  describe.skip('#print', function () {
    this.timeout(10000);
    it('should return a printable version of this object', function (done) {
      this.timeout(10000);
      var report = new XM.bi.Report(invoice);

      report.on('print:success', function () {
        done();
      });
      report.on('print:error', function () {
        assert.fail(arguments);
      });

      report.trigger('print');
    });
  });
});
