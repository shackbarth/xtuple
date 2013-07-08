  XM.OrderLine = XM.Document.extend({

    recordType: "XM.OrderLine",

    idAttribute: "id"

  });  

  XM.OrderListItem = XM.Document.extend({

    recordType: "XM.OrderListItem",

    idAttribute: "id"

  });

  // ..........................................................
  // COLLECTIONS
  //

  XM.OrderLineCollection = XM.Collection.extend({

    model: XM.OrderLine

  });  

  XM.OrderListItemCollection = XM.Collection.extend({

    model: XM.OrderListItem

  });    
