CREATE OR REPLACE FUNCTION woinvavailmatl(integer, integer, boolean, boolean)
  RETURNS SETOF woinvav AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
   pwoid ALIAS FOR $1;    
   plevel ALIAS FOR $2;
   pshowshortage ALIAS FOR $3;
   pshowlowinventory ALIAS FOR $4;
  _subrow woinvav%ROWTYPE;  
  _subx RECORD;
  _qry TEXT;
BEGIN
  
   _qry := 'SELECT itemsite_id, 
           womatl_id,
           item_type, 
           wo_number, 
           wo_subnumber, 
           womatl_ref, 
           womatl_notes, 
           item_number,
           item_descrip1, 
           item_descrip2, 
           uom_name,
           qoh, 
           wobalance, 
           allocated, 
           ordered,
           (qoh + ordered - wobalance) AS woavail,
           (qoh + ordered - allocated) AS totalavail,
           reorderlevel 
    FROM(SELECT itemsite_id, 
                womatl_id,
                item_type,                 
                wo_number, 
                wo_subnumber, 
                womatl_ref, 
                womatl_notes, 
                item_number,
                item_descrip1, 
                item_descrip2, 
                uom_name,
                noNeg(qtyAvailable(itemsite_id)) AS qoh, 
                noNeg(itemuomtouom(itemsite_item_id, womatl_uom_id, NULL, womatl_qtyreq - womatl_qtyiss)) AS wobalance, 
                qtyAllocated(itemsite_id, womatl_duedate) AS allocated, 
                qtyOrdered(itemsite_id, womatl_duedate) AS ordered,
                CASE WHEN(itemsite_useparams) THEN itemsite_reorderlevel ELSE 0.0 END AS reorderlevel
    FROM womatl, wo, itemsite, item, uom
    WHERE ((wo_id = womatl_wo_id)     
     AND (womatl_itemsite_id = itemsite_id)
     AND (itemsite_item_id=item_id)
     AND (womatl_uom_id=uom_id)
     AND (NOT womatl_createwo OR womatl_createwo IS NULL))';
     _qry := _qry || ' AND (wo_id=' || pwoid || ') ORDER BY item_number) AS data';
     IF(pshowshortage) THEN
     _qry := _qry || ' WHERE (((qoh + ordered - allocated) < 0) OR ((qoh + ordered - wobalance) < 0)) '; 
     END IF;
     IF(pshowlowinventory AND NOT pshowshortage) THEN                 
     _qry := _qry || ' WHERE (((qoh - allocated) < 0) OR ((qoh - wobalance) < 0)) '; 
     END IF;
        
     
     
  FOR _subx IN
      EXECUTE _qry
  LOOP
     _subrow.woinvav_itemsite_id := _subx.itemsite_id;            
     _subrow.woinvav_womatl_id := _subx.womatl_id;
     _subrow.woinvav_type := _subx.item_type;            
     _subrow.woinvav_item_wo_number := _subx.item_number;
     _subrow.woinvav_descrip := _subx.item_descrip1 || ' ' || _subx.item_descrip2;
     _subrow.woinvav_uomname := _subx.uom_name;
     _subrow.woinvav_qoh := _subx.qoh;
     _subrow.woinvav_balance := _subx.wobalance;
     _subrow.woinvav_allocated := _subx.allocated;     
     _subrow.woinvav_ordered := _subx.ordered;         
     _subrow.woinvav_woavail := _subx.woavail;
     _subrow.woinvav_totalavail := _subx.totalavail;
     _subrow.woinvav_reorderlevel := _subx.reorderlevel;
     _subrow.woinvav_level := plevel;                                     
    RETURN NEXT _subrow; 
  END LOOP;            
  RETURN;
END;
$$ LANGUAGE 'plpgsql';
