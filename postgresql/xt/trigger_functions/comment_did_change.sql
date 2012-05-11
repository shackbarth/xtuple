create or replace function xt.comment_did_change() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

 if(NEW.comment_cmnttype_id != OLD.comment_cmnttype_id) throw new Error('Comment type can not be changed');

 var sql = 'select cmnttype_editable as "isEditable" from cmnttype where cmnttype_id=$1';

 if(!plv8.execute(sql, [NEW.comment_cmnttype_id])[0].isEditable) throw new Error('Comment is not editble and can not be changed');
  
 return NEW;

$$ language plv8;
