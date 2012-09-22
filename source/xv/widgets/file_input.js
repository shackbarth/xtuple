/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, enyo:true, _:true, Globalize:true */

(function () {

  enyo.kind({
    name: "XV.FileInput",
    kind: "XV.Input",
    events: {
      onValueChange: ""
    },
    handlers: {
      onValueChange: "valueChange"
    },
    components: [
      {name: "input", tag: "input type=file", kind: "onyx.Input",  classes: "xv-subinput", onchange: "inputChanged"}
    ],
    //setValue: function (value, options) {
    //  this.value = value;
      // don't try to update widget. Just throws a security exception if you do.
    //},
    /**
      Turn the payload into the file instead of the filename
     */
    valueChange: function (inSender, inEvent) {
      // I feel bad going to the DOM like this but not that bad.
      // Some inspiration from https://github.com/JMTK/decorated-file-input
      // which we can use to replace this widget if we want
      var that = this,
        file = inEvent.originator.$.input.hasNode().files[0],
        filename = inEvent.value,
        reader;

      // XXX Browser support for this HTML5 construct is not universal
      if (FileReader) {
        // XXX unsure about the overhead of this constructor. maybe save it globally?
        reader = new FileReader();
      } else {
        alert("Sorry! File upload is only supported on modern browsers.");
        inEvent.value = null;
        return;
      }

      // prepare callback
      reader.onload = function () {
        // TODO: unscrim
        console.log(reader.result);
        inEvent.value = reader.result;
        inEvent.filename = filename;
        that.doValueChange(inEvent);
      };

      // TODO: scrim

      // XXX binary string is only one of several options here
      // http://www.html5rocks.com/en/tutorials/file/dndfiles/
      reader.readAsBinaryString(file); // async

      // this event will be bubbled by the callback
      return true;
    }
  });

  enyo.kind({
    name: "XV.FileInputWidget",
    kind: "XV.FileInput"
  });

}());
