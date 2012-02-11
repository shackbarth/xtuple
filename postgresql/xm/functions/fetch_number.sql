create or replace function xm.fetch_number(type_name text) 
  returns text stable as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  // ..........................................................
  // PROCESS
  //

  /* decamelize model name for private.modelbas query*/
  var modelName = type_name.replace((/([a-z])([A-Z])/g), '$1_$2').toLowerCase(),
      modelSql = "select o.orderseq_name as result "
                  + "from orderseq o "
                  + "join private.modelbas m on o.orderseq_id = m.modelbas_orderseq_id "
                  + "where m.model_name = $1",
      fetchSql = "select fetchnextnumber($1) as result",
      orderSeqName, nextNumber;

  orderSeqName = executeSql(modelSql,[modelName])[0].result;

  if (orderSeqName.length) {
    nextNumber = executeSql(fetchSql,[orderSeqName])[0].result;
    return nextNumber.length ? nextNumber : '0';

  } else {
    throw new Error("Invalid Model Type!");
    };

$$ LANGUAGE plv8;

/* Tests 

select o.orderseq_name as result
 from orderseq o
 join private.modelbas m on o.orderseq_id = m.modelbas_orderseq_id
 where m.model_name = 'contact';

select guid, number from xm.contact order by guid desc;

select private.retrieve_record('XM.Contact',36);

select xm.fetch_number('Contact');

*/