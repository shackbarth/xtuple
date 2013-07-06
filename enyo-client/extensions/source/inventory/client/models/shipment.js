XM.Shipment = XM.Document.extend({
  recordType: "XM.Shipment"
});

XM.ShipmentCollection = XM.Collection.extend({
  model: XM.Shipment
});
