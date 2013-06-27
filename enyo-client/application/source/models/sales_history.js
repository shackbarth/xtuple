/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, */

(function () {
  "use strict";

  /**
    @class
    @extends XM.Model
  */
  XM.SalesHistory = XM.Model.extend(/** @lends XM.SalesHistory.prototype */{

    recordType: 'XM.SalesHistory'
  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class
    @extends XM.Collection
  */
  XM.SalesHistoryCollection = XM.Collection.extend(/** @lends XM.SalesHistoryCollection.prototype */{

    model: XM.SalesHistory
  });
}());
