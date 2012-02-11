create or replace function xm.dispatch(payload text) 
  returns text volatile as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  // ..........................................................
  // PROCESS
  //

  var jsonObj = JSON.parse(payload),
      fName = jsonObj.function_name,
      paramObj = jsonObj.params,
      paramArray = [],
      sql, resp;

  /* build the parameter list for the function call */
  for(var key in paramObj) {
    paramArray.push("'" + paramObj[key] + "'");
  };
  
  /* function call */
  sql = "select xm." + fName + "(" + paramArray.toString() + ") as result";
  print(NOTICE,'sql: ',sql);

  resp = executeSql(sql)[0].result;
  
  /* isJSON determines type of return to the client:
      true - response is already stringified by the called function
     false - response needs to be stringified */
  return jsonObj.isJSON ? resp : JSON.stringify(resp);

$$ LANGUAGE plv8;

/* Tests

select xm.dispatch(E'{"request_type":"callFunction",
                      "function_name":"address_find_existing",
                      "params": {"type":"Address","line1":"Tremendous Toys Inc.","line2":"101 Toys Place","line3":"","city":"Walnut Hills","state":"VA","postalcode":"22209","country":"United States"},
                      "isJSON":true
                     }');

select xm.dispatch(E'{"request_type":"callFunction",
                      "function_name":"fetch_id",
                      "params":{"type":"Address"},
                      "isJSON":false
                     }');

select xm.dispatch(E'{"request_type":"callFunction",
                      "function_name":"fetch_number",
                      "params":{"type":"Contact"},
                      "isJSON":false
                     }');

select guid from xm.address order by guid desc;

select xm.dispatch(E'{"request_type":"callFunction",
                      "function_name":"address_use_count",
                      "params":{"guid":41},
                      "isJSON":false
                     }');
                     
*/