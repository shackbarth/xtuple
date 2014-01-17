create or replace function xt.comment_did_change() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

  if (typeof XT === 'undefined') { 
    plv8.execute("select xt.js_init();"); 
  }

 if (NEW.comment_cmnttype_id != OLD.comment_cmnttype_id) {
   throw new Error('Comment type can not be changed'); 
  }

 /* This exception for 'Notes to Comment' is a hack on a hack. There must be a better way. */
 var sql = "select cmnttype_editable " +
           "from cmnttype  " +
           "where cmnttype_id=$1 " +
           " and cmnttype_name != 'Notes to Comment'",
   isEditable,
   isException,
   res;
 res = plv8.execute(sql, [NEW.comment_cmnttype_id]);
 isEditable = res.length ? res[0].cmnttype_editable : true;

 if (!isEditable && !XT.allowEditComments) {
   throw new Error('Comment is not editble and can not be changed');
 }
  
 return NEW;

}());

$$ language plv8;
