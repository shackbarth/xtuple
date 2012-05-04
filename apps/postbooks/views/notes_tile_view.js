Postbooks.CreateNotesTileView = function(controller) {

  var view = Postbooks.TileView.create({ title: "_notes".loc() }),
      layers = view.get('layers'),
      y = 42,
      K = Postbooks,
      left = 12, right = 12,
      widget = null,
      key;
 
  key = 'notes';

  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 70, right: right },
    borderColor: 'white',
    isSingleLine: false,
    valueBinding: SC.Binding.from(key, controller)
  });
  layers.pushObject(widget);

  /**
  var view = SC.TextSurface.create({
    value: 'Hello world',
  });
  view.set('frame', SC.MakeRect(0, 42, 320, 320));
  */

  return view;
};
