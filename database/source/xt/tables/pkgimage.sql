-- table definition

select xt.create_table('pkgimage', 'xt', false, 'image');

ALTER TABLE xt.pkgimage DISABLE TRIGGER ALL;
DROP TRIGGER IF EXISTS pkgimageaftertrigger ON xt.pkgimage;
CREATE TRIGGER pkgimageaftertrigger AFTER INSERT OR DELETE OR UPDATE ON xt.pkgimage FOR EACH ROW EXECUTE PROCEDURE _pkgimageaftertrigger();
DROP TRIGGER IF EXISTS pkgimagealtertrigger ON xt.pkgimage;
CREATE TRIGGER pkgimagealtertrigger BEFORE INSERT OR DELETE OR UPDATE ON xt.pkgimage FOR EACH ROW EXECUTE PROCEDURE _pkgimagealtertrigger();
DROP TRIGGER IF EXISTS pkgimagebeforetrigger ON xt.pkgimage;
CREATE TRIGGER pkgimagebeforetrigger BEFORE INSERT OR DELETE OR UPDATE ON xt.pkgimage FOR EACH ROW EXECUTE PROCEDURE _pkgimagebeforetrigger();
ALTER TABLE xt.pkgimage DROP CONSTRAINT IF EXISTS pkgimage_pkey CASCADE;
ALTER TABLE xt.pkgimage ADD CONSTRAINT pkgimage_pkey PRIMARY KEY(image_id);
