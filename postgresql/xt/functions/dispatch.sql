create or replace function xt.dispatch(data_hash text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* initialize plv8 if needed */
  if(!this.isInitialized) executeSql('select xt.js_init()');
  
  var dataHash = JSON.parse(data_hash),
      nameSpace = dataHash.className.beforeDot(),
      type = dataHash.className.afterDot(),
      obj = this[nameSpace][type],
      f = dataHash.functionName,
      args = dataHash.parameters, ret;

  ret = obj.isDispatchable ? obj[f](args) : false;
  
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
                          "parameters":{"id":41}
                          }$$);

select xt.dispatch($${"requestType":"dispatch",
                           "className":"XM.Session",
                           "functionName":"fetchId",
                           "parameters":{"recordType":"XM.Address"}
                           }$$);

select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.Session",
                          "functionName":"fetchNumber",
                          "parameters":{"recordType":"XM.Incident"}
                          }$$);

select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.Session",
                          "functionName":"locale"
                          }$$);

select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.Session",
                          "functionName":"metrics"
                          }$$);

select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.Session",
                          "functionName":"privileges"
                          }$$);    

select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.Invoice",
                          "functionName":"post",
                          "parameters":{"id":129}
                          }$$);        
select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.Invoice",
                          "functionName":"void",
                          "parameters":{"id":129}
                          }$$);                 
*/
