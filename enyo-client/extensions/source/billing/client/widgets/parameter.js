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
        {name: "number", label: "_number".loc(), attr: "documentNumber", defaultKind: "XV.NumberWidget"},
        {name: "asOfDate", label: "_asOf".loc(), attr: "closeDate", defaultKind: "XV.DateWidget",
          getParameter: function () {
            var param;
            if (this.getValue()) {
              param = [{
                attribute: this.getAttr(),
                operator: '>=',
                value: this.getValue(),
                includeNull: true
              },
              {
                attribute: "documentDate",
                operator: '<=',
                value: this.getValue(),
                includeNull: true
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
        {name: "showClosed", label: "_closed".loc(),
          attr: "closeDate", defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: '=',
                value: null,
                includeNull: true
              };
            }
            return param;
          }
        },
        // TODO: ***These are not working
        {name: "showDebits", label: "_debits".loc(),
          attr: "documentType", defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: '!=',
                value: 'D'
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
                value: 'C'
              };
            }
            return param;
          }
        },
        {kind: "onyx.GroupboxHeader", content: "_customer".loc()},
        {name: "customer", attr: "customer", label: "_customer".loc(),
          defaultKind: "XV.SalesCustomerWidget"},
        {name: "customerType", attr: "customer.customerType", label: "_customerType".loc(),
          defaultKind: "XV.CustomerTypePicker"},
        // // TODO:
        // //   - Type Pattern (text)
        // //   - Group
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
      ],
      /**
        The As Of parameter will only be enabled when unposted and closed are unchecked.
        Otherwise it will be set to the current date and disabled.
      */
      parameterChanged: function (inSender, inEvent) {
        if (inSender.name === "showClosed" || inSender.name === "showUnposted") {
          //both must be unchecked for enabled date
          var unchecked = this.$.showClosed.getValue() || this.$.showUnposted.getValue();
          this.$.asOfDate.$.input.setDisabled(unchecked);
        }
      },
    });


    enyo.kind({
      name: "XV.CashReceiptListParameters",
      kind: "XV.ParameterWidget",
      defaultParameters: function () {
        return {
          showPosted: true
        };
      }
    });
  };
}());
