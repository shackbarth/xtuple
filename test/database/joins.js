/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, describe:true, it:true, require:true, __dirname:true, before:true */

var _ = require("underscore"),
  assert = require('chai').assert,
  datasource = require('../../node-datasource/lib/ext/datasource').dataSource,
  path = require('path');

(function () {
  "use strict";
  describe('The database', function () {
    this.timeout(10 * 1000);

    var loginData = require(path.join(__dirname, "../lib/login_data.js")).data,
      datasource = require('../../../xtuple/node-datasource/lib/ext/datasource').dataSource,
      config = require(path.join(__dirname, "../../node-datasource/config.js")),
      creds = config.databaseServer,
      databaseName = loginData.org,
      isCommercial = false; // this is awkward #refactor


    before(function (done) {
      var sql = "select metric_value from public.metric where metric_name = 'MultiWhs';";
      creds.database = databaseName;
      datasource.query(sql, creds, function (err, res) {
        isCommercial = res.rows[0].metric_value === 't';
        done();
      });

    });

    // these tests are pretty fragile to the exact numbers in the database, but have been invaluable to
    // make sure I'm not breaking anything in the fetch refactor
    it('should execute a query with a join filter', function (done) {
      var sql = 'select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"ContactListItem","query":{"orderBy":[{"attribute":"lastName"}],"rowOffset":0,"rowLimit":50,"parameters":[{"attribute":"owner.username","operator":"","isCharacteristic":false,"value":"admin"}]},"username":"admin","encryptionKey":"foo"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isNumber(results.data.length);
        done();
      });
    });

    it('should execute a query with an array', function (done) {
      var sql = 'select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"ActivityListItem","query":{"orderBy":[{"attribute":"dueDate"},{"attribute":"name"},{"attribute":"uuid"}],"rowOffset":0,"rowLimit":50,"parameters":[{"attribute":"isActive","operator":"=","value":true},{"attribute":["owner.username","assignedTo.username"],"operator":"","isCharacteristic":false,"value":"admin"},{"attribute":"activityType","operator":"ANY","value":["Incident","Opportunity","ToDo","SalesOrder","SalesOrderWorkflow","PurchaseOrder","PurchaseOrderWorkflow","Project","ProjectTask","ProjectWorkflow"]}]},"username":"admin","encryptionKey":"this is any content"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isNumber(results.data.length);
        done();
      });
    });

    it('should execute a query with an array with a path', function (done) {
      var sql = 'select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"ContactListItem","query":{"orderBy":[{"attribute":"lastName"}],"rowOffset":0,"rowLimit":50,"parameters":[{"attribute":"owner.username","operator":"ANY","isCharacteristic":false,"value":["admin","foo"]}]},"username":"admin","encryptionKey":"foo"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isNumber(results.data.length);
        done();
      });
    });

    it('should execute a query with a simple filter', function (done) {
      var sql = 'select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"ContactListItem","query":{"orderBy":[{"attribute":"lastName"}],"rowOffset":0,"rowLimit":50,"parameters":[{"attribute":"isActive","operator":"=","value":true}]},"username":"admin","encryptionKey":"foo"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isNumber(results.data.length);
        done();
      });
    });

    it('should execute a query with a simple filter and a join filter', function (done) {
      var sql = 'select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"ContactListItem","query":{"orderBy":[{"attribute":"lastName"}],"rowOffset":0,"rowLimit":50,"parameters":[{"attribute":"isActive","operator":"=","value":true},{"attribute":"owner.username","operator":"","isCharacteristic":false,"value":"admin"}]},"username":"admin","encryptionKey":"foo"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isNumber(results.data.length);
        done();
      });
    });

    it('should execute a query with a simple filter and two join filters', function (done) {
      var sql = 'select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"ContactListItem","query":{"orderBy":[{"attribute":"lastName"}],"rowOffset":0,"rowLimit":50,"parameters":[{"attribute":"isActive","operator":"=","value":true},{"attribute":"account.number","operator":"","isCharacteristic":false,"value":"admin"},{"attribute":"owner.username","operator":"","isCharacteristic":false,"value":"admin"}]},"username":"admin","encryptionKey":"foo"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.equal(results.length, 0);
        done();
      });
    });

    it('should execute a query with an array of attributes', function (done) {
      var sql = 'select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"ContactListItem","query":{"orderBy":[{"attribute":"lastName"},{"attribute":"firstName"},{"attribute":"primaryEmail"}],"rowOffset":0,"rowLimit":50,"parameters":[{"attribute":["number","name","firstName","lastName","jobTitle","phone","alternate","fax","primaryEmail","webAddress","accountParent"],"operator":"MATCHES","value":"coltraine"},{"attribute":"isActive","operator":"=","value":true}]},"username":"admin","encryptionKey":"this is any content"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.equal(results.data.length, 1);
        done();
      });
    });

    it('should execute a query with two join filters on the same table', function (done) {
      var sql = 'select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"IncidentListItem","query":{"orderBy":[{"attribute":"priorityOrder"},{"attribute":"updated","descending":true},{"attribute":"number","descending":true,"numeric":true}],"rowOffset":0,"rowLimit":50,"parameters":[{"attribute":["owner.username","assignedTo.username"],"operator":"","isCharacteristic":false,"value":"admin"}]},"username":"admin","encryptionKey":"this is any content"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.equal(results.data.length, 4);
        done();
      });
    });

    it('should execute a query with an x.y join path when x.y.naturalKeyOfY is needed', function (done) {
      var sql = 'select xt.js_init(true);select xt.post($${"nameSpace":"XM","type":"ItemSiteListItem","dispatch":{"functionName":"fetch","parameters":{"orderBy":[{"attribute":"item.number"}],"rowOffset":0,"rowLimit":50,"parameters":[{"attribute":"isActive","operator":"=","value":true},{"attribute":"item.classCode","operator":"","isCharacteristic":false,"value":"TOYS-CARS"}]}},"encoding":"rjson","username":"admin","encryptionKey":"this is any content"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);
        assert.isNumber(results.length);
        done();
      });
    });

    it('should execute a query with ambiguous column filters', function (done) {
      var sql = 'select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"ToDoListItem","query":{"orderBy":[{"attribute":"priorityOrder"},{"attribute":"dueDate"},{"attribute":"name"}],"parameters":[{"attribute":"isActive","operator":"=","value":true},{"attribute":["owner.username","assignedTo.username"],"operator":"","isCharacteristic":false,"value":"admin"},{"attribute":"uuid","operator":"=","value":"23eef809-2f7c-4289-9eab-a72d621a6adb"}],"rowOffset":0,"rowLimit":50},"username":"admin","encryptionKey":"this is any content"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        done();
      });
    });

    it('should execute a query filtering on an orm-extended field', function (done) {
      var sql = 'select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"ProspectRelation","query":{"orderBy":[{"attribute":"number"}],"parameters":[{"attribute":"isActive","operator":"=","value":true}],"rowOffset":0,"rowLimit":50},"username":"admin","encryptionKey":"this is any content"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.equal(results.data.length, 1);
        done();
      });
    });

    it('should execute a simple item-site fetch', function (done) {
      var sql = 'select xt.js_init(true);select xt.post($${"nameSpace":"XM","type":"ItemSiteListItem","dispatch":{"functionName":"fetch","parameters":{"orderBy":[{"attribute":"item.number"}],"parameters":[{"attribute":"isActive","operator":"=","value":true}],"rowOffset":0,"rowLimit":50}},"username":"admin"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);
        assert.isNumber(results.length);
        done();
      });
    });

    it('should execute an item-site fetch', function (done) {
      var sql = 'select xt.js_init(true);select xt.post($${"nameSpace":"XM","type":"ItemSiteRelation","dispatch":{"functionName":"fetch","parameters":{"parameters":[{"attribute":"item.number","value":"BTRUCK1"},{"attribute":"site.code","value":"WH1"}]}},"username":"admin","encryptionKey":"this is any content"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);
        assert.equal(results.length, 1);
        done();
      });
    });

    it('should execute a complicated item-site fetch', function (done) {
      var sql = 'select xt.js_init(true);select xt.post($${"nameSpace":"XM","type":"ItemSiteRelation","dispatch":{"functionName":"fetch","parameters":{"parameters":[{"attribute":"item.isSold","value":true},{"attribute":"item.isActive","value":true},{"attribute":"isSold","value":true},{"attribute":"isActive","value":true},{"attribute":"site.code","value":"WH1"},{"attribute":"customer","value":"TTOYS"},{"attribute":["number","barcode"],"operator":"BEGINS_WITH","value":"bt","keySearch":true}],"orderBy":[{"attribute":"number"},{"attribute":"barcode"}],"rowLimit":1}},"username":"admin","encryptionKey":"this is any content"}$$)';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);
        assert.equal(results.length, 1);
        done();
      });
    });

    it('should be able to search item-site by number', function (done) {
      var sql = 'select xt.js_init(true);select xt.post($${"nameSpace":"XM","type":"ItemSiteListItem","dispatch":{"functionName":"fetch","parameters":{"orderBy":[{"attribute":"item.number"}],"rowOffset":0,"rowLimit":50,"parameters":[{"attribute":"isActive","operator":"=","value":true},{"attribute":"item.number","operator":"MATCHES","isCharacteristic":false,"value":"yt"}]}},"encoding":"rjson","username":"admin","encryptionKey":"foo"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);
        assert.isNumber(results.length);
        done();
      });
    });

    it('should be able to do an item-site search with a keysearch', function (done) {
      var sql = 'select xt.js_init(true);select xt.post($${"nameSpace":"XM","type":"ItemSiteRelation","dispatch":{"functionName":"fetch","parameters":{"parameters":[{"attribute":["number","barcode"],"operator":"BEGINS_WITH","value":"BTR","keySearch":true}],"orderBy":[{"attribute":"number"},{"attribute":"barcode"}],"rowLimit":10}},"username":"admin","encryptionKey":"this is any content"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);
        assert.isNumber(results.length);
        done();
      });
    });

    it('should be able to do a complex item-site search with a keysearch and join table parameters', function (done) {
      var sql = 'select xt.js_init(true);select xt.post($${"nameSpace":"XM","type":"ItemSiteRelation","dispatch":{"functionName":"fetch","parameters":{"parameters":[{"attribute":"item.isSold","value":true},{"attribute":"item.isActive","value":true},{"attribute":"isSold","value":true},{"attribute":"isActive","value":true},{"attribute":"site.code","value":"WH1"},{"attribute":"customer","value":"TTOYS"},{"attribute":["number","barcode"],"operator":"BEGINS_WITH","value":"btr","keySearch":true}],"orderBy":[{"attribute":"number"},{"attribute":"barcode"}],"rowLimit":10}},"username":"admin"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].post);
        assert.isNumber(results.length);
        done();
      });
    });

    it('should support a nested order-by', function (done) {
      var sql = 'select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"ItemSource","query":{"orderBy":[{"attribute":"vendorItemNumber"},{"attribute":"vendor.name"}],"parameters":[{"attribute":"isActive","value":true},{"attribute":"effective","operator":"<=","value":"2014-03-20T04:00:00.000Z"},{"attribute":"expires","operator":">=","value":"2014-03-22T01:18:09.202Z"}],"rowOffset":0,"rowLimit":50},"username":"admin","encryptionKey":"this is any content"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.isNumber(res.rowCount);
        results = JSON.parse(res.rows[1].get);
        assert.isNumber(results.data.length);
        done();
      });
    });

    it.skip('should support an ambiguous primary key', function (done) {
      var sql = 'select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"IssueToShipping","query":{"orderBy":[{"attribute":"lineNumber"},{"attribute":"subNumber"}],"parameters":[{"attribute":"order.uuid","operator":"=","value":"d3538bbd-826a-4351-b35c-795d7db99ba0"}],"rowOffset":0,"rowLimit":50},"username":"admin","encryptionKey":"this is any content"}$$);';

      if (!isCommercial) {
        // forget about it
        done();
        return;
      }

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.equal(results.length, 0);
        done();
      });
    });

    it('should allow the shortcut of querying a toOne directly by its natural key', function (done) {
      var sql = 'select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"IncidentListItem","query":{"orderBy":[{"attribute":"priorityOrder"},{"attribute":"updated","descending":true},{"attribute":"number","descending":true,"numeric":true}],"rowOffset":0,"rowLimit":50,"parameters":[{"attribute":"category","operator":"","isCharacteristic":false,"value":"Customer"},{"attribute":["owner.username","assignedTo.username"],"operator":"","isCharacteristic":false,"value":"admin"}]},"username":"admin","encryptionKey":"this is any content"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isNumber(results.data.length);
        done();
      });
    });

    it('should allow the shortcut of querying a toOne directly by its natural key with an attribute array', function (done) {
      var sql = 'select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"SalesOrderListItem","query":{"orderBy":[{"attribute":"number"}],"rowOffset":0,"rowLimit":50,"parameters":[{"attribute":["number","customerPurchaseOrderNumber","status","orderNotes","currency","billtoName","billtoCity","billtoState","billtoCountry","shiptoName","shiptoCity","shiptoState","shiptoCountry"],"operator":"MATCHES","value":"trem"},{"attribute":"status","value":"O"}]},"username":"admin","encryptionKey":"this is any content"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isNumber(results.data.length);
        done();
      });
    });

    it('should allow querying by characteristics', function (done) {
      var sql = 'select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"ContactListItem","query":{"orderBy":[{"attribute":"lastName"},{"attribute":"firstName"},{"attribute":"primaryEmail"}],"rowOffset":0,"rowLimit":50,"parameters":[{"attribute":"isActive","operator":"=","value":true},{"attribute":"CONTACT-BIRTHDAY","operator":"MATCHES","isCharacteristic":true,"value":"foo"}]},"username":"admin","encryptionKey":"this is any content"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.equal(results.length, 0);
        done();
      });
    });

    it('should work with an empty parameters list', function (done) {
      var sql = 'select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"IncidentListItem","query":{"parameters":[],"orderBy":[],"rowLimit":100},"username":"admin","encryptionKey":"xq5j2"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.equal(results.data.length, 4);
        done();
      });
    });

    it('should facilitate the count query', function (done) {
      var sql = 'select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"ContactListItem","query":{"count":true,"orderBy":[{"attribute":"lastName"}],"rowOffset":0,"rowLimit":50,"parameters":[{"attribute":"isActive","operator":"=","value":true},{"attribute":"owner.username","operator":"","isCharacteristic":false,"value":"admin"}]},"username":"admin","encryptionKey":"this is any content"}$$);';
      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isNumber(results.data[0].count);
        done();
      });
    });

    it('should allow an order-by on a toOne', function (done) {
      var sql = 'select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"TaxAssignment","query":{"orderBy":[{"attribute":"tax"}],"rowOffset":0,"rowLimit":50},"username":"admin","encryptionKey":"this is any content"}$$)';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.equal(results.data.length, 4);
        done();
      });
    });

    it('should correctly fix a long list of natural key attributes', function (done) {
      var sql = 'select xt.js_init();select xt.get($${"nameSpace":"XM","type":"IncidentListItem","query":{"orderBy":[{"attribute":"priorityOrder"},{"attribute":"updated","descending":true},{"attribute":"number","descending":true,"numeric":true}],"rowOffset":0,"rowLimit":50,"parameters":[{"attribute":["number","description","status","category","severity","priority","resolution","project"],"operator":"MATCHES","value":"Certify"},{"attribute":["owner.username","assignedTo.username"],"operator":"","isCharacteristic":false,"value":"admin"}]},"username":"admin","encryptionKey":"this is any content"}$$);';

      datasource.query(sql, creds, function (err, res) {
        var results;
        assert.isNull(err);
        assert.equal(1, res.rowCount, JSON.stringify(res.rows));
        results = JSON.parse(res.rows[1].get);
        assert.isNumber(results.data.length);
        done();
      });
    });


// incident plus
//select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"IncidentListItem","query":{"orderBy":[{"attribute":"priorityOrder"},{"attribute":"updated","descending":true},{"attribute":"number","descending":true,"numeric":true}],"rowOffset":0,"rowLimit":50,"parameters":[{"attribute":["owner.username","assignedTo.username"],"operator":"","isCharacteristic":false,"value":"admin"},{"attribute":"project","operator":"","isCharacteristic":false,"value":"GREENLEAF"},{"attribute":"foundIn","operator":"","isCharacteristic":false,"value":"d0e6c507-eac5-461c-f63e-91e352a3ffb1"}]},"username":"admin","encryptionKey":"this is any content"}$$)



// T&E
//select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"ProjectListItem","query":{"orderBy":[{"attribute":"number"}],"rowOffset":0,"rowLimit":50,"parameters":[{"attribute":["number","name","projectType","status","department"],"operator":"MATCHES","value":"foo"},{"attribute":"status","operator":"!=","value":"C"},{"attribute":"number","operator":"MATCHES","isCharacteristic":false,"value":"tre"},{"attribute":["owner.username","assignedTo.username"],"operator":"","isCharacteristic":false,"value":"admin"}]},"username":"admin","encryptionKey":"this is any content"}$$)
//select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"ItemRelation","query":{"parameters":[{"attribute":"projectExpenseMethod","operator":"=","value":"E"},{"attribute":"isActive","value":true},{"attribute":"number","operator":"BEGINS_WITH","value":"pro","keySearch":false}],"orderBy":[{"attribute":"number"}],"rowLimit":1},"username":"admin","encryptionKey":"this is any content"}$$)
//select xt.js_init(true);select xt.get($${"nameSpace":"XM","type":"ItemRelation","query":{"parameters":[{"attribute":"projectExpenseMethod","operator":"ANY","value":["E","A"]},{"attribute":"isActive","value":true},{"attribute":"number","operator":"BEGINS_WITH","value":"pro","keySearch":false}],"orderBy":[{"attribute":"number"}],"rowLimit":1},"username":"admin","encryptionKey":"this is any content"}$$)

  });
}());


