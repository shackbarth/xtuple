// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks sc_assert */

/**
  This surface lays out its subsurfaces, in order, from left to right. Each 
  subsurface is sized so that it's frame is the same size as the Carousel.

  By default, the first subsurface is visible. You can choose another 
  subsurface by doing `carousel.makeSurfaceVisible(theSuburface)`.

  @extends SC.CompositeSurface
*/
Postbooks.Carousel = SC.CompositeSurface.extend(
  /** @scope Postbooks.Carousel.prototype */{

  updateDisplay: function() {
    
  },

  _sc_visibleSurface: null,

  pushSurface: function(surface) {
    this._sc_tray.get('subsurfaces').pushObject(surface);
    this.updateTrayLayout();
    this.makeSurfaceVisible(surface);
  },

  popSurface: function() {
    var subsurfaces = this._sc_tray.get('subsurfaces');

    subsurfaces.popObject();
    this.updateTrayLayout();
    this.makeSurfaceVisible(subsurfaces.objectAt(subsurfaces.get('length') - 1));
  },

  makeSurfaceVisible: function(surface) {
    var tray = this._sc_tray,
        subsurfaces =  tray.get('subsurfaces'),
        idx = subsurfaces.indexOf(surface),
        width = this.get('frame').width,
        frame = tray.get('frame');

    if (idx === -1) {
      console.log('Postbooks.Carousel#makeSurfaceVisible: surface is not a subsurface of our tray.');
      return;
    } else {
      // This will animate if CSS transitions are enabled.
      frame.x = -width * idx;
      this._sc_visibleSurface = surface;
    }
  },

  tray: function() {
    return this._sc_tray;
  }.property(),

  didCreateElement: function(div) {
    // We don't want SC.View's implementation; don't call it.
    div.style.overflowX = 'hidden';
    div.style.overflowY = 'hidden';

    var style = div.style;
    style.backgroundImage =  Postbooks.createDataUrlForSprite('carousel-texture');
    style.backgroundPosition = 'left top';
    style.backgroundRepeat = 'repeat';
  },

  updateTrayLayout: function() {
    var tray = this._sc_tray,
        frame = SC.MakeRect(this.get('frame'));

    sc_assert(tray);
    var slides = tray.get('subsurfaces').length || 1; // Make at least one.

    frame[2]/*width*/ = frame[2]/*width*/ * slides;
    tray.set('frame', frame);
  },

  updateLayout: function() {
    this.updateTrayLayout();
    if (this._sc_visibleSurface) this.makeSurfaceVisible(this._sc_visibleSurface);
  },

  initTray: function() {
    var tray;
    tray = this._sc_tray = Postbooks.InternalCarouselTray.create();
    tray.set('backgroundColor', 'clear');
    this.get('subsurfaces').pushObject(tray);
  },

  init: function() {
    arguments.callee.base.apply(this, arguments);
    this.initTray();
  }

});

Postbooks.InternalCarouselTray = SC.CompositeSurface.extend({

  carousel: function() {
    return this.get('supersurface');
  }.property(),

  updateLayout: function() {
    // console.log('Postbooks.InternalCarouselTray#updateLayout()');
    var subsurfaces = this.get('subsurfaces'),
        frame = SC.MakeRect(this.get('frame')),
        totalWidth = frame.width,
        width = Math.floor(frame.width / subsurfaces.length); // Divide by zero? No problem.

    // We set frame.x individually below.
    frame.y = 0;
    frame.width = width;
    // Use the same height for all subsurfaces.

    for (var idx=0, len=subsurfaces.length; idx<len; ++idx) {
      frame.x = width * idx;

      // We need to adjust the width of the last surface so that together, 
      // they cover our entire width.
      if (idx + 1 === len) frame.width = totalWidth - frame.x;

      subsurfaces[idx].set('frame', frame);
    }
  }

});
