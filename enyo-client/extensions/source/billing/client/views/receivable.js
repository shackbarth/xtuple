XT.extensions.billing.initReceivableView = function () {

  var model = 'XM.Receivable';

  /**
    View of Receivable business object.
    @class XM.ReceivableView
    @extends XM.EnyoView
    @model XM.Receivable
  */
  XM.ReceivableView = XM.EnyoView.extend({

    events: {
      'view:notify': 'doNotify',
      'statusChange': 'onStatusChange',
      'change:documentType': 'onDocumentTypeChange'
    }

  });
};

