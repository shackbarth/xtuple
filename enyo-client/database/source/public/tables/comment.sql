-- table definition

-- remove old trigger if any

select dropIfExists('TRIGGER', 'comment_did_change');

-- add uuid column here because there are views that need this
select xt.add_column('docass','obj_uuid', 'uuid', 'default xt.generateUUID()::uuid', 'public');

-- create trigger

create trigger comment_did_change before update on comment for each row execute procedure xt.comment_did_change();
