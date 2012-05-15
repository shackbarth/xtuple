Postbooks.CreateNotesTileView = function(controller, optionalTitle, optionalProperty) {

  // global for testing textSurface.value binding
  NOTES_VALUE = controller;

  var key = optionalProperty? optionalProperty : 'notes',
      K = Postbooks;

  var layoutSurface = SC.LayoutSurface.create();
  layoutSurface.set('frame', SC.MakeRect(0, 42, 320, 320));
  layoutSurface.set('backgroundColor', "white");

  var topbar = SC.View.create({
    layout: { top: 3, left: 0, right: 0, height: 32 },

    willRenderLayers: function(context) { 
      var title = optionalTitle? optionalTitle : "_notes".loc();
           
      // title bar
      context.fillStyle = "#fdf6e3";
      context.fillRect(0, 0, context.width, 25);

      // image frame
      context.fillStyle = base00;
      context.fillRect(20, 4, 24, 24);

      // title text
      context.font = "12pt "+K.TYPEFACE;
      context.fillStyle = 'black';
      context.textAlign = 'left';
      context.textBaseline = 'middle';

      context.fillText(title, 72, 16 );
    }
  });

  var view = SC.TextSurface.create({
    _sc_borderColor: "transparent",

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
