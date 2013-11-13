exports.temp = function () {
describe('XM.Currency', function (done) {

  var usd, eur, gbp, base, asof,
    toEurRate, fromEurRate,
    toGbpRate, fromGbpRate;

  /**
   * Setup.
   */
  before(function (done) {
    this.timeout(10000);

    usd = XM.currencies.get('USD');
    eur = XM.currencies.get('EUR');
    gbp = XM.currencies.get('GBP');

    /**
     * Save GBP/EUR to/from rates.
     */
    toGbpRate   = XM.currencyRates.getScalarRate('from base to', gbp, new Date());
    fromGbpRate = XM.currencyRates.getScalarRate('to base from', gbp, new Date());

    toEurRate   = XM.currencyRates.getScalarRate('from base to', eur, new Date());
    fromEurRate = XM.currencyRates.getScalarRate('to base from', eur, new Date());

    asof = new Date();
    base = XM.baseCurrency;

    assert.ok(usd);
    assert.ok(eur);
    assert.ok(gbp);
    assert.ok(base);
    assert.isTrue(base.get('isBase'));
    assert.equal(base, usd);

    if (XM.currencyRates.length > 0) {
      done();
    }
    else {
      var onRates = XM.currencyRates.on('all', function () {
        if (XM.currencyRates.length > 0) {
          XM.currencyRates.off(onRates);
          done();
        }
      });
    }
  });

  /**
   * Tests for XM.Currency
   *
   * should include an asynchronous prototype function "toCurrency" that' +
   * accepts a "to" currency, a value, an as of date, and options. It' +
   * should return the receiver.', function () {
   *
   *  @see XM.Currency#toBase
   */
  describe('#toCurrency()', function (done) {
    this.timeout(5000);


    /**
     * If the value passed in is zero, then zero will be forwarded to
     * the callback. Since, irrespective of conversion rate, zero money
     * is zero.
     *
     * An asychronous "success" callback in options should pass back the
     * converted value of the currency
     */
    it('test conversion of zero coin', function (done) {
      var cur = eur.toCurrency(gbp, 0, asof, {
        success: function (result) {
          assert.equal(result, 0);
          done();
        }
      });
      assert.equal(cur, eur);
    });

    /**
     * If source and target currencies are the same, then there is no work to
     * do.
     */
    it('test same source and target currencies', function (done) {
      var localValue = Math.random() * 100,
        cur = eur.toCurrency(eur, localValue, asof, {
          success: function (result) {
            assert.equal(localValue, result);
            done();
          }
        });
      assert.equal(cur, eur);
    });

    /**
     * If/when a server request is made for the above, the server should cache
     * the results of these queries to avoid making duplicate requests.
     */
    it('rate query results are cached', function (done) {
      XM.currencyRates.reset([ ]);
      assert.equal(XM.currencyRates.length, 0);

      var localValue = Math.random() * 100,
        cur = eur.toCurrency(gbp, localValue, asof, {
          success: function (result) {
            assert.notEqual(result, 0);
            assert(XM.currencyRates.length > 0);
            assert.notEqual(XM.currencyRates.getScalarRate('to base from', eur, new Date()), NaN);
            assert.notEqual(XM.currencyRates.getScalarRate('from base to', gbp, new Date()), NaN);
            done();
          }
        });
      assert.equal(cur, eur);
    });

    /**
     * Test that a valid toCurrency request returns the correct result.
     */
    it('verify success callback returns correct result using maths', function (done) {
      var localValue = Math.random() * 100,
        expectedValue = (localValue * fromEurRate) * toGbpRate,
        cur = eur.toCurrency(gbp, localValue, asof, {
          success: function (result) {
            assert.notEqual(result, 0);
            assert.equal(result, expectedValue);
            done();
          }
        });
      assert.equal(cur, eur);
    });

    /**
     * Test that a request for an unknown currency returns an error.
     */
    it('return an error if the exchange rate cannot be determined', function (done) {
      var localValue = Math.random() * 100,
        cur = eur.toCurrency(new XM.Currency(), localValue, asof, {
          success: function (result) {
            assert.fail('success callback should not have been invoked');
          },
          error: function (err) {
            done();
          }
        });
      assert.equal(cur, eur);
    });
  });
  describe('XM.CurrencyRateCollection', function () {

    describe('#getScalarRate()', function () {

      /**
       * Determine the exchange rate for the to/from currencies where the asof
       * date is less than the expire date and greater than the effective date.
       */
      it('"to" rate is correctly found', function () {
        var gbpRate = XM.currencyRates.getScalarRate('from base to', gbp, new Date());
        var baseRate = XM.currencyRates.getScalarRate('from base to', usd, new Date());

        assert.equal(baseRate, 1);
        assert.ok(gbpRate);
        assert.notEqual(gbpRate, 1);
      });

      it('"from" rate is correctly found', function () {
        var eurRate = XM.currencyRates.getScalarRate('to base from', eur, new Date());
        var baseRate = XM.currencyRates.getScalarRate('to base from', usd, new Date());

        assert.equal(baseRate, 1);
        assert.ok(eurRate);
        assert.notEqual(eurRate, 1);
      });
    });
  });
});
};
