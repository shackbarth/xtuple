
XM.IncidentStatus = XT.TileView.extend(
  /** @lends XM.IncidentNotes.prototype */ {

  layout: { top: 0, left: 0, right: 0, height: 0 },

  willRenderLayers: function(context) {
    context.fillStyle = base3;
    context.fillRect(0, 3, context.width, 38);

    context.fillStyle = base00;
    context.fillRect(20, 6, 32, 32);

    var K = XT;
    context.font = "12pt "+K.TYPEFACE;
    context.fillStyle = 'black';
    context.textAlign = 'left';
    context.textBaseline = 'middle';

    context.fillText("Status", 72, 22);
  },
    
});

XM.IncidentStatus.CreateTileView = function(controller) {
  var view = this.create();
  var I = XM.Incident;

  var incdtStatus = SC.SelectWidget.create({
    items: [
      { title: 'New',
        value: I.NEW,
        enabled: true
      },
      { title: 'Feedback',
        Value: I.FEEDBACK,
        enabled: true
      },
      { title: 'Confirmed',
        value: I.CONFIRMED,
        enabled: true
      },
      { title: 'Assigned',
        value: I.ASSIGNED,
        enabled: true
      },
      { title: 'Resolved',
        value: I.RESOLVED,
        enabled: true
      },
      { title: 'Closed',
        value: I.CLOSED,
        enabled: true
      }
    ],
    itemTitleKey: 'title',
    itemValueKey: 'value',
    itemIsEnabledKey: 'enabled',
    isEnabled: true,
    value: I.NEW
//    valueBinding: SC.Binding.from('incidentStatus', controller)
  });
  var layers = view.get('layers');
  layers.pushObject(incdtStatus);
  return view;
}
