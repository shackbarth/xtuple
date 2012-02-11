create or replace function xm.address_find_existing(type text, line1 text, line2 text, line3 text, city text, state text, postalcode text, country text) 
  returns text stable as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  // ..........................................................
  // PROCESS
  //

  var sql, resp, guid, ret;

  if(type !== 'Address') {
    throw new Error("Class type invalid: must be type Adress!");

  } else {
      sql = "select * "
          + "from xm.address "
          + "where ((coalesce(upper(line1),'') = coalesce(upper($1),'')) "
          + "and (coalesce(upper(line2),'') = coalesce(upper($2),'')) "
          + "and (coalesce(upper(line3),'') = coalesce(upper($3),'')) "
          + "and (coalesce(upper(city),'') = coalesce(upper($4),'')) "
          + "and (coalesce(upper(state),'') = coalesce(upper($5),'')) "
          + "and (coalesce(upper(postalcode),'') = coalesce(upper($6),'')) "
          + "and (coalesce(upper(country),'') = coalesce(upper($7),''))) ";

      resp = executeSql(sql,[line1,
                             line2,
                             line3,
                             city,
                             state,
                             postalcode,
                             country]);

      if(resp.length) {
        guid = resp[0].guid;
        sql = "select private.retrieve_record('XM.Address', $1) as result";
        ret = executeSql(sql,[guid])[0].result;
        ret = JSON.parse(ret);
        return JSON.stringify(ret);

      } else {
          return '{}';
       };
    };

$$ LANGUAGE plv8;

/*
select private.fetch(E'{ "query": {"recordType":"XM.Address",
                                   "parameters":{}, 
                                  "conditions":"", 
                                  "orderBy":"guid"}}');

select private.retrieve_record('XM.Address',1);

(E'{"line1":"Tremendous Toys Inc.","line2":"101 Toys Place","line3":"","city":"Walnut Hills","state":"VA","postalcode":"22209","country":"United States","type":"Address"}');

select xm.address_find_existing('Address','Tremendous Toys Inc.','101 Toys Place','','Walnut Hills','VA','22209','United States');
*/
