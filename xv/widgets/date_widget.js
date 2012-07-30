/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, enyo:true, _:true, Globalize:true */
(function () {
  "use strict";

  enyo.kind({
    name: "XV.DateWidget",
    kind: enyo.Control,
    published: {
      dateObject: null
    },
    components: [{
      kind: "onyx.InputDecorator",
      style: "height: 14px;",
      components: [
        {
          kind: "onyx.TextArea",
          name: "dateField",
          placeholder: "Enter date",
          onchange: "doInputChanged",
          onkeyup: "doKeyup"
        },
        { kind: "Image", name: "iconImage", src: "images/date-icon.jpg", ontap: "doIconTapped" },
        {
          kind: "onyx.Popup",
          name: "datePickPopup",
          modal: true,
          floating: true,
          components: [
            { kind: "GTS.DatePicker", name: "datePick", style: "", onChange: "doDatePicked" }
          ]
        }
      ]
    }],
    /**
     * A convenience function so that this object can be treated generally like an input
     */
    setValue: function (date) {
      this.setDateObject(date);
    },
    /**
     * A convenience function so that this object can be treated generally like an input
     */
    getValue: function () {
      return this.getDateObject();
    },
    setDisabled: function (isDisabled) {
      this.$.dateField.setDisabled(isDisabled);
      if (isDisabled) {
        this.$.iconImage.setStyle("visibility: hidden");
      } else {
        this.$.iconImage.setStyle("visibility: visible");
      }
    },
    dateObjectChanged: function () {
      this.$.datePick.setValue(new Date(this.getDateObject().valueOf()));
      this.$.datePick.render();
      this.$.dateField.setValue(Globalize.format(this.dateObject, "d"));
    },
    doInputChanged: function () {
      // lucky: no infinite loop! This function only gets triggered from an
      // actual user input, and not if the field is changed via the dateObjectChanged
      // function
      this.setDateObject(this.textToDate(this.$.dateField.getValue()));
    },
    textToDate: function (value) {
      var date = null;
      var daysInMilliseconds = 1000 * 60 * 60 * 24;
      //
      // Try to parse out a date given the various allowable shortcuts
      //
      if (value === '0' ||
        value.indexOf('+') === 0 ||
        value.indexOf('-') === 0) {
        // 0 means today, +1 means tomorrow, -2 means 2 days ago, etc.
        date = new Date(new Date().getTime() + value * daysInMilliseconds);

      } else if (value.indexOf('#') === 0) {
        // #40 means the fortieth day of this year, so set the month to 0
        // and set the date accordingly. JS appropriately pushes the date
        // into subsequent months as necessary
        date = new Date();
        date.setMonth(0);
        date.setDate(value.substring(1));

      } else if (value.length && !isNaN(value)) {
        // a positive integer by itself means that day of this month
        date = new Date();
        date.setDate(value);

      } else {
        // dates in the format of dates as we're used to them.
        // we're counting on JS to parse the date correctly
        date = new Date(value);
      }
      return date;
    },
    doIconTapped: function () {
      this.$.datePickPopup.show();
    },
    doDatePicked: function (inSender, inEvent) {
      /**
       * Pass a clone to the backing object of this widget. If we assign the
       * variable itself then the widget and the popup will share the same date
       * object, which we might not want.
       */
      this.setDateObject(new Date(inEvent.valueOf()));
      this.$.datePickPopup.hide();
    },
    /**
     * Treat enter like a tab out of the field.
     * XXX it would be nice if this also moved the cursor focus to the next field
     */
    doKeyup: function (inSender, inEvent) {
      if (inEvent.keyCode === 13) {
        this.doInputChanged();
      }
    }
  });
}());
