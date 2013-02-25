create or replace function xt.dispatch(data_hash text) returns text as $$

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

  if (dataHash.username) { XT.username = dataHash.username; }

  if(obj[f]) method = obj[f].curry(args);
  else throw new Error('Function ' + dataHash.className + '.' + f + ' not found.');

  try {
    ret = obj.isDispatchable ? method() : false;
  } catch (error) {
    plv8.elog(NOTICE, "Error caught", error);
    plv8.elog(ERROR, "Error caught", error);
  }

  return dataHash.isJSON ? JSON.stringify(ret) : ret;

$$ LANGUAGE plv8;

/*
select xt.js_init();
select xt.dispatch($${"username": "admin",
                      "requestType":"dispatch",
                           "className": "XM.Address",
                           "functionName":"findExisting",
                           "parameters": {"type": "Address", "line1":"Tremendous Toys Inc.","line2":"101 Toys Place","line3":"","city":"Walnut Hills","state":"VA","postalcode":"22209","country":"United States"}
                          }$$);

select xt.dispatch($${"username": "admin",
                      "requestType":"dispatch",
                          "className":"XM.Address",
                          "functionName":"useCount",
                          "parameters": 41
                          }$$);

select xt.dispatch($${"username": "admin",
                      "requestType":"dispatch",
                           "className":"XM.Model",
                           "functionName":"fetchId",
                           "parameters":"XM.Address"
                           }$$);

select xt.dispatch($${"username": "admin",
                      "requestType":"dispatch",
                          "className":"XM.Model",
                          "functionName":"fetchNumber",
                          "parameters":"XM.Incident"
                          }$$);

select xt.dispatch($${"username": "admin",
                      "requestType":"dispatch",
                          "className":"XT.Session",
                          "functionName":"locale"
                          }$$);

select xt.dispatch($${"username": "admin",
                      "requestType":"dispatch",
                          "className":"XT.Session",
                          "functionName":"settings"
                          }$$);

select xt.dispatch($${"requestType":"dispatch",
                          "className":"XT.Session",
                          "functionName":"privileges"
                          }$$);

select xt.dispatch($${"username": "admin",
                      "requestType":"dispatch",
                          "className":"XM.Crm",
                          "functionName":"commitSettings",
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

*/
