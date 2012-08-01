/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, enyo:true, _:true, Globalize:true */

(function () {
  "use strict";

  enyo.kind({
    name: "XV.DateWidget",
    kind: enyo.Control,
    classes: "xv-widgets-date",
    published: {
      value: null
    },
    events: {
      onchange: ""
    },
    components: [{
      kind: "onyx.InputDecorator",
      name: "decorator",
      classes: "xv-input-decorator",
      components: [
        {
          kind: "onyx.Input",
          name: "input",
          classes: "xv-input-field",
          onchange: "inputChanged",
          onkeyup: "keyup"
        },
        {
          kind: "Image",
          name: "icon",
          classes: "xv-field-icon",
          src: "images/date-icon.jpg",
          ontap: "iconTapped"
        },
        {
          kind: "onyx.Popup",
          name: "datePickPopup",
          classes: "xv-field-popup",
          modal: true,
          components: [
            { kind: "GTS.DatePicker", name: "datePick", style: "", onChange: "datePicked" }
          ]
        }
      ]
    }],
    datePicked: function (inSender, inEvent) {
      // Pass a clone to the backing object of this widget.
      this.setValue(new Date(inEvent.valueOf()));
      this.$.datePickPopup.hide();
    },
    inputChanged: function (inSender, inEvent) {
      this.setValue(this.textToDate(this.$.input.getValue()));
      this.bubble("onchange", inEvent);
    },
    /**
      Treat enter like a tab out of the field.
    */
    keyup: function (inSender, inEvent) {
      if (inEvent.keyCode === 13) {
        this.doInputChanged();
      }
    },
    iconTapped: function () {
      this.$.datePickPopup.show();
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
        // a positive integer by itself means that day of this month
        date = new Date();
        date.setDate(value);

      } else {
        // dates in the format of dates as we're used to them.
        // we're counting on JS to parse the date correctly
        date = new Date(value);
      }
      return isNaN(date.getTime()) ? null : date;
    },
    setDisabled: function (isDisabled) {
      this.$.decorator.setDisabled(isDisabled);
    },
    valueChanged: function () {
      var date = _.isDate(this.getValue()) ? new Date(this.getValue().valueOf()) : null;
      if (date) {
        this.$.datePick.setValue(date);
        this.$.datePick.render();
        this.$.input.setValue(Globalize.format(this.value, "d"));
      } else {
        this.$.datePick.setValue(new Date());
        this.$.datePick.render();
        this.$.input.setValue("");        
      }
    }
  });
  
}());
