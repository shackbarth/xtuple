/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global _:true */

(function () {
  "use strict";

  var path = require('path');

  var convertFromMetasql = function (content, filename, defaultSchema) {
    var lines = content.split("\n"),
      schema = defaultSchema ? "'" + defaultSchema + "'" : "NULL",
      group,
      i = 2,
      name,
      notes = "",
      grade = 0,
      deleteSql,
      insertSql;

    if (lines[0].indexOf("-- Group: ") !== 0 ||
        lines[1].indexOf("-- Name: ") !== 0 ||
        lines[2].indexOf("-- Notes:") !== 0) {
      throw new Error("Improperly formatted metasql: " + filename);
    }
    group = lines[0].substring("-- Group: ".length).trim();
    name = lines[1].substring("-- Name: ".length).trim();
    while (lines[i].indexOf("--") === 0) {
      notes = notes + lines[i].substring(2) + "\n";
      i++;
    }
    notes = notes.substring(" Notes:".length);
    if (notes.indexOf("must be grade 10") >= 0) {
      grade = 10;
    }

    insertSql = "select saveMetasql (" +
      "'" + group + "'," +
      "'" + name + "'," +
      "$$" + notes + "$$," +
      "$$" + content + "$$," +
      "true, " + schema + ", " + grade + ");";

    return insertSql;
  };

  var convertFromReport = function (content, filename, defaultSchema) {
    var lines = content.split("\n"),
      name,
      grade = "0",
      tableName = defaultSchema ? defaultSchema + ".pkgreport" : "report",
      description,
      upsertSql;

    if (lines[3].indexOf(" <name>") !== 0 ||
        lines[4].indexOf(" <description>") !== 0) {
      throw new Error("Improperly formatted report");
    }
    name = lines[3].substring(" <name>".length).trim();
    name = name.substring(0, name.indexOf("<"));
    description = lines[4].substring(" <description>".length).trim();
    description = description.substring(0, description.indexOf("<"));
    if (lines[5].indexOf("grade") >= 0) {
      grade = lines[5].substring(" <grade>".length).trim();
      grade = grade.substring(0, grade.indexOf("<"));
    }

    upsertSql = "do language plpgsql $do$" +
                "declare _grade integer := null;" +
                " begin" +
                "  select min(report_grade) into _grade" +
                "    from " + tableName +
                "   where report_name = '" + name + "';" +
                "  if _grade is null then" +
                "    insert into " + tableName + " (report_name, report_descrip," +
                "        report_source, report_loaddate, report_grade)" +
                "      select '" + name + "', $$" + description + "$$," +
                "        $$" + content + "$$, now(), min(sequence_value)" +
                "        from sequence" +
                "       where sequence_value >= " + grade + "" +
                "         and sequence_value not in (" +
                "        select report_grade from report" +
                "         where report_name = '" + name + "'" +
                "       );" +
                "  else " +
                "    update " + tableName + " set" +
                "      report_descrip = $$" + description + "$$," +
                "      report_source = $$" + content + "$$," +
                "      report_loaddate = now() " +
                "     where report_name = '" + name + "'" +
                "      and report_grade = _grade;" +
                "  end if;" +
                " end $do$;";
    return upsertSql;
  };

  var convertFromScript = function (content, filename, defaultSchema) {
    var name = path.basename(filename, '.js'),
      tableName = defaultSchema ? defaultSchema + ".pkgscript" : "unknown",
      notes = "", //"xtMfg package",
      insertSql,
      updateSql;

    insertSql = "insert into " + tableName + " (script_name, script_order, script_enabled, " +
      "script_source, script_notes) select " +
      "'" + name + "', 0, TRUE, " +
      "$$" + content + "$$," +
      "'" + notes + "'" +
      " where not exists (select c.script_id from " + tableName + " c " +
      "where script_name = '" + name + "');";

    updateSql = "update " + tableName + " set " +
      "script_name = '" + name + "', script_order = 0, script_enabled = TRUE, " +
      "script_source = $$" + content +
      "$$, script_notes = '" + notes + "' " +
      "where script_name = '" + name + "';";

    return insertSql + updateSql;
  };

  var convertFromUiform = function (content, filename, defaultSchema) {
    var name = path.basename(filename, '.ui'),
      tableName = defaultSchema ? defaultSchema + ".pkguiform" : "unknown",
      notes = "", //"xtMfg package",
      insertSql,
      updateSql;

    insertSql = "insert into " + tableName + " (uiform_name, uiform_order, uiform_enabled, " +
      "uiform_source, uiform_notes) select " +
      "'" + name + "', 0, TRUE, " +
      "$$" + content + "$$," +
      "'" + notes + "' " +
      " where not exists (select c.uiform_id from " + tableName + " c " +
      "where uiform_name = '" + name + "');";

    updateSql = "update " + tableName + " set uiform_name = '" +
      name + "', uiform_order = 0, uiform_enabled = TRUE, " +
      "uiform_source = $$" + content + "$$, uiform_notes = '" + notes + "' " +
      "where uiform_name = '" + name + "';";

    return insertSql + updateSql;
  };

  exports.conversionMap = {
    mql: convertFromMetasql,
    xml: convertFromReport,
    js: convertFromScript,
    ui: convertFromUiform,
    sql: function (content) {
      // no op
      return content;
    }
  };
}());
