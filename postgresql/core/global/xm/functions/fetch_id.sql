create or replace function xm.fetch_id(type_name text) 
  returns integer stable as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  // ..........................................................
  // PROCESS
  //

  var typeName = JSON.parse(type_name),
      /* decamelize model name for private.modelbas query*/
      modelName = typeName.type.replace((/([a-z])([A-Z])/g), '$1_$2').toLowerCase(),
      modelSql = "select modelbas_id_seq_name "
                 + "from modelbas "
                 + "where model_name = $1",
      seqName;

      seqName = executeSql(modelSql,[modelName]);

      return seqName.length ? nextval(seqName[0].modelbas_id_seq_name) : throw new Error("Invalid Sequence Name!");

$$ LANGUAGE plv8;