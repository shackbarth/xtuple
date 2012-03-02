create or replace function xt.dispatch(data_hash text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* initialize plv8 if needed */
  if(!this.isInitialized) executeSql('select xt.js_init()');

  /* support methods */
  function toArray(e) {
    return Array.prototype.slice.call(e);
  }
  
  Function.prototype.curry = function() {
    if (arguments.length<1) {
        return this; //nothing to curry with - return function
    }
    var __method = this;
    var args = arguments[0]; //toArray(arguments);
        return function() {
        return __method.apply(this, args.concat(toArray(arguments)));
    }
  }

  /* process */
  var dataHash = JSON.parse(data_hash),
      nameSpace = dataHash.className.beforeDot(),
      type = dataHash.className.afterDot(),
      obj = this[nameSpace][type],
      f = dataHash.functionName, 
      params = dataHash.parameters,
      args = params instanceof Array ? params : [params], 
      method = obj[f].curry(args),
      ret;

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
                           "className":"XM.Session",
                           "functionName":"fetchId",
                           "parameters":"XM.Address"
                           }$$);

select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.Session",
                          "functionName":"fetchNumber",
                          "parameters":"XM.Incident"
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
                          "parameters":[137]
                          }$$);    
select xt.dispatch($${"requestType":"dispatch",
                          "className":"XM.Invoice",
                          "functionName":"postALl",
                          "parameters":[false]
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
*/
