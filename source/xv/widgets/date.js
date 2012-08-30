/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, enyo:true, _:true, Globalize:true */

(function () {

  enyo.kind({
    name: "XV.Date",
    kind: "XV.Input",
    setValue: function (value, options) {
      value = _.isDate(value) ? new Date(value.valueOf()) : null;
      XV.Input.prototype.setValue.call(this, value, options);
    },
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
      } else if (value) {
        // Dates in the format of dates as we're used to them.
        // we're counting on JS to parse the date correctly
        date = new Date(value);
      }

      // Validate
      if (date) {
        if (isNaN(date.getTime())) {
          date = false;
        } else {
          date.setHours(0, 0, 0, 0);
        }
      }
      return date;
    },
    validate: function (value) {
      value = this.textToDate(value);
      return (_.isDate(value) || _.isEmpty(value)) ? value : false;
    },
    valueChanged: function (value) {
      if (value) {
        value = new Date(value.valueOf());
        value.setMinutes(value.getTimezoneOffset());
        value = Globalize.format(value, "d");
      } else {
        value = "";
      }
      return XV.Input.prototype.valueChanged.call(this, value);
    }
  });

  enyo.kind({
    name: "XV.DateWidget",
    kind: "XV.Date",
    classes: "xv-inputwidget xv-datewidget",
    published: {
      label: ""
    },
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-decorated-label"},
        {kind: "onyx.InputDecorator", name: "decorator",
          classes: "xv-input-decorator", components: [
          {name: "input", kind: "onyx.Input", onchange: "inputChanged",
            classes: "xv-subinput"},
          {name: "icon", kind: "onyx.IconButton", ontap: "iconTapped",
            src: "assets/date-icon.png"},
          {name: "datePickPopup", kind: "onyx.Popup", modal: true, components: [
            {kind: "GTS.DatePicker", name: "datePick", style: "", onChange: "datePicked"}
          ]}
        ]}
      ]}
    ],
    create: function () {
      this.inherited(arguments);
      this.labelChanged();
    },
    datePicked: function (inSender, inEvent) {
      this.setValue(inEvent);
      this.$.datePickPopup.hide();
    },
    iconTapped: function () {
      this.$.datePickPopup.show();
    },
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.attr || "").loc()) + ":";
      this.$.label.setContent(label);
    },
    valueChanged: function (value) {
      var dateValue = value;
      value = XV.Date.prototype.valueChanged.call(this, value);
      this.$.datePick.setValue(value ? dateValue : new Date());
      this.$.datePick.render();
    }
  });

}());
