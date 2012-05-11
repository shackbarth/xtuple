create or replace function xt.dispatch(data_hash text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  if (!Function.prototype.curry) {
    /* support methods */  
    Function.prototype.curry = function() {
      if (arguments.length<1) {
          return this; //nothing to curry with - return function
      }
      var __method = this;
      var args = arguments[0]; 
          return function() {
          return __method.apply(this, args.concat(Array.prototype.slice.call(arguments)));
      }
    }
  }

  /* process */
  var dataHash = JSON.parse(data_hash),
      nameSpace = dataHash.className.beforeDot(),
      type = dataHash.className.afterDot(),
      obj = plv8[nameSpace][type],
      f = dataHash.functionName, 
      params = dataHash.parameters,
      args = params instanceof Array ? params : [params], 
      method, ret;

  if(obj[f]) method = obj[f].curry(args);
  else throw new Error('Function ' + dataHash.className + '.' + f + ' not found.');

  ret = obj.isDispatchable ? method() : false;
  
  return dataHash.isJSON ? JSON.stringify(ret) : ret;

$$ LANGUAGE plv8;

/*
select xt.dispatch($${"requestType":"dispatch",
                           "className": "XM.Address",
                           "functionName":"findExisting",
                           "parameters": {"type": "Address", "line1":"Tremendous Toys Inc.","line2":"101 Toys Place","line3":"","city":"Walnut Hills","state":"VA","postalcode":"22209","country":"United States"}
                          }$$);

select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.Address",
                          "functionName":"useCount",
                          "parameters": 41
                          }$$);

select xt.dispatch($${"requestType":"dispatch",
                           "className":"XT.Record",
                           "functionName":"fetchId",
                           "parameters":"XM.Address"
                           }$$);

select xt.dispatch($${"requestType":"dispatch",
                          "className":"XT.Record",
                          "functionName":"fetchNumber",
                          "parameters":"XM.Incident"
                          }$$);

select xt.dispatch($${"requestType":"dispatch",
                          "className":"XT.Session",
                          "functionName":"locale"
                          }$$);

select xt.dispatch($${"requestType":"dispatch",
                          "className":"XT.Session",
                          "functionName":"settings"
                          }$$);

select xt.dispatch($${"requestType":"dispatch",
                          "className":"XT.Session",
                          "functionName":"privileges"
                          }$$);    
                          
select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.Invoice",
                          "functionName":"post",
                          "parameters":[137]
                          }$$);  
                            
select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.Invoice",
                          "functionName":"postALl",
                          "parameters":[false]
                          }$$); 
                          
select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.InvoiceLine",
                          "functionName":"taxDetail",
                          "parameters":154
                          }$$);
                          
select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.Invoice",
                          "functionName":"freightTax",
                          "parameters":79
                          }$$);

select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.Invoice",
                          "functionName":"freightTax",
                          "parameters":[1,"01-01-2011", 1, 125]
                          }$$);
                              
select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.Invoice",
                          "functionName":"void",
                          "parameters":{"id":129}
                          }$$);    

select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.Payable",
                          "functionName":"approve",
                          "parameters":[264,13]
                          }$$);  

select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.Crm",
                          "functionName":"updateSettings",
                          "parameters":{ 
                            "NextCRMAccountNumber": 1,
                            "NextIncidentNumber": 1600,
                            "CRMAccountNumberGeneration": "A",
                            "UseProjects": true,
                            "AutoCreateProjectsForOrders": true,
                            "OpportunityChangeLog": false,
                            "DefaultAddressCountry": "Mexico",
                            "StrictAddressCountry": true,
                            "IncidentsPublicPrivate": true,
                            "IncidentPublicDefault": true,
                            "IncidentNewColor": "red",
                            "IncidentFeedbackColor": "purple",
                            "IncidentConfirmedColor": "yellow",
                            "IncidentAssignedColor": "blue",
                            "IncidentResolvedColor": "green",
                            "IncidentClosedColor": "grey"
                           }
                          }$$);    

select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.Receivables",
                          "functionName":"updateSettings",
                          "parameters":{ 
                            "NextARMemoNumber": 100,
                            "NextCashRcptNumber": 2000,
                            "HideApplyToBalance": true,
                            "EnableCustomerDeposits": false,
                            "CreditTaxDiscount": false,
                            "remitto_name": "Wacky Widgets, Inc.",
                            "remitto_address1": "123 Azalea Court",
                            "remitto_address2": "Unit 201",
                            "remitto_address3": "",
                            "remitto_city": "Murfreesboro",
                            "remitto_state": "TN",
                            "remitto_zipcode": "76811",
                            "remitto_country": "United States",
                            "remitto_phone": "478-112-8989",
                            "DefaultAutoCreditWarnGraceDays": 20,
                            "DefaultARIncidentStatus": 1,
                            "AutoCloseARIncident": true,
                            "RecurringInvoiceBuffer": 10
                           }
                          }$$);  

select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.Payables",
                          "functionName":"updateSettings",
                          "parameters":{ 
                            "NextAPMemoNumber": 100,
                            "ACHEnabled": false,
                            "ACHCompanyId": "",
                            "ACHCompanyIdType": "D",
                            "ACHCompanyName": "Wacky Widgets, Inc.",
                            "ACHDefaultSuffix": ".txt",
                            "EFTRoutingRegex": "",
                            "EFTAccountRegex": "",
                            "EFTFunction": "",
                            "NextACHBatchNumber": 200,
                            "ReqInvRegVoucher": true,
                            "ReqInvMiscVoucher": true,
                            "RecurringVoucherBuffer": 10
                           }
                          }$$);  

select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.GeneralLedger",
                          "functionName":"updateSettings",
                          "parameters":{ 
                            "GLMainSize": 5,
                            "GLCompanySize": 3,
                            "YearEndEquityAccount": 83,
                            "CurrencyGainLossAccount": 83,
                            "GLSeriesDiscrepancyAccount": 83,
                            "GLProfitSize": 3,
                            "GLFFProfitCenters": true,
                            "GLSubaccountSize": 3,
                            "GLFFSubaccounts": true,
                            "UseJournals": false,
                            "CurrencyExchangeSense": 0,
                            "MandatoryGLEntryNotes": false,
                            "ManualForwardUpdate": false,
                            "InterfaceToGL": false
                           }
                          }$$);         
*/
