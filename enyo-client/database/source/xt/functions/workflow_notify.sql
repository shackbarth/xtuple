drop function if exists xt.workflow_notify(uuid);

create or replace function xt.workflow_notify(uuid uuid) returns boolean volatile as $$

  plv8.elog(NOTICE, "Email", uuid);
  var selectSql = "select cohead.*, emlprofile.* from xt.wf " +
      "inner join cohead on wf_parent_uuid = cohead.obj_uuid " +
      "inner join saletype on cohead_saletype_id = saletype_id " +
      "inner join xt.saletypeext on saletypeext_id = saletype_id " +
      "inner join xt.emlprofile on saletypeext_emlprofile_id = emlprofile_id " +
      "where wf.obj_uuid = $1;",
    results = plv8.execute(selectSql, [uuid]),
    payload;

  if(results.length) {
    payload = {action: "email", content: {
      from: results[0].emlprofile_from,
      to: results[0].emlprofile_to,
      subject: results[0].emlprofile_subject,
      text: results[0].emlprofile_body
    }};
    plv8.execute("select pg_notify($1, $2);", ["nodext", JSON.stringify(payload)]);
  }

$$ language plv8;

