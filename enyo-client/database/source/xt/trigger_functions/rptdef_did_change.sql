create or replace function xt.rptdef_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

  var formExists,
    preSql = "select case when form_id then true else false end as exists " +
           "from xt.form where form_rptdef_id = $1;",
    sql1;

  formExists = plv8.execute(preSql, [NEW.rotdef_id]);

  if (TG_OP === 'INSERT' && NEW.rptdef_id && NEW.rptdef_id && NEW.rptdef_record_type &&
    NEW.rptdef_grade && NEW.rptdef_definition) {

    sql1 = "insert into xt.form (form_name, form_description, form_rptdef_id) " +
          "select trim(leading 'XM.' from rptdef_record_type), rptdef_record_type, rptdef_id " +
          "from xt.rptdef where rptdef_id = $1; ";

    if (!formExits) {
      plv8.execute(sql1, [NEW.rptdef_id]);
    } else {
      plv8.elog(WARNING, "Form already exists for this report definition. sql1: " + sql1);
    }
  }

  if (TG_OP === 'UPDATE' && NEW.rptdef_id && NEW.rptdef_id && NEW.rptdef_record_type &&
    NEW.rptdef_grade && NEW.rptdef_definition) {

    sql1 = "update xt.form set form_name = trim(leading 'XM.' from $1), form_description = $1, " +
           "form_rptdef_id = $2;";

    if (formExists) {
      plv8.execute(sql1, [NEW.rpddef_record_type, NEW.rptdef_id]);
    } else {
      plv8.elog(WARNING, "Form doesn't exist for this report definition. sql1: " + sql1);
    }
  }

  return NEW;

}());

$$ language plv8;
