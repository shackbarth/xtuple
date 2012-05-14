// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks sc_assert */

/** @class

  (Document your Model here)

  @extends SC.View
*/
Postbooks.Topbar = SC.View.extend({
  layout: { top: 0, left: 0, right: 0, height: 44 },

  tooltip: "My Tooltip",

  willRenderLayers: function(ctx) {
    var frame = this.get('frame'),
        w = frame.width, h = frame.height,
        lingrad = ctx.createLinearGradient(0,0,0, h),
        name = this.get('name');

    lingrad.addColorStop(0, 'rgb(70,72,71)');
    lingrad.addColorStop(0.05, 'rgb(80,80,80)');
    lingrad.addColorStop(0.475, 'rgb(68,68,68)');
    lingrad.addColorStop(0.525, 'rgb(64,64,64)');
    lingrad.addColorStop(0.95, 'rgb(40,40,40)');
    lingrad.addColorStop(1, 'rgb(70,72,71)');

    ctx.fillStyle = lingrad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'white';

    var K = Postbooks;
    ctx.font = "16pt "+K.TYPEFACE;
    ctx.fontWeight = 'bold';
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.shadowBlur = 0;
    ctx.shadowColor = "rgba(0,0,0,0)";
    ctx.fillText("xTuple "+name, w/2, h/2);
  }
});
