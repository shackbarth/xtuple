/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  XT.extensions.purchasing.initItemSourceModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.ItemSource = XM.Model.extend({

      recordType: "XM.ItemSource"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ItemSourcePrice = XM.Model.extend({

      recordType: "XM.ItemSourcePrice"

    });

    // ..........................................................
    // CONSTANTS
    //
    _.extend(XM.ItemSourcePrice, /** @lends XM.ItemSourcePrice# */{

      /**
        Nominal price.

        @static
        @constant
        @type String
        @default N
      */
      TYPE_NOMINAL: "N",

      /**
        Discount price.

        @static
        @constant
        @type String
        @default D
      */
      TYPE_DISCOUNT: "D"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ItemSourceManufacturer = XM.Model.extend({

      recordType: "XM.ItemSourceManufacturer"

    });



    // ..........................................................
    // COLLECTIONS
    //


    /**
      @class

      @extends XM.Collection
    */
    XM.ItemSourceCollection = XM.Collection.extend({

      model: XM.ItemSource

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.ItemSourceManufacturerCollection = XM.Collection.extend({

      model: XM.ItemSourceManufacturer

    });

  };

}());

