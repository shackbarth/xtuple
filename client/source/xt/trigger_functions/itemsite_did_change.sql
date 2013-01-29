create or replace function xt.itemsite_did_change() returns trigger as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */


  if (TG_OP === 'INSERT') {
    NEW.itemsite_qtyonhand = NEW.itemsite_qtyonhand || 0;
    NEW.itemsite_reorderlevel = NEW.itemsite_reorderlevel || 0;
    NEW.itemsite_ordertoqty = NEW.itemsite_ordertoqty || 0;
    NEW.itemsite_cyclecountfreq = NEW.itemsite_cyclecountfreq || 0;
    NEW.itemsite_datelastused = plv8.execute("select startoftime() as startDate")[0].startDate;
    NEW.itemsite_loccntrl = NEW.itemsite_loccntrl || false;
    NEW.itemsite_safetystock = NEW.itemsite_safetystock || 0;
    NEW.itemsite_minordqty = NEW.itemsite_qtyonhand || 0;
    NEW.itemsite_minordqty = NEW.itemsite_minordqty || 0;
    NEW.itemsite_multordqty = NEW.itemsite_multordqty || 0;
    NEW.itemsite_leadtime = NEW.itemsite_leadtime || 0;
    NEW.itemsite_abcclass = NEW.itemsite_abcclass || 'A';
    NEW.itemsite_controlmethod = NEW.itemsite_controlmethod || 'N';
    NEW.itemsite_eventfence = NEW.itemsite_eventfence || 0;
    NEW.itemsite_sold = NEW.itemsite_sold || true;
    NEW.itemsite_stocked = NEW.itemsite_stocked || true;
    NEW.itemsite_useparams = NEW.itemsite_useparams || false;
    NEW.itemsite_useparamsmanual = NEW.itemsite_useparamsmanual || false;
    NEW.itemsite_createpr = NEW.itemsite_createpr || false;
    NEW.itemsite_value = NEW.itemsite_value || 0;
    NEW.itemsite_location_id = NEW.itemsite_location_id || -1;
    NEW.itemsite_perishable = NEW.itemsite_perishable || false;
    NEW.itemsite_autoabcclass = NEW.itemsite_autoabcclass || false;
    NEW.itemsite_costmethod = NEW.itemsite_costmethod || 'N';
    NEW.itemsite_value = NEW.itemsite_value || 0;
  }
  
  return NEW;

$$ language plv8;
