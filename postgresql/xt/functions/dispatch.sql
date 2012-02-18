create or replace function xt.dispatch(data_hash text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* initialize plv8 if needed */
  if(!this.isInitialized) executeSql('select xt.js_init()');
  
  var dataHash = JSON.parse(data_hash),
      nameSpace = dataHash.object.beforeDot(),
      type = dataHash.object.afterDot(),
      obj = this[nameSpace][type],
      f = dataHash.function,
      args = dataHash.arguments, ret;

  ret = obj.isDispatchable ? obj[f](args) : false;
  
  return dataHash.isJSON ? JSON.stringify(ret) : ret;

$$ LANGUAGE plv8;

/*
select xt.dispatch($${"requestType":"dispatch",
                           "object": "XM.Address",
                           "function":"findExisting",
                           "arguments": {"type": "Address", "line1":"Tremendous Toys Inc.","line2":"101 Toys Place","line3":"","city":"Walnut Hills","state":"VA","postalcode":"22209","country":"United States"}
                          }$$);


select xt.dispatch($${"requestType":"dispatch",
                          "object":"XM.Address",
                          "function":"useCount",
                          "arguments":{"id":41}
                          }$$);

select xt.dispatch($${"requestType":"dispatch",
                           "object":"XT.Session",
                           "function":"fetchId",
                           "arguments":{"recordType":"XM.Address"}
                           }$$);

select xt.dispatch($${"requestType":"dispatch",
                          "object":"XT.Session",
                          "function":"fetchNumber",
                          "arguments":{"recordType":"XM.Incident"}
                          }$$);

select xt.dispatch($${"requestType":"dispatch",
                          "object":"XT.Session",
                          "function":"locale"
                          }$$);

select xt.dispatch($${"requestType":"dispatch",
                          "object":"XT.Session",
                          "function":"metrics"
                          }$$);

select xt.dispatch($${"requestType":"dispatch",
                          "object":"XT.Session",
                          "function":"privileges"
                          }$$);                          
*/
