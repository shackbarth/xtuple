/**
    Look up the sourceCode match of a primary key using the Docuements map.

    @param pkey integer
      Primary key of the object to look for matching source code.

    @returns {text}
      e.g. ADDR
*/
create or replace function xt.get_source_code(pkey text) returns text as $$

  /* @See: https://github.com/xtuple/qt-client/blob/master/widgets/documents.cpp#L35 */
  /* TODO: Only adding a few for now for objects that are supported. */
  var docMap = {
    addr_id: "ADDR",
    crmacct_id: "CRMA",
    cntct_id: "T",
    cust_id: "C",
    incdt_id: "INCDT",
    prj_id: "J",
    prjtask_id: "TASK",
    shipto_id: "SHP",
    todoitem_id: "TODO",
  };

  if (docMap[pkey]) {
    return docMap[pkey];
  } else {
    return false;
  }

$$ language plv8;