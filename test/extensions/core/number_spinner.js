/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true,
  describe:true, before:true, enyo:true, it:true, beforeEach:true */

(function () {
  "use strict";

  var zombieAuth = require("../../lib/zombie_auth"),
    assert = require("chai").assert;

  describe('Number Spinner Widget', function () {
    this.timeout(45 * 1000);
    var K, widget;

    before(function (done) {
      // setup for the date widget
      var initializeWidget = function () {
        K = enyo.kind({kind: XV.NumberSpinnerWidget});
        widget = new K();
        assert.isDefined(XV.NumberSpinnerWidget);
        done();
      };
      zombieAuth.loadApp(initializeWidget);
    });

    // reset the date before each test
    beforeEach(function () {
      widget.$.input.setValue(0);
      widget.$.slider.setValue(0);
    });

    describe('Test widget functions', function () {

      it('Test increase function', function () {
        widget.increase();
        assert.equal(widget.$.input.getValue(), 1);
        assert.equal(widget.$.slider.getValue(), 1);
      });

      it('Test decrease on zero', function () {
        widget.decrease();
        // no negative values
        assert.equal(widget.$.input.getValue(), 0);
        assert.equal(widget.$.slider.getValue(), 0);
      });

      it('Test decrease function', function () {
        // set values
        widget.$.input.setValue(100);
        widget.$.slider.setValue(100);
        widget.decrease();

        assert.equal(widget.$.input.getValue(), 99);
        assert.equal(widget.$.slider.getValue(), 99);
      });

      it('Test max value', function () {
        // set values
        widget.$.input.setValue(widget.getMaxValue());
        widget.$.slider.setValue(widget.getMaxValue());
        // increase function
        widget.increase();

        assert.equal(widget.$.input.getValue(), widget.getMaxValue());
        assert.equal(widget.$.slider.getValue(), widget.getMaxValue());
      });
    });
  });

}());
