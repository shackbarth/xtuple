/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, enyo:true, _:true, Globalize:true */

(function () {

  enyo.kind({
    name: "XV.FileInput",
    kind: "XV.Input",
    handlers: {
      onValueChange: "valueChange"
    },
    components: [
      {name: "input", tag: "input type=file", kind: "onyx.Input",  classes: "xv-subinput", onchange: "inputChanged"}
    ],
    setValue: function (value, options) {
      this.value = value;
      // don't try to update widget. Just throws a security exception if you do.
    },
    /**
      Turn the payload into the file instead of the filename
     */
    valueChange: function (inSender, inEvent) {
      // I feel bad going to the DOM like this but not that bad.
      // Some inspiration from https://github.com/JMTK/decorated-file-input
      // which we can use to replace this widget if we want
      var file = inEvent.originator.$.input.hasNode().files[0],
        // XXX unsure about browser support for this HTML5 construct
        // XXX unsure about the overhead of this constructor. maybe save it globally?
        reader = new FileReader();

      // XXX binary string is only one of several options here
      // http://www.html5rocks.com/en/tutorials/file/dndfiles/
      reader.readAsBinaryString(file)
      inEvent.value = reader.result;
    }
  });

  enyo.kind({
    name: "XV.FileInputWidget",
    kind: "XV.FileInput"
  });

}());
