-- add uuid column here because there are views that need this
select xt.add_column('comment','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('comment', 'xt.obj');
select xt.add_constraint('comment', 'comment_obj_uuid','unique(obj_uuid)', 'public');


-- force isPublic from null to true, but do it while triggers are disabled
-- the ORMs now rely on this field being either true or false

DROP TRIGGER IF EXISTS comment_did_change ON comment;
DROP TRIGGER IF EXISTS commenttrigger ON comment;

UPDATE comment SET comment_public = true WHERE comment_public IS NULL;

CREATE TRIGGER comment_did_change
  BEFORE UPDATE
  ON comment
  FOR EACH ROW
  EXECUTE PROCEDURE xt.comment_did_change();

CREATE TRIGGER commenttrigger
  AFTER INSERT OR UPDATE
  ON comment
  FOR EACH ROW
  EXECUTE PROCEDURE _commenttrigger();

alter table public.comment alter column comment_public set default true;

