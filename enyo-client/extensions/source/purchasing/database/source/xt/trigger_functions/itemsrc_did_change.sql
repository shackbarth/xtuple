create or replace function xt.itemsrc_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

 if (!NEW.itemsrc_vend_item_number || NEW.itemsrc_vend_item_number.length === 0) {
   throw "Vendor Item Number is required."
 }
 
 return NEW;

$$ language plv8;
