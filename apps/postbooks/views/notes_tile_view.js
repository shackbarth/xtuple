Postbooks.CreateNotesTileView = function(controller) {

  /**
  var view = Postbooks.TileView.create({ title: "_notes".loc() }),
      layers = view.get('layers'),
      y = 42,
      K = Postbooks,
      left = 12, right = 12,
      widget = null,
      key;
  */
 
  var key = 'notes';

  /**
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 70, right: right },
    borderColor: 'white',
    isSingleLine: false,
    valueBinding: SC.Binding.from(key, controller)
  });
  layers.pushObject(widget);
  */

  var draggableSurface = SC.CompositeSurface.create({
    mouseDown: function(evt) {
      // console.log('draggableSurface#mouseDown');
      this._clientX = evt.clientX;
      this._clientY = evt.clientY;
      return true;
    },

    mouseDragged: function(evt) {
      // console.log('draggableSurface#mouseDragged');
      SC.AnimationTransaction.begin({ duration: 0 });
      var frame = this.get('frame');
      frame.x = frame.x + evt.clientX - this._clientX;
      frame.y = frame.y + evt.clientY - this._clientY;
      this._clientX = evt.clientX;
      this._clientY = evt.clientY;
      SC.AnimationTransaction.end();
      return true;
    },

    mouseUp: function(evt) {
      // console.log('draggableSurface#mouseUp');
      SC.AnimationTransaction.begin({ duration: 0 });
      var frame = this.get('frame');
      frame.x = frame.x + evt.clientX - this._clientX;
      frame.y = frame.y + evt.clientY - this._clientY;
      delete this._clientX;
      delete this._clientY;
      SC.AnimationTransaction.end();
      return true;
    }
  });
  draggableSurface.set('frame', SC.MakeRect(0, 42, 320, 320));
  draggableSurface.set('backgroundColor', "#fdf6e3");

  for (name in controller) {
    if (controller.hasOwnProperty(name)) {
      console.log('controller property: %@'.fmt(name));
    }
  }

  var content = controller.content;
  for (name in content) {
    if (content.hasOwnProperty(name)) {
      console.log('content property: %@'.fmt(name));
    }
  }

  var notes = controller.get('notes');
  console.log('controller notes: %@'.fmt(notes));

  var view = SC.TextSurface.create({
    // value: 'Hello world',
    valueDidChange: function() {
      var value = this.get('value');
      console.log('value: %@'.fmt(value));
    }.observes('value')
  });
  SC.Binding.from(key, controller).to('value', view).sync().connect().flushPendingChanges();

  controller.addObserver('notes', function() {
    console.log('notes value: %@'.fmt(this.get('notes')));
  });

  NOTES_VALUE = controller;

  var bindingRef = view.bindings;

  console.log('bindings length: %@'.fmt(bindingRef.length));

  view.set('frame', SC.MakeRect(0, 34, 310, 276));

  draggableSurface.get('subsurfaces').pushObject(view);

  return draggableSurface;
};
