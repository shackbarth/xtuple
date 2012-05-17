// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks sc_assert */

Postbooks.CreateNotesTileView = function(controller, optionalTitle, optionalProperty) {

  // global for testing textSurface.value binding
  window.NOTES_VALUE = controller;

  var key = optionalProperty? optionalProperty : 'notes',
      K = Postbooks;

  var layoutSurface = SC.LayoutSurface.create({

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

    _sc_backgroundColor: 'clear',
    clearBackground: true,

    willRenderLayers: function(context) { 
      var title = optionalTitle? optionalTitle : "_notes".loc(),
          w = context.width, h = context.height;

      // title text
      var K = Postbooks;
      context.font = "12pt "+K.TYPEFACE;
      context.fillStyle = 'white';
      context.textAlign = 'left';
      context.textBaseline = 'middle';

      context.fillText(title, 18, 19);
    }
  });

  var view = SC.TextSurface.create({
    layout: { top: 50, left: 12, right: 12, bottom: 16 },

    _sc_borderColor: 'grey',

    didCreateElement: function(el) {
      arguments.callee.base.apply(this, arguments);
      var style = el.style;
      style.backgroundColor = 'white'; // 'rgba(70,70,70,0.5)';
      style.color = 'black';
      style.padding = '6px';
      style.borderStyle = 'solid ';
      style.borderRadius = '5px';
      style.borderColor = this.get('isEnabled') ? 'rgb(252,188,126)' : 'grey'; // this.get('borderColor');
      style.outline = 'none';
      style.boxShadow = 'none';
    },

    willBecomeInputSurfaceFrom: function(surface) {
      var psurface = SC.psurfaces[this.__id__],
          el = psurface? psurface.__element__ : null,
          style = el? el.style : null;

      if (style) style.boxShadow = '0px 0px 3px 1px ' + 'rgb(252,102,32)' + ', 0px 0px 1px 0px ' + 'rgb(128,128,128)' + ' inset';
    },

    didLoseInputSurfaceTo: function(surface) {
      var psurface = SC.psurfaces[this.__id__],
          el = psurface? psurface.__element__ : null,
          style = el? el.style : null;

      if (style) style.boxShadow = 'none';
    },

    // HACK: this assignment is
    // merely to get text on the 
    // text surface when the 'Notes'
    // View renders.

    // The binding to the 'notes'
    // property on the controller
    // works both ways, but something
    // is preventing a proper sync
    // between them when the Notes
    // 'tile' renders.

    // TODO: fix controller binding
    // to work correctly...
    value: controller.get(key),

    // testing value binding
    valueDidChange: function() {
      var value = this.get('value');
      console.log('value: %@'.fmt(value));
    }.observes('value')
  });

  //create binding from record object to value property of textSurface
  notesBinding = SC.Binding.from(key, controller).to('value', view).sync().connect().flushPendingChanges();
  bindingsRef = view.get('bindings');
  bindingsRef.pushObject(notesBinding);

  // testing value binding
  controller.addObserver('notes', function() {
    console.log('notes value: %@'.fmt(this.get('notes')));
  });

  view.set('frame', SC.MakeRect(0, 38, 310, 272));

  layoutSurface.get('subsurfaces').pushObjects([topbar, view]);

  return layoutSurface;
};
