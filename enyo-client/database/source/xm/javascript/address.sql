select xt.install_js('XM','Address','xtuple', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Address = {};

  XM.Address.isDispatchable = true,

  /** 
  Returns the address id of an address found that matches the arguments.

  @param {Object} Address object
  @returns {Boolean}
  */
  XM.Address.findExisting = function(address) {
    var resp,
        sql = "select addr_number as id "
            + "from addr "
            + "where ((coalesce(upper(addr_line1),'') = coalesce(upper($1),'')) "
            + "and (coalesce(upper(addr_line2),'') = coalesce(upper($2),'')) "
            + "and (coalesce(upper(addr_line3),'') = coalesce(upper($3),'')) "
            + "and (coalesce(upper(addr_city),'') = coalesce(upper($4),'')) "
            + "and (coalesce(upper(addr_state),'') = coalesce(upper($5),'')) "
            + "and (coalesce(upper(addr_postalcode),'') = coalesce(upper($6),'')) "
            + "and (coalesce(upper(addr_country),'') = coalesce(upper($7),''))) ";

    if(address.type !== 'Address') throw new Error('Invalid type passed to XM.Address.findExisting.');
    
    resp = plv8.execute(sql,[address.line1, address.line2, address.line3, address.city, address.state, address.postalcode, address.country]);

    return resp.length ? resp[0].id : 0;
  }

  /**
  Returns the number of records on which an address is referenced. 

  @param {Number} address id
  @returns {Number}
  */
  XM.Address.useCount = function(id) {
    var resp = plv8.execute('select addrUseCount(addr_id) as result from addr where addr_number = $1;', [id])[0];
    return resp ? resp.result : 0;
  }

$$ );

