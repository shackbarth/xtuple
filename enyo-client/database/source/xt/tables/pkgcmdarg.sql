-- table definition

select xt.create_table('pkgcmdarg', 'xt', false, 'cmdarg');

ALTER TABLE xt.pkgcmdarg DISABLE TRIGGER ALL;
DROP TRIGGER IF EXISTS pkgcmdargaftertrigger ON xt.pkgcmdarg;
CREATE TRIGGER pkgcmdargaftertrigger AFTER INSERT OR DELETE OR UPDATE ON xt.pkgcmdarg FOR EACH ROW EXECUTE PROCEDURE _pkgcmdargaftertrigger();
DROP TRIGGER IF EXISTS pkgcmdargaltertrigger ON xt.pkgcmdarg;
CREATE TRIGGER pkgcmdargaltertrigger BEFORE INSERT OR DELETE OR UPDATE ON xt.pkgcmdarg FOR EACH ROW EXECUTE PROCEDURE _pkgcmdargaltertrigger();
DROP TRIGGER IF EXISTS pkgcmdargbeforetrigger ON xt.pkgcmdarg;
CREATE TRIGGER pkgcmdargbeforetrigger BEFORE INSERT OR DELETE OR UPDATE ON xt.pkgcmdarg FOR EACH ROW EXECUTE PROCEDURE _pkgcmdargbeforetrigger();
ALTER TABLE xt.pkgcmdarg DROP CONSTRAINT IF EXISTS pkgcmdarg_pkey CASCADE;
ALTER TABLE xt.pkgcmdarg ADD CONSTRAINT pkgcmdarg_pkey PRIMARY KEY(cmdarg_id);
ALTER TABLE xt.pkgcmdarg DROP CONSTRAINT IF EXISTS cmdarg_cmd_id_fkey CASCADE;
ALTER TABLE xt.pkgcmdarg
  ADD CONSTRAINT pkgcmdarg_cmdarg_cmd_id_fkey FOREIGN KEY (cmdarg_cmd_id)
      REFERENCES xt.pkgcmd (cmd_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION;

