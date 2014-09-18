drop function if exists xt.add_report_definition(text, text, integer, text);

create or replace function xt.add_report_definition(name text, record_type text, grade integer, definition text) returns boolean volatile as $$

  var sqlCount = "select count(*) as count from xt.rptdef where rptdef_record_type = $1 and rptdef_grade = $2;",
    sqlInsert = "insert into xt.rptdef (rptdef_name, rptdef_record_type, rptdef_grade, rptdef_definition) values ($1, $2, $3, $4)", 
    sqlUpdate = "update xt.rptdef set rptdef_definition = $3 where rptdef_record_type = $1 and rptdef_grade = $2", 
    count = plv8.execute(sqlCount, [ record_type, grade ])[0].count;

    plv8.execute(count > 0 ? sqlUpdate : sqlInsert, [name, record_type, grade, definition]);
    return true;

$$ language plv8;
