XM.Shipment = XM.Document.extend({

  recordType: "XM.Shipment"

});

XM.ShipmentListItem = XM.Document.extend({

  recordType: "XM.ShipmentListItem"

});

XM.ShipmentListItemCollection = XM.Collection.extend({

  model: XM.ShipmentListItem

});
