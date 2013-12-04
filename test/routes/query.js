describe('Query', function () {
  var querylib, assert,
    RestQuery,
    XtGetQuery;

  before(function () {
    assert = require("chai").assert;
    querylib = require('../../node-datasource/lib/query');
    RestQuery = querylib.RestQuery;
    XtGetQuery = querylib.XtGetQuery;
  });

  it('is sane', function () {
    assert.ok(querylib);
    assert.ok(querylib.RestQuery);
    assert.ok(querylib.XtGetQuery);
    assert.ok(RestQuery);
    assert.ok(XtGetQuery);

    // api should not directly expose Query
    assert.isUndefined(querylib.Query);
  });

  describe('XtGetQuery', function () {
    var simpleTarget1 = {
      // copied from pgadmin
      "orderBy":[
        {"attribute":"number"}
      ],
      "rowOffset":0,
      "rowLimit":50,
      "parameters":[
        {"attribute":"isPosted","operator":"=","value":true},
        {"attribute":"invoiceDate","operator":">=","isCharacteristic":false,"value":"2000-12-03T00:00:00.000Z"}
      ]
    };
    it('is sane', function () {
      assert.isFunction(XtGetQuery);
      assert.isObject(XtGetQuery.template);
      assert.isTrue(_.test(XtGetQuery.template, simpleTarget1));
    });
  });

  describe('RestQuery', function () {
    var simpleQuery1 = {
        attributes: {
          'customer.number': {
            EQUALS: 'XTRM'
          }
        }
      },
      simpleQuery2 = {
        attributes: {
          'customer.number': {
            EQUALS: 'XTRM'
          }
        },
        orderby: {
          'customer.number': 'desc'
        }
      },
      simpleQuery3 = {
        attributes: { 'order.number': { EQUALS: '50249' } }
      };

    it('is sane', function () {
      assert.isFunction(RestQuery);
      assert.isObject(RestQuery.template);
      assert.isTrue(_.test(RestQuery.template, simpleQuery1));
    });
    describe('@constructor', function () {
      it('can create a simple query', function () {
        var rq = new RestQuery(simpleQuery1);

        assert.ok(RestQuery.template);
        assert.isTrue(rq.isValid());
      });
    });

    describe('#isValid()', function () {
      it('can validate a simple query', function () {

      });
    });

    describe('#toTarget()', function () {
      describe('@param XtGetQuery', function () {
        it('can translate simple query', function () {
          var rq1 = new RestQuery(simpleQuery1),
              rq2 = new RestQuery(simpleQuery2),
              rq3 = new RestQuery(simpleQuery3);

          assert.isTrue(rq1.toTarget(XtGetQuery).isValid());
          assert.isTrue(rq2.toTarget(XtGetQuery).isValid());
          assert.isTrue(rq3.toTarget(XtGetQuery).isValid());
        });
      });
    });
  });
});
