create or replace function xm.fetch_number(type_name text) 
  returns integer stable as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  // ..........................................................
  // PROCESS
  //

  var typeName = JSON.parse(type_name),
      /* decamelize model name for private.modelbas query*/
      modelName = typeName.type.replace((/([a-z])([A-Z])/g), '$1_$2').toLowerCase(),
      modelSql = "select o.orderseq_name "
                  + "from orderseq o "
                  + "join private.modelbas m on o.orderseq_id = m.modelbas_orderseq_id "
                  + "where m.model_name = $1",
      fetchSql = "select fetchnextnumber($1)",
      orderSeqId, nextNumber;

  orderSeqName = executeSql(modelSql,[modelName]);
  orderSeqName = orderSeqName[0].orderseq_name;

  if (orderSeqName.length) {
    nextNumber = executeSql(fetchSql,[orderSeqName]);
    return nextNumber.length ? nextNumber[0].fetchnextnumber : 0;

  } else {
    throw new Error("Invalid Model Type!");
    };

$$ LANGUAGE plv8;

/* Tests 

select public.fetchnextnumber('ContactNumber');
select * from xm.contact order by guid desc;
select private.retrieve_record('XM.Contact',36);
select xm.fetch_number(E'{"type":"Contact"}');

*/