  XM.Order = XM.Document.extend({

    recordType: 'XM.Order'

  });

  XM.OrderLine = XM.Document.extend({

    recordType: 'XM.OrderLine',

    idAttribute: "id"

  });  

  XM.OrderListItem = XM.Document.extend({

    recordType: 'XM.OrderListItem',

    idAttribute: "id",

		editableModel: 'XM.Order'

  });

  XM.OrderRelation = XM.Info.extend({

    recordType: 'XM.OrderRelation',

    editableModel: 'XM.Order',

    descriptionKey: "number"

  });

  // ..........................................................
  // COLLECTIONS
  //

  XM.OrderListItemCollection = XM.Collection.extend({

    model: XM.OrderListItem

  });

  XM.OrderRelationCollection = XM.Collection.extend({

    model: XM.OrderRelation

  });    
