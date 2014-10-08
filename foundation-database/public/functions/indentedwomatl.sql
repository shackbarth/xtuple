
CREATE OR REPLACE FUNCTION indentedwomatl(integer, integer) RETURNS SETOF wodata AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
   pwoid ALIAS FOR $1;   
   plevel ALIAS FOR $2;
  _subx RECORD;
   
BEGIN
  FOR _subx IN
    SELECT * FROM indentedwomatl(pwoid, NULL::integer, plevel)
  LOOP
    RETURN NEXT _subx;
  END LOOP;        
  RETURN;
END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION indentedwomatl(integer, integer, integer) RETURNS SETOF wodata AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
   pwoid ALIAS FOR $1;  
   pwooperid ALIAS FOR $2; 
   plevel ALIAS FOR $3;
  _status TEXT; 
  _subrow wodata%ROWTYPE;  
  _subx RECORD;
  _level INTEGER;
  _qry TEXT;
   
BEGIN
  --The wodata id column is used to indicate the source of the id
  --there are three different tables used wo, womatl and womatlvar
  --wodata_id_type = 1 = wo_id
  --wodata_id_type = 2 = womatl_id
  --wodata_id_type = 3 = wooper_id

  _qry := 'SELECT womatl_id, wo_number, wo_subnumber, 
      wo_startdate, womatl_duedate, womatl_itemsite_id,
      qtyAvailable(itemsite_id) AS availableqoh, womatl_qtyreq, womatl_qtyiss,
      womatl_qtyper, womatl_qtyreq, womatl_scrap,
      womatl_ref, womatl_notes, womatl_price, item_listprice,
      item_number, item_descrip1, item_descrip2,
      uom_name
    FROM womatl, wo, itemsite, item, uom
    WHERE ((wo_id = womatl_wo_id)
     AND (wo_id = ' || pwoid || ')
     AND (womatl_itemsite_id = itemsite_id)
     AND (itemsite_item_id=item_id)
     AND (womatl_uom_id=uom_id) ';
-- Need to display in case child w/o is deleted
--     AND (NOT womatl_createwo OR womatl_createwo IS NULL) ';

  IF (pwooperid IS NOT NULL) THEN
    _qry := _qry || 'AND (womatl_wooper_id=' || pwooperid  || ')';
  END IF;

  _qry := _qry || ') ORDER BY item_number;';
  
  _level := plevel + 1;    
  SELECT wo_status FROM wo WHERE wo_id = pwoid  LIMIT 1 INTO _status;
 
  FOR _subx IN
    EXECUTE _qry
  LOOP
    _subrow.wodata_id := _subx.womatl_id;
    _subrow.wodata_id_type  := 2;       
    _subrow.wodata_number := _subx.wo_number;
    _subrow.wodata_subnumber := _subx.wo_subnumber;
    _subrow.wodata_itemnumber := _subx.item_number;
    _subrow.wodata_descrip := _subx.item_descrip1 || '-' || _subx.item_descrip2;
    _subrow.wodata_status := _status;
    _subrow.wodata_startdate := _subx.wo_startdate;
    _subrow.wodata_duedate := _subx.womatl_duedate;
    _subrow.wodata_itemsite_id := _subx.womatl_itemsite_id;    
    _subrow.wodata_custprice := _subx.womatl_price;
    _subrow.wodata_listprice := _subx.item_listprice;
    _subrow.wodata_qoh := _subx.availableqoh;
    IF((_subx.availableqoh > (_subx.womatl_qtyreq - _subx.womatl_qtyiss))) THEN
      _subrow.wodata_short := 0;
    ELSE
      _subrow.wodata_short := (_subx.womatl_qtyreq - _subx.womatl_qtyiss) -  _subx.availableqoh;
    END IF;
    _subrow.wodata_qtyper := _subx.womatl_qtyper;
    _subrow.wodata_qtyiss := _subx.womatl_qtyiss;         
    _subrow.wodata_qtyordreq := _subx.womatl_qtyreq;     
    _subrow.wodata_qtyuom := _subx.uom_name;   
    _subrow.wodata_scrap := _subx.womatl_scrap;        
    _subrow.wodata_notes := _subx.womatl_notes;
    _subrow.wodata_ref := _subx.womatl_ref;       
    _subrow.wodata_level := _level;                                   
    RETURN NEXT _subrow; 
  END LOOP;     
        
  RETURN;
END;
$$ LANGUAGE 'plpgsql';

