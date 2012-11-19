/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, enyo:true, _:true, Globalize:true */

(function () {

  /**
    @class
    @name XV.Date
    @extends XV.Input
    @see XV.DateWidget
   */
  enyo.kind(/** @lends XV.Date# */{
    name: "XV.Date",
    kind: "XV.Input",
    /**
     @todo Document the getValueToString method.
     */
    getValueToString: function (value) {
      return this.$.input.value;
    },
    /**
      Sets the value of date programatically.

      @param {Date | String} Can be Date or String. However, if it's a string that doesn't
        look like a date, then it will be set to null.
      @param {Object} options
     */
    setValue: function (value, options) {
      if (value) {
        if (typeof value === 'string') {
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
     @todo Document the textToDate method.
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
        date = new Date();
        date.setMonth(0);
        date.setDate(value.substring(1));
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

      } else if (value) {
        // Dates in the format of dates as we're used to them.
        // we're counting on JS to parse the date correctly
        date = new Date(value);

        // assume two-digit dates are in the 2000's. Firefox does not do
        // this automatically
        if (date.getFullYear() < 2000 && isNaN(value.substring(value.length - 4))) {
          // this is not perfect code. We assume that if the last four digits are not
          // numeric then they're something like "4/12", but maybe they're junky. Then again,
          // I don't want to assume that the user will use a slash to separate month from year.
          date.setYear("20" + value.substring(value.length - 2));
        }
      }

      // Validate
      if (date) {
        if (isNaN(date.getTime())) {
          date = false;
        } else {
          // these dates are represented without the time, so
          // strip that off here
          date.setHours(0, 0, 0, 0);
          // the model offsets this date by the timezone by the time
          // it arrives here, so we need to mimic that action here
          // for user input
          date = XT.date.applyTimezoneOffset(date, false);
        }
      }
      return date;
    },
    /**
     @todo Document the validate method.
     */
    validate: function (value) {
      value = this.textToDate(value);
      return (_.isDate(value) || _.isEmpty(value)) ? value : false;
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
    @class
    @name XV.DateWidget
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
              src: "lib/enyo-x/assets/date-icon.png"},
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
      date.setHours(0, 0, 0, 0);
      date = XT.date.applyTimezoneOffset(date, false);

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
      this.$.datePick.setValue(value ? dateValue : new Date());
      this.$.datePick.render();
    }
  });

}());
