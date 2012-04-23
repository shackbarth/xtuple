
XM.IncidentNotes = XT.TileView.extend(
  /** @lends XM.IncidentNotes.prototype */ {

  layout: { top: 0, left: 0, right: 0, height: 0 },

  willRenderLayers: function(context) {
    context.fillStyle = base3;
    context.fillRect(0, 3, context.width, 38);

    context.fillStyle = base00;
    context.fillRect(20, 6, 32, 32);

    context.font = "12pt Helvetica";
    context.fillStyle = 'black';
    context.textAlign = 'left';
    context.textBaseline = 'middle';

    context.fillText("Notes", 72, 22);
  },
    
});

XM.IncidentNotes.CreateTileView = function(controller) {
  var view = this.create();
  var notes = SC.TextFieldWidget.create({
    layout: { top: 44, left: 10, height: 24, right: 10 },
    valueBinding: SC.Binding.from('notes', controller)
  });
  var layers = view.get('layers');
  layers.pushObject(notes);
  return view;
}
