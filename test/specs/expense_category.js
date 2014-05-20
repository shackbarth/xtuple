/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true,
 beforeEach:true */

(function () {
  "use strict";
 /**
    Expense Categories are used to identify the General Ledger (G/L) Accounts to be used when processing the following:
        • Non-Inventory Purchase Order Items
        • Miscellaneous Voucher
        • Miscellaneous Payables Checks
        • Expense Transactions

    @class
    @alias ExpenseCategory
    @property {String} id
    @property {String} code [is the idAttribute, required] (Enter the Expense Category name.)
    @property {String} description (Enter a brief description of the Expense Category.)
    @property {String} isActive (Select to show the Expense Category as active. Not selecting means the Expense Category will be considered inactive. To re-activate an Expense Category, simply select this option.)
    */
  var spec = {
      recordType: "XM.ExpenseCategory",
      skipSmoke: true,
      skipCrud: true,
      enforceUpperKey: false,
    /**
      @member Other
      @memberof ExpenseCategory
      @description The ExpenseCategory Collection is not cached.
    */
      collectionType: "XM.ExpenseCategoryCollection",
      listKind: "XV.ExpenseCategoryList",
      instanceOf: "XM.Document",
      cacheName: null,
    /**
      @member Settings
      @memberof ExpenseCategory
      @description ExpenseCategory is lockable.
    */
      isLockable: true,
    /**
      @member Settings
      @memberof ExpenseCategory
      @description The ID attribute is "code"
    */
      attributes: ["id", "code", "description", "isActive"],
      requiredAttributes: ["code"],
      idAttribute: "code",
    /**
      @member Setup
      @memberof ExpenseCategory
      @description Used in Inventory, Purchase and Accounting modules
    */
      extensions: ["inventory,purchasing,accounting"],
       /**
      @member Privileges
      @memberof ExpenseCategory
      @description Users can create, update, and delete ExpenseCategory if they have the 'MaintainExpenseCategories' privilege.
    */
      privileges: {
        createUpdateDelete: ["MaintainExpenseCategories"],
        read: true
      }
      
    };
  var additionalTests =  function () {
    /**
      @member Navigation
      @memberof ExpenseCategory
      @description An Action gear exists in the 'ExpenseCategories' work space  with Delete option:
      */
      it.skip("Action gear should exist in the ExpenseCategories work space with 'Delete' option if" +
      "the user has 'MaintainExpenseCategories privilege'", function () {
      });
      /**
      @member Buttons
      @memberof ExpenseCategory
      @description ExpenseCategory should exist with an Active check box in-order to activate or deactivate an ExpenseCategory
     */
      it.skip("ExpenseCategory should exist with an Active check box to activate or deactivate the expense category", function () {
      });
	};
  exports.spec = spec;
  exports.additionalTests = additionalTests;

}());
    