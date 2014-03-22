XT.extensions.billing.initCashReceiptView = function () {

  var model = 'XM.CashReceipt';

  /**
   * View of a CashReceipt business object.
   * @class XM.CashReceiptView
   * @extends XM.EnyoView
   * @model XM.CashReceipt
   */
  XM.CashReceiptView = XM.EnyoView.extend({

    events: {
      'view:notify': 'doNotify',
      'change:distributionDate': 'onDateChange',
      'change:applicationDate': 'onDateChange',
      'change:balance': 'onBalanceChange'
    },

    item: {
      model: model + 'ListItem',
      template: [
        [
          {attr: 'number', colspan: 2},
          {attr: 'posted', formatter: 'formatIsPosted'},
          {attr: 'amount'},
          {attr: 'distributionDate'}
        ],
        [
          {attr: 'customer.name', colspan: 2},
          {attr: 'fundsType', formatter: 'formatFundsType'},
          {attr: 'bankAccount.name'}
        ]
      ],
    },

    list: {
      model: model + 'ListItem',
      allowPrint: true,
      query: {
        orderBy: [
          {attribute: 'distributionDate', descending: true},
          {attribute: 'number', descending: true}
        ]
      },
      parameters: [
        {category: '_cashReceipts'.loc(), parameters: [
          {label: '_number'.loc()}
        ]},
        {category: '_show'.loc(), parameters: [
          {label: '_unposted'.loc(), default: false }
        ]},
        {category: '_customer'.loc(), parameters: [
          {label: '_number'.loc()},
          {label: '_type'.loc(), type: 'enum'},
          {label: '_typePattern'.loc()},
          {label: '_group'.loc()}
        ]},
        {category: '_documentDate'.loc(), parameters: [
          {label: '_fromDate'.loc()},
          {label: '_toDate'.loc()}
        ]}
      ],
      actions: [
        {name: 'post', privilege: "PostCashReceipts", prerequisite: 'canPost',
          method: 'post'},
        {name: 'void', privilege: "VoidPostedCashReceipts",
          prerequisite: 'canVoid', method: 'void'}
      ]
    },

    workspace: {
      model: model,
      panels: [
        {
          title: '_overview'.loc(),
          template: [

          ]
        },
        {
          type: 'relation',
          attribute: 'lineItems'
        }
      ],
      relations: [
      ]
    }
  });
};

