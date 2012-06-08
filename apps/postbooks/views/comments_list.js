// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks sc_assert XT XM formatter linebreak */

// This is a variable row-height list. We need a canvas to measure row 
// heights (we'll be asked to do layout before a canvas is available).

SC.ready(function() {
  Postbooks.commentsCanvas = document.createElement('canvas');
});

Postbooks.IncidentComment = {};
Postbooks.IncidentComment.ListView =  SC.ListView.extend({

  font: "11pt Helvetica, sans",
  textBaseline: 'top',
  textAlign: 'left',
  tolerance: 10,
  lineHeight: 18,

  computeRowHeight: function(context, width, index, object) {
    var paragraphs = String(object.get('text') || ''),
        line, that = this,
        height = 0,
        cachedAlignments = this._sc_cachedAlignments,
        paragraphAlignments;

    if (!cachedAlignments) {
      cachedAlignments = this._sc_cachedAlignments = [];
    }

    paragraphAlignments = cachedAlignments[index] = [];

    sc_assert(context);

    function setparagraph(nodes, breaks, lineLengths, center) {
      var i = 0, lines = [],
          point, j, r,
          lineStart = 0,
          maxLength = Math.max.apply(null, lineLengths);

      // Iterate through the line breaks, and split the nodes at the correct 
      // point.
      for (i = 1; i < breaks.length; i += 1) {
        point = breaks[i].position;
        r = breaks[i].ratio;

        for (j = lineStart; j < nodes.length; j += 1) {
          // After a line break, we skip any nodes unless they are boxes or 
          // forced breaks.
          if (nodes[j].type === 'box' || (nodes[j].type === 'penalty' && nodes[j].penalty === -linebreak.defaults.infinity)) {
            lineStart = j;
            break;
          }
        }
        lines.push({
          ratio: r,
          nodes: nodes.slice(lineStart, point + 1),
          position: point
        });
        lineStart = point;
      }
      return lines;
    }

    function align(text, type, lineLengths, tolerance, center) {
      var format, nodes, breaks, lines;

      context.textBaseline = that.get('textBaseline');
      context.font = that.get('font');

      format = formatter(function(str) {
        return context.measureText(str).width;
      });

      nodes = format[type](text);
      breaks = linebreak(nodes, lineLengths, { tolerance: tolerance });

      if (!breaks.isEmpty()) {
        lines = setparagraph(nodes, breaks, lineLengths, center);
        height += Math.max(that.get('layout').minHeight || 0, lines.length*that.get('lineHeight'));
      } else {
        console.log('Paragraph can not be set with the given tolerance.', tolerance);
        lines = [];
      }

      return lines;
    }

    paragraphs = paragraphs.split('\n');
    // console.log(paragraphs);
    paragraphs.forEach(function(paragraph, index) {
      paragraphAlignments[index] = align(paragraph, this.get('textAlign'), [width-40], 10);
    }, this);

    return height + 45;
      // Also include fixed header text, between-paragraph spacing, and 
      // padding at the bottom.
  },

  renderRow: function(context, width, height, index, object, isSelected) {
    context.fillStyle = isSelected? '#99CCFF' : 'white';
    context.fillRect(0, 0, width, height);
    
    context.strokeStyle = 'grey';
    context.lineWidth = 1;

    context.beginPath();
    context.moveTo(0, height - 0.5);
    context.lineTo(width, height - 0.5);
    context.stroke();

    context.font = this.get('font');
    context.fillStyle = 'black';
    context.textAlign = this.get('textAlign');
    context.textBaseline = this.get('textBaseline');

    var dt = object.get('created'),
        val = dt.toLocaleDateString();
    context.font = "bold " + this.get('font');
    context.fillText(val, 20, 10);

    context.font = this.get('font');

    var paragraphAlignments = this._sc_cachedAlignments[index],
        lineLengths = [width-40],
        maxLength = Math.max.apply(null, lineLengths),
        lineHeight = this.get('lineHeight'),
        y = 30, center = false,
        backgroundColor = 'white',
        lines;

    paragraphAlignments.forEach(function(lines) {
      lines.forEach(function (line, lineIndex) {
        var x = 20, lineLength = lineIndex < lineLengths.length ? lineLengths[lineIndex] : lineLengths[lineLengths.length - 1];

        if (center) {
          x += (maxLength - lineLength) / 2;
        }

        line.nodes.forEach(function (node, index) {
          if (node.type === 'box') {
            context.fillText(node.value, x, y);
            x += node.width;
          } else if (node.type === 'glue') {
            x += node.width + line.ratio * (line.ratio < 0 ? node.shrink : node.stretch);
          }
        });

        y += lineHeight;
      });
    }, this);
  },

  adjustLayout: function() {
    var frame = SC.MakeRect(this.get('frame')),
        content = this.get('content'),
        rowHeights = this._sc_rowHeights,
        height = 0;

    var rows = content? content.get('length') : 0;

    rowHeights.length = rows;

    if (rows > 0) {
      var context = Postbooks.commentsCanvas.getContext('2d'),
          width = frame[2];

      content.forEach(function(row, index) {
        rowHeights[index] = this.computeRowHeight(context, width, index, row);
      }, this);
    }

    height = rowHeights.reduce(function(previousValue, item) {
      return previousValue + item;
    }, 0);

    console.log('height', height);

    frame[0]/*x*/ = 0;
    frame[1]/*y*/ = 0;
    frame[2]/*w*/ = frame[2]/*w*/ ; // - 15; // account for scroller
    frame[3]/*h*/ = Math.max(height, frame[3]/*h*/);

    // We never have to offset in this manner.
    var scrollTranslation = this._sc_scrollTranslation;
    scrollTranslation[0]/*x*/ = 0;
    scrollTranslation[1]/*y*/ = 0;

    this._sc_scrollingCanvas.set('frame', frame);
  },

  updateDisplay: function() {
    // console.log('Postbooks.IncidentComment.ListView#updateDisplay()', SC.guidFor(this));
    var ctx = this._sc_context;
    sc_assert(ctx);
    sc_assert(document.getElementById(ctx.__sc_canvas__.id));

    var rowHeights = this._sc_rowHeights,
        height = 0;

    // Clear the background if requested.
    if (this.get('clearBackground')) ctx.clearRect(0, 0, ctx.w, ctx.h);

    if (this.willRenderLayers) {
      ctx.save();
      this.willRenderLayers(ctx);
      ctx.restore();
    }

    var content = this.get('content'),
        selection = this.get('selection'),
        idx, len, w = ctx.w, h = this.get('rowHeight');
    sc_assert(selection  && selection.contains, "ListView must have a selection and it must respond to `contains()`");

    if (content && (len = content.get('length')) > 0) {
      for (idx=0; idx<len; ++idx) {
        var obj = content.objectAt(idx);
        ctx.save();
        if (idx > 0) height += rowHeights[idx-1];
        ctx.translate(0, height);
        if (this.renderRow) {
          this.renderRow(ctx, w, rowHeights[idx], idx, obj, selection.contains(obj),
            idx===0? true : false,
            idx===(len-1)? true : false);
        }
        ctx.restore();
      }
    }

    if (this.didRenderLayers) {
      ctx.save();
      this.didRenderLayers(ctx);
      ctx.restore();
    }
  },

  mouseDown: function(evt) {
    // console.log('Postbooks.IncidentComment.ListView#mouseDown()', SC.guidFor(this));
    var top = evt.target.getBoundingClientRect().top;
    this._scrollTop = top;
    this._scrollTarget = evt.target;

    var rowHeights = this._sc_rowHeights.slice(),
        height = 0, idx = 0, target = evt.pageY - top;

    while (target > (height + rowHeights[idx])) {
      height += rowHeights[idx];
      idx++;
    }

    this._rowIndex = idx;
    evt.allowDefault();
    return true;
  },

  init: function() {
    arguments.callee.base.apply(this, arguments);
    this._sc_rowHeights = [];
  }

});

Postbooks.IncidentComment.CreateTileListView = function(klass, controller, title, objectController) {
  var layoutSurface = SC.LayoutSurface.create({

    size: Postbooks.TileView.QUARTER_TILE,

    didCreateElement: function(el) {
      arguments.callee.base.apply(this, arguments);
      var style = el.style;
      style.backgroundImage =  Postbooks.createDataUrlForSprite('tile-texture');
      style.backgroundPosition = 'left top';
      style.backgroundRepeat = 'repeat';

      var kind, size = this.get('size'); 
      if (document.getCSSCanvasContext && size) {
        // Figure out what size we have.
        'QUARTER_TILE HORIZONTAL_TILE VERTICAL_TILE FULL_TILE'.w().forEach(function(type) {
          var spec = Postbooks.TileView[type];
          if (spec.width === size.width && spec.height === size.height) {
            kind = type;
          }
        });
      }

      if (kind) {
        style.backgroundImage =  '-webkit-canvas('+kind.toLowerCase().dasherize() + '), ' + Postbooks.createDataUrlForSprite('tile-texture');
        style.backgroundPosition = 'left top, left top';
        style.backgroundRepeat = 'no-repeat, repeat';
      } else {
        style.backgroundImage =  Postbooks.createDataUrlForSprite('tile-texture');
        style.backgroundPosition = 'left top';
        style.backgroundRepeat = 'repeat';
      }
    }

  });
  layoutSurface.set('frame', SC.MakeRect(0, 42, 320, 320));
  // layoutSurface.set('backgroundColor', "white");

  var topbar = SC.View.create({
    layout: { top: 3, left: 0, right: 0, height: 32 },

    _sc_backgroundColor: 'transparent',
    clearBackground: true,

    willRenderLayers: function(context) { 
      var w = context.width, h = context.height;

      // title text
      var K = Postbooks;
      context.font = "12pt "+K.TYPEFACE;
      context.fillStyle = 'white';
      context.textAlign = 'left';
      context.textBaseline = 'middle';

      if (title) context.fillText(title, 18, 19);
    }
  });

  topbar.get('layers').pushObject(Postbooks.Button.create({
    layout: { top: 6, right: 12, height: 22, width: 60 },
    name: '_new'.loc(),
    target: Postbooks.statechart,
    action: 'newRecord',
    objectController: objectController,
    listController: controller,
    klass: klass,
    store: objectController.get('content').get('store')
  }));

  // Nope, generate the default tile view on the fly.
  var list = Postbooks.IncidentComment.ListView.create({
    layout: { top: 50, left: 12, right: 12, bottom: 16 },

    rowHeight: 10,
    hasHorizontalScroller: false,

    contentBinding: SC.Binding.from('arrangedObjects', controller).oneWay(),
    selectionBinding: SC.Binding.from('selection', controller),

    baseClass: klass,

    didCreateElement: function(el) {
      arguments.callee.base.apply(this, arguments);
      var style = el.style;
      style.backgroundColor = 'clear'; // 'rgba(70,70,70,0.5)';
      style.color = 'black';
      style.padding = '6px';
      style.borderStyle = 'solid ';
      style.borderWidth = '1px';
      // style.borderRadius = '5px'; // doesn't work properly in Chrome; avoid for now
      style.borderColor = this.get('isEnabled') ? 'rgb(252,188,126)' : 'grey'; // this.get('borderColor');
      style.outline = 'none';
      style.boxShadow = 'none';
    },

    action: function(object, index) {
      var that = this;
      var instance = this.get('content').objectAt(index);
      if (instance) {
        Postbooks.LoadExclusiveModal(klass.prototype.className.slice(3), "Back", instance, objectController, controller);
      }
    },

    willRenderLayers: function(ctx) {
      var content = this.get('content');

      if (content && content.get('length') === 0) {
        var w = ctx.width, h = ctx.height;

        var text = 'No records.',
            status = content? content.get('status') : null;

        if (status && status === SC.Record.BUSY_LOADING) {
          text = "_loading".loc();
        }

        // Clear background.
        ctx.clearRect(0, 0, w, h);

        // Draw view name.
        ctx.fillStyle = 'rgba(70,70,70,0.5)';
        
        var K = Postbooks;
        ctx.font = "11pt "+K.TYPEFACE;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText(text, w/2, h/2);
      } else {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, w, h);
      }
    }

  });

  layoutSurface.get('subsurfaces').pushObjects([topbar, list]);

  return layoutSurface;
};