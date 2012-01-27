create or replace function xm.address_find_existing(address text) 
  returns text stable as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  // ..........................................................
  // PROCESS
  //

  var a = JSON.parse(address),
      line1, line2, line3, city, state, postalcode, country, sql, resp;

  if(a.type !== 'Address') {
    throw new Error("Class type invalid: must be type Adress!");

  } else {
      sql = "select address "
          + "from xm.address "
          + "where ((coalesce(upper(line1),'') = coalesce(upper($1),'')) "
          + "and (coalesce(upper(line2),'') = coalesce(upper($2),'')) "
          + "and (coalesce(upper(line3),'') = coalesce(upper($3),'')) "
          + "and (coalesce(upper(city),'') = coalesce(upper($4),'')) "
          + "and (coalesce(upper(state),'') = coalesce(upper($5),'')) "
          + "and (coalesce(upper(postalcode),'') = coalesce(upper($6),'')) "
          + "and (coalesce(upper(country),'') = coalesce(upper($7),''))) ";

      line1 = a.line1;
      line2 = a.line2;
      line3 = a.line3;
      city = a.city;
      state = a.state;
      postalcode = a.postalcode;
      country = a.country;

      resp = executeSql(sql,[line1,
                             line2,
                             line3,
                             city,
                             state,
                             postalcode,
                             country]);

      return resp.length ? JSON.stringify(resp[0]) : '{}';
    };

$$ LANGUAGE plv8;
