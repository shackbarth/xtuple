/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, Backbone:true, enyo:true, XT:true */

(function () {
  "use strict";


  // these are all worth running with the browsers in different time zones as well
  enyo.kind({
    name: "XV.DateTest",
    kind: "enyo.TestSuite",
    components: [
      { kind: "XV.DateWidget", name: "dateWidget" }
    ],
    getObj: function () {
      return this.$.dateWidget;
    },
    testCorrectCenturyFourDigit: function () {
      this.getObj().setValue("1/5/1812");
      this.finish(XV.applyTest(1812, this.getObj().getValue().getFullYear(), "Four-digit years should be taken at face value"));
    },
    testCorrectCenturyTwoDigit: function () {
      this.getObj().setValue("1/5/12");
      this.finish(XV.applyTest(2012, this.getObj().getValue().getFullYear(), "Two-digit years should be assumed to be in the 2000's"));
    },

    // the trick with a lot of these tests is that the date value behind the widget is stored with the timezone
    // offset applied, so it might be off by several hours depending on where your browser is. So we
    // test it by offsetting the offset and making sure it's still right.
    testSetValueAsString: function () {
     var dateString = Globalize.format(new Date("1/5/2012"), "d"),
        dateValue, test1, test2;

      this.getObj().setValue(dateString);
      dateValue = this.getObj().getValue();
      test1 = XV.applyTest(dateString, this.getObj().$.input.getValue(), "Input should show as 1/5");
      test2 = XV.applyTest(5, XT.date.applyTimezoneOffset(dateValue, true).getDate());

      this.finish(test1 || test2);
    },
    testSetValueAsStringShortcut: function () {
      var dateValue, offsetDateValue;
      this.getObj().setValue("#5");

      dateValue = this.getObj().getValue();
      offsetDateValue = XT.date.applyTimezoneOffset(dateValue, true);
      this.finish(XV.applyTest(5, offsetDateValue.getDate(), offsetDateValue));
    },
    testSetValue: function () {
      var dateString = Globalize.format(new Date("1/5/2012"), "d"),
        // setting the timezone offset is effectively what the model does, so mimic that.
        date = XT.date.applyTimezoneOffset(new Date(dateString)),
        dateValue,
        offsetDateValue,
        test1,
        test2;

      this.getObj().setValue(date);

      dateValue = this.getObj().getValue();
      offsetDateValue = XT.date.applyTimezoneOffset(date, true);
      test1 = XV.applyTest(dateString, this.getObj().$.input.getValue(), "Input should show as 1/5");
      test2 = XV.applyTest(5, XT.date.applyTimezoneOffset(dateValue, true).getDate());

      this.finish(test1 || test2);
    },
    testInputChanged: function () {
      var dateValue, offsetDateValue;

      this.getObj().$.input.setValue("1/5/2012");
      this.getObj().inputChanged();

      dateValue = this.getObj().getValue();
      offsetDateValue = XT.date.applyTimezoneOffset(dateValue, true);

      this.finish(XV.applyTest(5, offsetDateValue.getDate(), dateValue + " " + offsetDateValue));
    },
    testInputChangedShortcut: function () {
      var dateValue, offsetDateValue;

      this.getObj().$.input.setValue("#5");
      this.getObj().inputChanged();

      dateValue = this.getObj().getValue();
      offsetDateValue = XT.date.applyTimezoneOffset(dateValue, true);

      this.finish(XV.applyTest(5, offsetDateValue.getDate(), offsetDateValue));
    },
    testDatePickerInput: function () {
      var dateValue, offsetDateValue;

      this.getObj().datePicked(null, new Date("1/5/2012"));

      dateValue = this.getObj().getValue();
      offsetDateValue = XT.date.applyTimezoneOffset(dateValue, true);

      this.finish(XV.applyTest(5, offsetDateValue.getDate(), offsetDateValue));
    }
  });
}());
