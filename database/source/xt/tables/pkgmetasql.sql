-- table definition

select xt.create_table('pkgmetasql', 'xt', false, 'metasql');


ALTER TABLE xt.pkgmetasql DISABLE TRIGGER ALL;
DROP TRIGGER IF EXISTS pkgmetasqlaftertrigger ON xt.pkgmetasql;
CREATE TRIGGER pkgmetasqlaftertrigger AFTER INSERT OR DELETE OR UPDATE ON xt.pkgmetasql FOR EACH ROW EXECUTE PROCEDURE _pkgmetasqlaftertrigger();
DROP TRIGGER IF EXISTS pkgmetasqlaltertrigger ON xt.pkgmetasql;
CREATE TRIGGER pkgmetasqlaltertrigger BEFORE INSERT OR DELETE OR UPDATE ON xt.pkgmetasql FOR EACH ROW EXECUTE PROCEDURE _pkgmetasqlaltertrigger();
DROP TRIGGER IF EXISTS pkgmetasqlbeforetrigger ON xt.pkgmetasql;
CREATE TRIGGER pkgmetasqlbeforetrigger BEFORE INSERT OR DELETE OR UPDATE ON xt.pkgmetasql FOR EACH ROW EXECUTE PROCEDURE _pkgmetasqlbeforetrigger();
ALTER TABLE xt.pkgmetasql DROP CONSTRAINT IF EXISTS pkgmetasql_pkey CASCADE;
ALTER TABLE xt.pkgmetasql ADD CONSTRAINT pkgmetasql_pkey PRIMARY KEY(metasql_id);
