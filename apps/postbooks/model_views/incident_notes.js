
XM.IncidentNotes = XM.ModelView.extend(
  /** @lends XM.IncidentNotes.prototype */ {

  modelViewType: Postbooks.TileView,

  targetModel: 'XM.Incident',

  isCustomView: true,

  layoutSchema: {
    order: 4,
    tileSize: .5
  },

  layout: { top: 0, left: 0, right: 0, height: 0 },

  willRenderLayers: function(context) {
    context.fillStyle = base3;
    context.fillRect(0, 3, context.width, 38);

    context.fillStyle = base00;
    context.fillRect(20, 6, 32, 32);

    var K = Postbooks;
    context.font = "12pt "+K.TYPEFACE;
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
    isSingleLine: false,
    valueBinding: SC.Binding.from('notes', controller)
  });
  var layers = view.get('layers');
  layers.pushObject(notes);
  return view;
}
