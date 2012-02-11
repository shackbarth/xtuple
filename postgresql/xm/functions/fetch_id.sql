create or replace function xm.fetch_id(type_name text) 
  returns integer volatile as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  // ..........................................................
  // PROCESS
  //

      /* decamelize model name for private.modelbas query*/
  var modelName = type_name.replace((/([a-z])([A-Z])/g), '$1_$2').toLowerCase(),
      modelSql = "select modelbas_id_seq_name as result "
                 + "from private.modelbas "
                 + "where model_name = $1",
      nextSql = "select nextval($1) as result",
      seqName, nextId;

      seqName = executeSql(modelSql,[modelName])[0].result;

      if(seqName.length) { 
        nextId = executeSql(nextSql,[seqName])[0].result;
        return nextId;

      } else {
          throw new Error("Invalid Sequence Name!");
        };

$$ LANGUAGE plv8;

/* Tests

select xm.fetch_id('Address');

*/