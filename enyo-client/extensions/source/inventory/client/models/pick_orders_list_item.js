  XM.PickOrdersListItem = XM.Document.extend({

    recordType: "XM.PickOrdersListItem",

    idAttribute: "id"

  });

  // ..........................................................
  // COLLECTIONS
  //

  XM.PickOrdersListItemCollection = XM.Collection.extend({

    model: XM.PickOrdersListItem

  });    
