create or replace function xt.taxtype_record_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

  if (typeof XT === 'undefined') { 
    plv8.execute("select xt.js_init();"); 
  }

 /* Prevent recursion */
 if (XT.ignoreTaxTypeRecordDidChange) { return NEW; }
 
 /* Server side tax type setting */
 var data = Object.create(XT.Data),
   overrideTax = data.checkPrivilege("OverrideTax"),
   prefix = TG_TABLE_NAME.slice(0,2),
   id = NEW[prefix + "item_id"],
   sql = 'select getitemtaxtype(item_id, {pre}head_taxzone_id) as "taxType" ' +
         'from item ' +
         ' join itemsite on item_id = itemsite_item_id ' +
         ' join {pre}item on itemsite_id = {pre}item_itemsite_id ' +
         ' join {pre}head on {pre}item_{pre}head_id = {pre}head_id ' +
         'where {pre}item_id = $1',
   query,
   taxType;

 /* If user can edit, bail */
 if (overrideTax) { return NEW; }

 /* Go get the tax type */
 sql = sql.replace(/{pre}/g, prefix);
 query = plv8.execute(sql, [id]);
 taxType = query.length ? query[0].taxType : null;
 
 /* Update the record with the tax type */
 XT.ignoreTaxTypeRecordDidChange = true;
 sql = "update {pre}item set {pre}item_taxtype_id = $1 where {pre}item_id = $2;";
 sql = sql.replace(/{pre}/g, prefix);
 plv8.execute(sql, [taxType, id]);
 delete XT.ignoreTaxTypeRecordDidChange;

 return NEW;

}());

$$ language plv8;
