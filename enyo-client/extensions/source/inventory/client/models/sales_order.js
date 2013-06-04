
  /**
    @class

    @extends XM.SalesOrderLineBase
  */
  XM.SalesOrderLineListItem = XM.SalesOrderLineBase.extend({

    recordType: 'XM.SalesOrderLineListItem',

    parentKey: 'salesOrder.number',

    lineCharacteristicRecordType: "XM.SalesOrderLineCharacteristic"
  
  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.SalesOrderLineListItemCollection = XM.Collection.extend({

    model: XM.SalesOrderLineListItem

  });
