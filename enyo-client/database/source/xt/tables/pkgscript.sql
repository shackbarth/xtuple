-- table definition

select xt.create_table('pkgscript', 'xt', false, 'script');

ALTER TABLE xt.pkgscript DISABLE TRIGGER ALL;
DROP TRIGGER IF EXISTS pkgscriptaftertrigger ON xt.pkgscript;
CREATE TRIGGER pkgscriptaftertrigger AFTER INSERT OR DELETE OR UPDATE ON xt.pkgscript FOR EACH ROW EXECUTE PROCEDURE _pkgscriptaftertrigger();
DROP TRIGGER IF EXISTS pkgscriptaltertrigger ON xt.pkgscript;
CREATE TRIGGER pkgscriptaltertrigger BEFORE INSERT OR DELETE OR UPDATE ON xt.pkgscript FOR EACH ROW EXECUTE PROCEDURE _pkgscriptaltertrigger();
DROP TRIGGER IF EXISTS pkgscriptbeforetrigger ON xt.pkgscript;
CREATE TRIGGER pkgscriptbeforetrigger BEFORE INSERT OR DELETE OR UPDATE ON xt.pkgscript FOR EACH ROW EXECUTE PROCEDURE _pkgscriptbeforetrigger();
ALTER TABLE xt.pkgscript DROP CONSTRAINT IF EXISTS pkgscript_pkey CASCADE;
ALTER TABLE xt.pkgscript ADD CONSTRAINT pkgscript_pkey PRIMARY KEY(script_id);
