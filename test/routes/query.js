describe('Query', function () {
  var querylib, assert,
    RestQuery,
    FreeTextQuery,
    XtGetQuery;

  before(function () {
    assert = require("chai").assert;
    querylib = require('../../node-datasource/lib/query');
    RestQuery = querylib.RestQuery;
    FreeTextQuery = querylib.FreeTextQuery;
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

  describe('SourceQuery', function () {
    describe('FreeTextQuery', function () {
      var simpleQuery1 = {
          q: 'free text search'
        },
        compoundQuery1 = {
          q: 'important',
          orderby: {
            'id': 'desc'
          },
          maxresults: 10
        },
        invalidQuery1 = {
          attributes: {
            'customer.number': { EQUALS: 'XTRM' },
            'amount': { BETTER_THAN: 'you' }
          }
        },
        mockSchema = {
          columns: [
            { name: 'id', category: 'N' },
            { name: 'name', category: 'S' },
            { name: 'color', category: 'S' }
          ]
        };
      it('is sane', function () {
        assert.isFunction(FreeTextQuery);
        assert.isObject(FreeTextQuery.template);
        assert.isTrue(_.test(FreeTextQuery.template, simpleQuery1));
      });
      describe('@constructor', function () {
        it('should create a simple query', function () {
          var freeQuery = new FreeTextQuery(simpleQuery1);

          assert.ok(FreeTextQuery.template);
          assert.isTrue(freeQuery.isValid());
        });
      });
      describe('#isValid()', function () {
        it('should validate a simple query', function () {
          var rq1 = new FreeTextQuery(simpleQuery1);
          assert.isTrue(rq1.isValid());
        });
        it('should validate a compound query', function () {
          var rq1 = new FreeTextQuery(compoundQuery1);
          assert.isTrue(rq1.isValid());
        });
        it('should invalidate a nonsense query', function () {
          var rq1 = new FreeTextQuery({ crap: null });
          assert.isFalse(rq1.isValid());
        });
        it('should invalidate a plausible but bad query', function () {
          var rq1 = new FreeTextQuery(invalidQuery1);
          assert.isFalse(rq1.isValid());
        });
      });
      describe('#toTarget()', function () {
        describe.skip('@param XtGetQuery', function () {
          it('should translate simple query', function () {
            var fq1 = new FreeTextQuery(simpleQuery1);

            assert.isTrue(fq1.toTarget(XtGetQuery, { schema: mockSchema }).isValid());
          });
          it('should translate compound query', function () {
            var fq1 = new FreeTextQuery(compoundQuery1),
              target = fq1.toTarget(XtGetQuery, { schema: mockSchema });

            assert.isTrue(target.isValid());
            assert.isArray(target.query.parameters);
            assert.isArray(target.query.orderBy);
            assert.isNumber(target.query.rowLimit);
          });
        });
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
            'customer.number': { EQUALS: 'XTRM' }
          },
          orderby: {
            'customer.number': 'desc'
          }
        },
        compoundQuery1 = {
          attributes: {
            'customer.number': { EQUALS: 'XTRM' },
            'amount': { GREATER_THAN: 5000 }
          },
          orderby: {
            'customer.number': 'desc'
          },
          maxresults: 50,
          pagetoken: 5
        },
        countQuery1 = {
          attributes: {
            'customer.number': { EQUALS: 'XTRM' },
            'amount': { GREATER_THAN: 5000 }
          },
          count:true
        },
        invalidQuery1 = {
          attributes: {
            'customer.number': { EQUALS: 'XTRM' },
            'amount': { BETTER_THAN: 'you' }
          }
        },
        falseyCountQuery1 = {
          attributes: {
            'customer.number': { EQUALS: 'XTRM' },
            'amount': { GREATER_THAN: 5000 }
          },
          count:"yes"
        };

      it('is sane', function () {
        assert.isFunction(RestQuery);
        assert.isObject(RestQuery.template);
        assert.isTrue(_.test(RestQuery.template, simpleQuery1));
      });
      describe('@constructor', function () {
        it('should create a simple query', function () {
          var rq = new RestQuery(simpleQuery1);

          assert.ok(RestQuery.template);
          assert.isTrue(rq.isValid());
        });
      });

      describe('#isValid()', function () {
        it('should validate a simple query', function () {
          var rq1 = new RestQuery(simpleQuery1),
              rq2 = new RestQuery(simpleQuery2);
          assert.isTrue(rq1.isValid());
          assert.isTrue(rq2.isValid());
        });
        it('should validate a compound query', function () {
          var rq1 = new RestQuery(compoundQuery1);
          assert.isTrue(rq1.isValid());
        });
        it('should validate a count query', function () {
          var rq1 = new RestQuery(countQuery1);
          assert.isTrue(rq1.isValid());
        });
        it('should invalidate a nonsense query', function () {
          var rq1 = new RestQuery({ crap: null });
          assert.isFalse(rq1.isValid());
        });
        it('should invalidate a plausible but bad query', function () {
          var rq1 = new RestQuery(invalidQuery1);
          assert.isFalse(rq1.isValid());
        });
      });

      describe('#toTarget()', function () {
        describe('@param XtGetQuery', function () {
          it('should translate a simple query', function () {
            var rq1 = new RestQuery(simpleQuery1),
                rq2 = new RestQuery(simpleQuery2);

            assert.isTrue(rq1.toTarget(XtGetQuery).isValid());
            assert.isTrue(rq2.toTarget(XtGetQuery).isValid());
          });
          it('should translate a compound query', function () {
            var rq1 = new RestQuery(compoundQuery1),
              target = rq1.toTarget(XtGetQuery);

            assert.isTrue(target.isValid());
            assert.isArray(target.query.parameters);
          });
          it('should translate a truthy count query', function () {
            var rq1 = new RestQuery(countQuery1),
              target = rq1.toTarget(XtGetQuery);

            assert.isTrue(target.isValid());
            assert.isTrue(target.query.count);
          });
          it('should translate a falsey count query', function () {
            var rq1 = new RestQuery(falseyCountQuery1),
              target = rq1.toTarget(XtGetQuery);

            assert.isTrue(target.isValid());
            assert.isUndefined(target.query.count);
          });
        });
      });
    });
  });
  describe('TargetQuery', function () {
    describe('XtGetQuery', function () {
      var simpleTarget1 = {
        // copied from pgadmin
        "orderBy":[
          {"attribute":"number"}
        ],
        "rowOffset":0,
        "rowLimit":50,
        "count":false,
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
  });
});
