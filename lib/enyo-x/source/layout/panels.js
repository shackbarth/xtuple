/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true, window:true */

(function () {

  /*
    @name ResponsiveArranger
    @class Arranger that wraps panels under one another
    on smaller screens in a responsive-like manner.
    Like the CollapsingArranger, if the realtimefit property
    is set by the container, then the last panel will take the
    remaining width of the screen.

    The default colWidth is set to the width of the first
    panel, which is the smallest mobile device width.

    The colHeight is set to the height of the container
    unless the screen is narrow, then the height is half
    the height of the container to allow room for the
    other panels.
    @extends GridArranger
  */
  enyo.kind({
    name: "ResponsiveArranger",
    kind: "GridArranger",
    colWidth: "320", // width of the left panel
    /**
      Override of the size function in GridArranger to
      use the full height of the container unless it is
      narrow, then use half.
    */
    size: function() {
      var c$ = this.container.getPanels(),
        w = this.colWidth,
        h = enyo.Panels.isScreenNarrow() ?
          this.containerBounds.height / 2 : this.containerBounds.height;

      for (var i=0, c; (c=c$[i]); i++) {
        c.setBounds({width: w, height: h});
      }
    },
    /**
      Override of the arrange function on the GridArranger
      to force a one column layout for narrow screens.
      @param inC
      @param inIndex
    */
    arrange: function(inC, inIndex) {
      var w = this.colWidth,
        h = this.containerBounds.height,
        cols = Math.max(1, Math.floor(this.containerBounds.width / w)),
        c;
      if (enyo.Panels.isScreenNarrow()) {
        // on narrow screens, split the container height in half,
        // but ensure that the top panel still has at least 200px
        h = Math.max(200, this.containerBounds.height / 2);
        cols = 1;
      }
      for (var y=0, i=0; i<inC.length; y++) {
        for (var x=0; (x<cols) && (c=inC[i]); x++, i++) {
          this.arrangeControl(c, {left: w*x, top: h*y});
        }
      }
    },
    /**
      This realtimeFit attribute on the container is what
      the arranger uses as a flag to determine if the final panel
      should take up the remaining width of the screen.
      @param inControl
      @param inA
    */
    flowControl: function (inControl, inA) {
      this.inherited(arguments);
      // don't see a need for reduced opacity
      enyo.Arranger.opacifyControl(inControl, 100);
      if (this.container.realtimeFit) {
        var c$ = this.container.getPanels();
        var l = c$.length-1;
        var last = c$[l];
        this.fitControl(last);
      }
    },
    /**
      If necessary, this sets the width of the last
      panel to the container width minus the width of the
      other panels.
      @param inControl
    */
    fitControl: function(inControl) {
      inControl._fit = true;
      inControl.applyStyle("width", (this.containerBounds.width - this.colWidth) + "px");
      inControl.resized();
    },
  });

  /**
    @name XV.GridPanels
    @class Panels that does not allow dragging
    and allows for the panels to wrap on smaller devices.
    @extends Panels
  */
  enyo.kind({
    name: "XV.GridPanels",
    kind: "Panels",
    arrangerKind: "ResponsiveArranger",
    classes: "app enyo-unselectable",
    draggable: false,
    wrap: true,
    // this means nothing unless the arranger is Collapsible or ResponsiveArranger
    realtimeFit: true
  });

  /*
    @name CollapsingFitArranger
    @class CollapsingArranger that
    does not extend the width of the last
    panel to fit the remaining space.
    @extends CollapsingArranger
  */
  enyo.kind({
    name: "CollapsingFitArranger",
    kind: "CollapsingArranger",
    /**
      This stomps on the function in the CollapsingArranger
      that makes the last panel take up the entire widget
      @param inControl, inOffset
    */
    fitControl: function(inControl, inOffset) {}
  });

  /**
    @name XV.CollapsingPanels
    @class Panels that collapse to the left on smaller devices
    @extends Panels
  */
  enyo.kind({
    name: "XV.ContainerPanels",
    kind: "Panels",
    arrangerKind: "CollapsingArranger",
    draggable: true,
    realtimeFit: true,
    controlClasses: 'xv-app-panel'
  });

  enyo.kind({
    name: 'XV.WorkspacePanels',
    kind: 'Panels',
    arrangerKind: "CollapsingFitArranger",
    classes: 'xv-workspace-panel-container',
    controlClasses: 'xv-workspace-panel',
    draggable: true,
    realtimeFit: true
  });

  enyo.kind({
    name: 'XV.SearchPanels',
    kind: 'XV.GridPanels',
    classes: 'xv-app-panel-container',
    controlClasses: 'xv-app-panel'
  });

}());
