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
      {name: "input", tag: "input type=file", kind: "onyx.Input",  classes: "xv-subinput", onchange: "inputChanged"},
      {name: "scrim", kind: "onyx.Scrim", showing: false, floating: true}
    ],
    setValue: function (value, options) {
      // this is a bit dicey. Generally we don't want to set the value of the widget, because
      // setting the value of a file input with the binary data will just throw a security
      // exception. But this function is also used as an essential part of selecting a file.
      // In that circumstance the value is the filename and the options has no silent attribute.
      // I use that to differentiate the appropriate times to suppress the setting of the value

      if (options && options.silent) {
        // don't try to update widget. Just throws a security exception if you do.
        this.value = value;
      } else {
        this.inherited(arguments);
      }
    },
    /**
      Turn the payload into the file instead of the filename
     */
    valueChange: function (inSender, inEvent) {
      if (inEvent.transformedByFileInput) {
        // we've already been here. We want to propagate up, but don't run this function again.
        return false;
      }


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
        // XXX we should have some sort of XT.alert
        alert("Sorry! File upload is only supported on modern browsers.");
        inEvent.value = null;
        return;
      }

      // prepare callback
      reader.onload = function () {
        that.$.scrim.setShowing(false);
        inEvent.value = reader.result;
        inEvent.filename = filename;
        inEvent.transformedByFileInput = true; // used to avoid infinite loop
        that.doValueChange(inEvent);
      };

      // XXX not sure why this scrim isn't working
      this.$.scrim.setShowing(true);

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
