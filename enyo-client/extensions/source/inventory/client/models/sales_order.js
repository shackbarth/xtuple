/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initSalesOrderModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.SalesOrderLineListItem = XM.Model.extend({

      recordType: 'XM.SalesOrderLineListItem'
    
    });

    /**
      @class

      @extends XM.Model
    */
    XM.ShippableSalesOrderLine = XM.Model.extend({

      recordType: 'XM.ShippableSalesOrderLine'
    
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

      /**
      @class

      @extends XM.Collection
    */
    XM.ShippableSalesOrderLineCollection = XM.Collection.extend({

      model: XM.ShippableSalesOrderLine

    });

  };

}());
