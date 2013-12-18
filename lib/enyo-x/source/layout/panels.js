/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true, window:true */

(function () {

  /*
    Grid Arranger with some
    added functionality from the CollapsibleArranger
  */
  enyo.kind({
    name: "XV.GridArranger",
    kind: "GridArranger",
    colHeight: "430",
    // if this is smaller than the width of the item,
    // then this can cause tiles to overlap
    colWidth: "320",
    arrange: function(inC, inIndex) {
      var w=this.colWidth,
        h=this.colHeight,
        cols = 1,
        c;
      if (!enyo.Panels.isScreenNarrow()) {
        cols = Math.max(1, Math.floor(this.containerBounds.width / w));
      }
      for (var y=0, i=0; i<inC.length; y++) {
        for (var x=0; (x<cols) && (c=inC[i]); x++, i++) {
          this.arrangeControl(c, {left: w*x, top: h*y});
        }
      }
    },
    /**
      This realtimeFit attribute is what the CollapsibleArranger
      uses as a flag to determine if the final panel should take
      up the remaining width of the screen.
    */
    flowControl: function () {
      this.inherited(arguments);
      if (this.container.realtimeFit) {
        var c$ = this.container.getPanels();
        var l = c$.length-1;
        var last = c$[l];
        this.fitControl(last, 0);
      }
    },
    /**
      This is also borrowed from the CollapsibleArranger
      to actually set the width of the last panel to 100%.
    */
    fitControl: function(inControl) {
      inControl._fit = true;
      inControl.applyStyle("width", (this.containerBounds.width - this.colWidth) + "px");
      inControl.resized();
    }
  });

  /**
    Enyo Panels for the Navigator that does not
    allow dragging and allows for the panels to
    wrap on smaller devices.
  */
  enyo.kind({
    name: "XV.GridPanels",
    kind: "Panels",
    arrangerKind: "XV.GridArranger",
    classes: "app enyo-unselectable",
    draggable: false,
    wrap: true,
    // this means nothing unless the arranger is Collapsible or NavArranger
    realtimeFit: true,
  });

}());