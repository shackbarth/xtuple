-- table definition

-- remove old trigger if any

select dropIfExists('TRIGGER', 'comment_did_change');

-- create trigger

create trigger comment_did_change before update on comment for each row execute procedure xt.comment_did_change();
