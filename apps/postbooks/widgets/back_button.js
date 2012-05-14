// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XT XM sc_assert */

sc_require('widgets/button');

Postbooks.BackButton = Postbooks.Button.extend({

  renderButtonShape: function(ctx) {
    var bounds = this.get('bounds'),
        width = bounds.width-3, height = bounds.height-3,
        x = 1.5, y = 1.5,
        radius = this.get('cornerRadius');

    if (radius === undefined) radius = 5;

    var arrowWidth = 12;

    ctx.beginPath();
    ctx.moveTo(x + arrowWidth, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + arrowWidth, y + height);
    ctx.lineTo(x, (y+height)/2);
    ctx.closePath();
  }

});
