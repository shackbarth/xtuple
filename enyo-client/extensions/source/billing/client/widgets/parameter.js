(function () {

  XT.extensions.billing.initParameters = function () {

    // ..........................................................
    // RECEIVABLE
    //

    enyo.kind({
      name: "XV.ReceivableListParameters",
      kind: "XV.ParameterWidget",
      defaultParameters: function () {
        return {
          showDebits: true,
          showCredits: true,
          asOfDate: new Date()
        };
      },
      components: [
        {kind: "onyx.GroupboxHeader", content: "_receivable".loc()},
        {name: "number", label: "_number".loc(), attr: "number"},
        {name: "asOfDate", label: "_asOf".loc(), attr: "closeDate", defaultKind: "XV.DateWidget",
          getParameter: function () {
            var param;
            if (this.getValue()) {
              param = [{
                attribute: this.getAttr(),
                operator: '<=',
                value: this.getValue(),
                includeNull: true
              },
              {
                attribute: "documentDate",
                operator: '>=',
                value: this.getValue()
              }];
            }
            return param;
          }
        },
        {kind: "onyx.GroupboxHeader", content: "_show".loc()},
        {name: "showUnposted", label: "_unposted".loc(),
          attr: "isPosted", defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: '=',
                value: true
              };
            }
            return param;
          }
        },
        // TODO: Look at close date
        {name: "showClosed", label: "_closed".loc(),
          attr: "isPosted", defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: '=',
                value: false
              };
            }
            return param;
          }
        },
        {name: "showDebits", label: "_debits".loc(),
          attr: "documentType", defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: '!=',
                value: XM.Receivable.DEBIT_MEMO
              };
            }
            return param;
          }
        },
        {name: "showCredits", label: "_credits".loc(),
          attr: "documentType", defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: '!=',
                value: XM.Receivable.DEBIT_MEMO
              };
            }
            return param;
          }
        },
        {kind: "onyx.GroupboxHeader", content: "_customer".loc()},
        {name: "customer", attr: "customer", label: "_customer".loc(),
          defaultKind: "XV.BillingCustomerWidget"},
        {name: "customerType", attr: "customer.customerType", label: "_customerType".loc(),
          defaultKind: "XV.CustomerTypePicker"},
        // TODO:
        //   - Type Pattern (text)
        //   - Group
        {kind: "onyx.GroupboxHeader", content: "_dueDate".loc()},
        {name: "fromDate", label: "_fromDate".loc(), attr: "dueDate", operator: ">=",
          defaultKind: "XV.DateWidget"},
        {name: "toDate", label: "_toDate".loc(), attr: "dueDate", operator: "<=",
          defaultKind: "XV.DateWidget"},
        {kind: "onyx.GroupboxHeader", content: "_documentDate".loc()},
        {name: "fromDocDate", label: "_fromDate".loc(), attr: "documentDate", operator: ">=",
          defaultKind: "XV.DateWidget"},
        {name: "toDocDate", label: "_toDate".loc(), attr: "documentDate", operator: "<=",
          defaultKind: "XV.DateWidget"}
      ]
    });
  };

}());
