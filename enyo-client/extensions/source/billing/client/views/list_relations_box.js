/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.billing.initListRelationsBox = function () {

    // ..........................................................
    // RECEIVABLE TAXES
    //

    enyo.kind({
      name: "XV.ReceivableTaxBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_tax".loc(),
      editor: "XV.ReceivableTaxEditor",
      parentKey: "receivable",
      listRelations: "XV.ReceivableTaxListRelations",
      fitButtons: false,
      create: function () {
        this.inherited(arguments);
        this.$.deleteButton.setShowing(false);
      }
    });

    // ..........................................................
    // RECEIVABLE APPLICATIONS
    //

    enyo.kind({
      name: "XV.ReceivableApplicationsListRelationsBox",
      kind: "XV.ListRelationsBox",
      title: "_applications".loc(),
      parentKey: "receivable",
      listRelations: "XV.ReceivableApplicationListRelations"
    });

    enyo.kind({
      name: 'XV.CashReceiptAllocations',
      kind: 'XV.ListRelationsEditorBox',
      editor: 'XV.CashReceiptEditor',
      listRelations: 'XV.CashReceiptAllocationList',
      title: '_payment'.loc()
    });

    /**
     * @class XV.CashReceiptApplicationsBox
     * @extends XV.ListRelationsBox
     * @see XV.CashReceiptApplicationsList
     */
    enyo.kind({
      name: 'XV.CashReceiptApplicationsBox',
      kind: 'XV.ListRelationsEditorBox',
      editor: 'XV.CashReceiptLineEditor',
      parentKey: 'cashReceipt',
      listRelations: 'XV.CashReceiptLineList',
      title: '_cashReceiptApplications'.loc(),
      /*
      create: function () {
        this.inherited(arguments);

        this.$.buttonsPanel.createComponents([
          { content: 'Apply Balance', ontap: 'onApplyBalanceTap' },
          { content: 'Apply Line', ontap: 'onApplyLineTap' },
          { content: 'Clear Line', ontap: 'onClearLineTap' },
        ]);
      }
      */
    });
  };

}());
