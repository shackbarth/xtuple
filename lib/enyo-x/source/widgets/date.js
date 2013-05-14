/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, enyo:true, _:true, Globalize:true */

(function () {

  /**
    @name XV.Date
	@class An input control used to specify a date.<br />
	Reformats and sets a date entered either as a date type or a string.
	If a string is not a recognizable date, sets the input to null.<br />
	The superkind of {@link XV.DateWidget}.
	@extends XV.Input
   */
  enyo.kind(/** @lends XV.Date# */{
    name: "XV.Date",
    kind: "XV.Input",
    /**
     Returns the value in the input field of the widget.
     */
    getValueToString: function (value) {
      return this.$.input.value;
    },
    /**
      Sets the value of date programatically.

      @param {Date|String} value Can be Date or String. However, if it's a string that doesn't
        look like a date, then it will be set to null.
      @param {Object} options
     */
    setValue: function (value, options) {
      if (value) {
        if (_.isString(value)) {
          value = this.validate(value);
        } else {
          value = new Date(value.valueOf()); // clone
        }

        if (isNaN(value.getTime())) {
          value = null;
        }
      } else {
        value = null;
      }
      XV.Input.prototype.setValue.call(this, value, options);
    },
    /**
     This function takes the value entered into a DateWidget and returns
     the correct date object for this value.  If the value does not correspond
     to a valid date, the function returns false.
     */
    textToDate: function (value) {
      var date = null,
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
        if (value.substring(1).length && !isNaN(value.substring(1))) {
          date = new Date();
          date.setMonth(0);
          date.setDate(value.substring(1));
        } else {
          date = false;
        }
      } else if (value.length && !isNaN(value)) {
        // A positive integer by itself means that day of this month

        date = new Date();
        date.setDate(value);

        // we want to cap this date to the current month (so that
        // a user can type in 99 to get the last day of the month)
        var lastDayOfMonth = new Date();
        lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
        lastDayOfMonth.setDate(0);
        if (lastDayOfMonth.getTime() < date.getTime()) {
          date = lastDayOfMonth;
        }
      // If we get to this point, we're assuming that either the user entered a date (maybe not in the right format).
      // or this is an invalid date
      } else if (value) {
        // Now we see if the user has provided a valid date. This is tricky because the JS Date sees values
        // like "%2345" as strings that can be parsed to a Date. Globalize.parsedate requires a
        // defined cultture and date format to parse more accurately
        if (value.length > 5 && !isNaN(value.charAt(0))) {
          date = new Date(value);
        } else {
          date = false;
        }
        
        // if this is valid date, make sure it is in the right format
        if (_.isDate(date)) {
          // Firefox does not assume that these dates are in the 2000s so there's a little trickery here
          if (date.getFullYear() < 2000) {
            date.setYear("20" + value.substring(value.length - 2));
          }
          
        } else {
          // otherwise it is a bad date and move on
          date = false;
        }
      }
      // Validate
      if (date) {
        if (isNaN(date.getTime())) {
          date = false;
        } else {
          date = this.applyTimezoneOffset(date);
        }
      }
      return date;
    },
    /**
      This function strips the time from a valid date and mimics the model's
      action of offseting the time by the timezone.
    */
    applyTimezoneOffset: function (value) {
      value.setHours(0, 0, 0, 0);
      return XT.date.applyTimezoneOffset(value, false);
    },
    /**
     This function calls textToDate, which converts the text to a valid date, it is 
     is possible. If it can't, then it fails validation.
     */
    validate: function (value) {
      value = this.textToDate(value);
      // if textToDate is not able to convert the entered value, it returns false
      return ((_.isDate(value) || _.isEmpty(value)) && value !== false) ? value : false;
    },
    /**
     @todo Document the valueChanged method.
     */
    valueChanged: function (value) {
      if (value) {
        value = XT.date.applyTimezoneOffset(value, true);
        value = Globalize.format(value, "d");
      } else {
        value = "";
      }
      return XV.Input.prototype.valueChanged.call(this, value);
    }
  });

  /**
    @name XV.DateWidget
    @class An input control consisting of fittable columns.<br />
    Use to implement a styled input field for entering a date
    including associated popup menu for selecting a date.<br />
	Creates an HTML input element.
    @extends XV.Date
   */
  enyo.kind(/** @lends XV.DateWidget# */{
    name: "XV.DateWidget",
    kind: "XV.Date",
    classes: "xv-inputwidget xv-datewidget",
    published: {
      label: "",
      showLabel: true
    },
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-decorated-label"},
        {kind: "onyx.InputDecorator", name: "decorator",
          classes: "xv-input-decorator", components: [
          {name: "input", kind: "onyx.Input", onchange: "inputChanged",
            classes: "xv-subinput", onkeydown: "keyDown"},
          {kind: "onyx.MenuDecorator", components: [
            {name: "icon", kind: "onyx.IconButton", ontap: "iconTapped",
              src: "/client/lib/enyo-x/assets/date-icon.png"},
            {name: "datePickPopup", kind: "onyx.Menu", maxHeight: 400, modal: true, floating: true,
                style: "min-width:400px;",
                components: [
              {kind: "GTS.DatePicker", name: "datePick", onChange: "datePicked"}
            ]}
          ]}
        ]}
      ]}
    ],
    /**
     @todo Document create method.
     */
    create: function () {
      this.inherited(arguments);
      this.labelChanged();
      this.showLabelChanged();
    },
    /**
     @todo Dcoument datePicked method.
     */
    datePicked: function (inSender, inEvent) {
      var date = inEvent;
      
      // mimic the human-typed behavior
      this.applyTimezoneOffset(date);

      this.setValue(date);
      this.$.datePickPopup.hide();
    },
    /**
    @todo Document iconTapped method.
    */
    iconTapped: function (inSender, inEvent) {
      this.$.datePick.render();
    },
    /**
     @todo Document keyDown method.
     */
    keyDown: function (inSender, inEvent) {
      // XXX hack here (and in other places that reference issue 18397)
      // can be removed once enyo fixes ENYO-1104
      var shadowNone = inEvent.originator.hasClass("text-shadow-none");
      inEvent.originator.addRemoveClass("text-shadow-none", !shadowNone);
      inEvent.originator.addRemoveClass("text-shadow-0", shadowNone);
      // end hack
    },
    /**
     @todo Document labelChanged method.
     */
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.attr || "").loc()) + ":";
      this.$.label.setContent(label);
    },
    /**
     @todo Document showLabelChanged method.
     */
    showLabelChanged: function () {
      if (this.getShowLabel()) {
        this.$.label.show();
      } else {
        this.$.label.hide();
      }
    },
    /**
     @todo Document valueChanged method.
     */
    valueChanged: function (value) {
      var dateValue = value;
      value = XV.Date.prototype.valueChanged.call(this, value);
      if (!this.$.input.value && this.$.input.attributes.value) {
        // XXX workaround for incident 19171. Something deep into enyo's
        // setters are causing the attributes value to be updated when
        // a value is entered but not updated when the empty string is
        // entered. Seems to only affect date widgets due to the complicated
        // two-step of turning a inputted value into an actual date.
        this.$.input.attributes.value = "";
      }
      this.$.datePick.setValue(value ? dateValue : new Date());
      this.$.datePick.render();
    }
  });

}());
