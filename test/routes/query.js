describe('Query', function () {
  var querylib, assert, RestQuery;

  before(function () {
    assert = require("chai").assert;
    querylib = require('../../node-datasource/lib/query');
    RestQuery = querylib.RestQuery;
  });

  it('is sane', function () {
    assert.ok(querylib);
    assert.ok(querylib.RestQuery);
    assert.ok(querylib.XtGetQuery);
    assert.ok(RestQuery);
  });

  describe('RestQuery', function () {
    it('#constructor', function () {
      var query = {
          attributes: {
            'customer.number': {
              EQUALS: 'XTRM'
            }
          }
        };

      assert.ok(querylib.RestQuery);
      var rq = new RestQuery(query);

      assert.ok(RestQuery.template);
      assert.isTrue(rq.isValid());
    });

    describe('#toTarget() -> XtGetQuery', function () {

    });
  });
});
