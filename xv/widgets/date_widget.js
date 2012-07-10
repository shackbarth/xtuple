/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, enyo:true, _:true */
(function () {
"use strict";

enyo.kind({
  name: "DateWidget",
  kind: enyo.Control,
  published: {
    dateObject: null
  },
  components: [
    {
      kind: "onyx.InputDecorator", style: "height: 18px;", components: [
        { kind: "onyx.TextArea", name: "dateField", placeholder: "Enter date", onchange: "doInputChanged" }
        //{ kind: "Image", src: "images/date-icon.jpg", ontap: "doIconTapped" },
        /*{ kind: "onyx.Popup", name: "datePickPopup",
          modal: true, floating: true,
          components: [
            // this is third party code that doesn't look great under the best of
            // conditions and needs some work to get even there.
            { kind: "calendarSelector", name: "datePick", style: "width: 800px;" }
          ]
        },
        {
          kind: "calendarSelector",
          name: "datePick2",
          style: "width: 600px; visibility: hidden;",
          onSelected: "pickDate"
        }*/
      ]
    }
  ],
  // a convenience function so that this object can be treated generally like an input
  setValue: function (date) {
    this.setDateObject(date);
  },
  pickDate: function (inSender, date) {
    this.setDateObject(this.textToDate(date.month + "/" + date.day + "/" + date.year));
    console.log(inEvent);
  },
  dateObjectChanged: function () {
    //this.$.datePick2.setSelectedDay(this.dateObject.getDate());
    //this.$.datePick2.setSelectedMonth(this.dateObject.getMonth());
    //this.$.datePick2.setSelectedYear(this.dateObject.getYear());
    //this.$.datePick2.render();
    this.$.dateField.setValue(this.dateObject.toLocaleDateString());
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
    if (value === '0'
        || value.indexOf('+') === 0
        || value.indexOf('-') === 0) {
      // 0 means today, +1 means tomorrow, -2 means 2 days ago, etc.
      date = new Date(new Date().getTime() + value * daysInMilliseconds);

    } else if (value.indexOf('#') === 0) {
      // #40 means the fortieth day of this year, so set the month to 0
      // and set the date accordingly. JS appropriately pushes the date
      // into subsequent months as necessary
      date = new Date();
      date.setMonth(0);
      date.setDate(value.substring(1));

    } else if(value.length && !isNaN(value)) {
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
    //this.$.datePickPopup.show();
    //this.$.datePick2.setStyle("visibility: visible");
    alert("There are two implementations of this commented out in the code. Both are imperfect.");
  }
});

})()
