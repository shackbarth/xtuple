create or replace function xm.js_address() returns void as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Address = {};

  XM.Address.isDispatchable = true,

  /* Returns the address id of an address found
     that matches the arguments.

   @param {Object} Address object
   @returns {Boolean}
  */
  XM.Address.findExisting = function() {
    var resp, args = arguments[0],
        sql = "select addr_id as id "
            + "from addr "
            + "where ((coalesce(upper(addr_line1),'') = coalesce(upper($1),'')) "
            + "and (coalesce(upper(addr_line2),'') = coalesce(upper($2),'')) "
            + "and (coalesce(upper(addr_line3),'') = coalesce(upper($3),'')) "
            + "and (coalesce(upper(addr_city),'') = coalesce(upper($4),'')) "
            + "and (coalesce(upper(addr_state),'') = coalesce(upper($5),'')) "
            + "and (coalesce(upper(addr_postalcode),'') = coalesce(upper($6),'')) "
            + "and (coalesce(upper(addr_country),'') = coalesce(upper($7),''))) ";

    if(args.type !== 'Address') throw new Error('Invalid type passed to XM.Address.findExisting.');
    
    resp = executeSql(sql,[args.line1, args.line2, args.line3, args.city, args.state, args.postalcode, args.country]);

    return resp.length ? resp[0].id : 0;
  }

  /* Returns the number of records on which an address is referenced. 

     @param {Number} address id
     @returns {Number}
  */
  XM.Address.useCount = function() {
    var args = arguments[0];
    
    return executeSql('select addrUseCount($1) as result', [args.id])[0].result;
  }

$$ language plv8;

select private.register_js('XM','Address','xtuple','xm.js_address');

