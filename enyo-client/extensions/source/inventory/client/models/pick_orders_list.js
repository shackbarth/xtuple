  XM.PickOrdersList = XM.Document.extend({

    recordType: "XM.PickOrdersList",

    idAttribute: "id"

  });

  // ..........................................................
  // COLLECTIONS
  //

  XM.PickOrdersListCollection = XM.Collection.extend({

    model: XM.PickOrdersList

  });    
