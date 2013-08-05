/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initItemSiteModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.ItemSiteLocation = XM.Model.extend({
      
      recordType: "XM.ItemSiteLocation"

    });
  
    // ..........................................................
    // CLASS CONSTANTS
    //

    /**
      Constants for item site inventory settings.
    */
    _.extend(XM.ItemSite, {

      // ..........................................................
      // CONSTANTS
      //

      /**
        No cost tracking.

        @static
        @constant
        @type String
        @default S
      */
      NO_COST: 'N',

      /**
        Standard Cost.

        @static
        @constant
        @type String
        @default S
      */
      STANDARD_COST: 'S',

      /**
        Average Cost.

        @static
        @constant
        @type String
        @default 'A'
      */
      AVERAGE_COST: 'A',

      /**
        Job Cost.

        @static
        @constant
        @type String
        @default J
      */
      JOB_COST: 'J',

      /**
        Not controlled method

        @static
        @constant
        @type String
        @default 'N'
      */
      NO_CONTROL: 'N',

      /**
        Regular control method

        @static
        @constant
        @type String
        @default 'R'
      */
      REGULAR_CONTROL: 'R',

    // TO DO: Move LOT and SERIAL constants to standard edition

      /**
        Lot Control.

        @static
        @constant
        @type String
        @default L
      */
      LOT_CONTROL: 'L',


      /**
        Serial Control

        @static
        @constant
        @type Number
        @default 'S'
      */
      SERIAL_CONTROL: 'S'

    });

  };


}());

