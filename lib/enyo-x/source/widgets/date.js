/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, enyo:true, _:true, Globalize:true */

(function () {

  /**
    @name XV.DateWidget
	@class An input control used to specify a date.<br />
	Reformats and sets a date entered either as a date type or a string.
	If a string is not a recognizable date, sets the input to null.<br />
	The superkind of {@link XV.DateWidget}.
	@extends XV.Input
   */
  enyo.kind(
    /** @lends XV.DateWidget# */{
    name: "XV.DateWidget",
    kind: "XV.InputWidget",
    classes: "xv-input xv-datewidget",
    published: {
      attr: null,
      nullValue: null,
      nullText: ""
    },
    components: [
      {controlClasses: 'enyo-inline', components: [
        {name: "label", classes: "xv-label"},
        {kind: "onyx.InputDecorator", name: "decorator", tag: "div",
          classes: "xv-icon-decorator", components: [
          {name: "input", kind: "onyx.Input", onchange: "inputChanged",
            onkeydown: "keyDown"},
          {name: "icon", kind: "onyx.Icon", ontap: "iconTapped",
            classes: "icon-calendar"}
        ]},
        {name: "datePickPopup", kind: "onyx.Popup", maxHeight: 400, floating: true,
            centered: true, modal: true, components: [
          {kind: "GTS.DatePicker", name: "datePick", style: "min-width:400px;",
            onChange: "datePicked"}
        ]}
      ]}
    ],

    /**
     This function handles a date chosen via the
     datepicker versus text entered into the input field.
     */
    datePicked: function (inSender, inEvent) {
      var date = inEvent, options = {};
      // mimic the human-typed behavior
      this.applyTimezoneOffset(date);

      options.silent = true;
      this.setValue(date, options);
      this.$.datePickPopup.hide();
      this.$.input.focus();
    },
    disabledChanged: function () {
      this.inherited(arguments);
      this.$.label.addRemoveClass("disabled", this.getDisabled());
    },
    /**
      This function handles the click of the calendar icon
      that opens the datepicker.
    */
    iconTapped: function (inSender, inEvent) {
      this.$.datePickPopup.show();
      this.$.datePick.render();
    },
    /**
     Returns the value in the input field of the widget.
     */
    getValueToString: function (value) {
      return this.$.input.value;
    },
    /**
      Sets the value of date programatically.

      @param {Date|String} value Can be Date or Date String
      @param {Object} options
     */
    setValue: function (value, options) {
      var nullValue = this.getNullValue();
      if (value) {
        if (_.isString(value)) {
          value = this.validate(value);
        } else {
          value = new Date(value.valueOf()); // clone
        }
        if (isNaN(value.getTime())) {
          value = nullValue;
        }
      } else {
        value = nullValue;
      }
      XV.InputWidget.prototype.setValue.call(this, value, options);
    },
    /**
     This function takes the value entered into a DateWidget and returns
     the correct date object for this value.  If the value does not correspond
     to a valid date, the function returns false.
     */
    textToDate: function (value) {
      var date = false,
        daysInMilliseconds = 1000 * 60 * 60 * 24;

      // Try to parse out a date given the various allowable shortcuts
      if (value === '0' ||
        value.indexOf('+') === 0 ||
        value.indexOf('-') === 0) {
        // 0 means today, +1 means tomorrow, -2 means 2 days ago, etc.
        date = new Date(new Date().getTime() + value * daysInMilliseconds);
      } else if (value.indexOf('#') === 0) {
        // #40 means the fortieth day of this year, so set the month to 0
        // and set the date accordingly. JS appropriately pushes the date
        // into subsequent months as necessary
        // Only allow number strings and not "" after the "#"
        if (/^\d+$/.test(value.substring(1))) {
          date = new Date();
          date.setMonth(0);
          date.setDate(value.substring(1));
        }
      } else if (value.length && !isNaN(value)) {
        // A positive integer by itself means that day of this month
        date = new Date();
        date.setDate(value);

        // This number is limited to the number of days in the current month.
        // If the user enters 60, the date will be the last day of the month.
        var lastDayOfMonth = new Date();
        lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
        lastDayOfMonth.setDate(0);
        if (lastDayOfMonth.getTime() < date.getTime()) {
          date = lastDayOfMonth;
        }

      // If we get to this point, we're assuming that either the user is trying to enter a date
      // and not one of the functions. We allow the JS Date to parse the date so we can allow
      // many formats.
      } else if (value) {
        // Here we are trying to leniently limit what we pass to the JS Date function since it evaluates
        // invalid strings such as "%1678" as a date. It may still allow some crazy strings, but these will
        // return an Invalid Date object and we will catch it later. If we need more stingent checking, we
        // would have to lock the users into entering dates in a specific format.
        if (/^\d+[\/\-\.]\d+[\/\-\.]\d+/.test(value)) {
          date = new Date(value);
        }
      }

      // Check here to see if date is actually a Date. If it is "Invalid Date", then it may
      // pass _.isDate and still not truly be a valid Date object.
      if (!_.isDate(date) || isNaN(date.getTime())) {
        return false;
      }

      // TODO: This little hacky block of code was making all years < 2000 convert to 2000s
      // Firefox does not assume that these dates are in the 2000s so there's a little trickery here
      // if (date.getFullYear() < 2000) {
      //   date.setYear("20" + value.substring(value.length - 2));
      // }

      // Validate
      if (date) {
        date = this.applyTimezoneOffset(date);
      }
      return date;
    },
    /**
      This function strips the time from a valid date and mimics the model's
      action of offseting the time by the timezone for the sake of what the user
      sees populated in the input box. This action is undone just before the value
      is set into the model.
    */
    applyTimezoneOffset: function (value) {
      value.setHours(0, 0, 0, 0);
      return XT.date.applyTimezoneOffset(value, false);
    },
    /**
     This function calls textToDate, which converts the text to a valid date,
     if possible.
     */
    validate: function (value) {
      value = this.textToDate(value);
      // if textToDate is not able to convert the entered value, it returns false
      return ((_.isDate(value) || _.isEmpty(value)) && value !== false) ? value : false;
    },
    /**
      This function puts the date in the correct format based on the locale set in Globalize.
      It also puts back the timezoneoffset that was done in the validation function before it
      sends the value to the model.
     */
    valueChanged: function (value) {
      var nullValue = this.getNullValue();
      if (_.isDate(value) && _.isDate(nullValue) &&
          XT.date.compareDate(value, nullValue) === 0) {
        value = this.getNullText();
      } else if (value) {
        value = XT.date.applyTimezoneOffset(value, true);
        value = Globalize.format(value, "d");
      } else {
        value = "";
      }

      if (!this.$.input.value && this.$.input.attributes.value) {
        // XXX workaround for incident 19171. Something deep into enyo's
        // setters are causing the attributes value to be updated when
        // a value is entered but not updated when the empty string is
        // entered. Seems to only affect date widgets due to the complicated
        // two-step of turning a inputted value into an actual date.
        this.$.input.attributes.value = "";
      }

      this.$.datePick.setValue(value ? value : new Date());
      this.$.datePick.render();

      return XV.InputWidget.prototype.valueChanged.call(this, value);
    }
  });

}());
