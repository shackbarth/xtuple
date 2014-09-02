
CREATE OR REPLACE FUNCTION woinvavail(integer, boolean, boolean, boolean, boolean)
  RETURNS SETOF woinvav AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
   pwoid ALIAS FOR $1;   
   pshowchildindent ALIAS FOR $2;    
   pshowchildsum ALIAS FOR $3;
   pshowshortage ALIAS FOR $4;
   pshowlowinventory ALIAS FOR $5;
  _row woinvav%ROWTYPE;
  _subrow woinvav%ROWTYPE;
  _wonumber TEXT;
  _x RECORD;
  _subx RECORD;  
  _qry TEXT;
   
BEGIN   
    
    IF(pshowchildindent) THEN 
      --get top level order   
      FOR _x IN
          SELECT wo_id,
                itemsite_id,
                item_type,
                wo_number,
                wo_subnumber,                             
                item_number,
                item_descrip1, 
                item_descrip2, 
                uom_name,
                qoh, 
                wobalance, 
                allocated, 
                ordered,                        
                reorderlevel,
                (qoh + ordered - wobalance) AS woavail,
                (qoh + ordered - allocated) AS totalavail 
         FROM(SELECT wo_id,
                itemsite_id,
                item_type,
                wo_number,
                wo_subnumber,                             
                item_number,
                item_descrip1, 
                item_descrip2, 
                uom_name,
                noNeg(qtyAvailable(itemsite_id)) AS qoh, 
                noNeg(wo_qtyord - wo_qtyrcv) AS wobalance, 
                qtyAllocated(itemsite_id, wo_duedate) AS allocated, 
                qtyOrdered(itemsite_id, wo_duedate) AS ordered,                        
                CASE WHEN(itemsite_useparams) THEN itemsite_reorderlevel ELSE 0.0 END AS reorderlevel 
          FROM wo, itemsite, item, uom     
         WHERE ((wo_id = pwoid)          
           AND (itemsite_id = wo_itemsite_id)
           AND (itemsite_item_id=item_id)
           AND (item_inv_uom_id=uom_id))               
         ORDER BY wo_number, wo_subnumber) AS data
       LOOP       
         _row.woinvav_itemsite_id := _x.itemsite_id;            
         _row.woinvav_womatl_id := -1;
         _row.woinvav_type := _x.item_type;          
         _row.woinvav_item_wo_number := _x.wo_number || '-' || _x.wo_subnumber;
         _row.woinvav_descrip := _x.item_descrip1 || ' ' || _x.item_descrip2;
         _row.woinvav_uomname := _x.uom_name;
         _row.woinvav_qoh := _x.qoh;
         _row.woinvav_balance := _x.wobalance;
         _row.woinvav_allocated := _x.allocated;     
         _row.woinvav_ordered := _x.ordered;         
         _row.woinvav_woavail := _x.woavail;
         _row.woinvav_totalavail := _x.totalavail;
         _row.woinvav_reorderlevel := _x.reorderlevel;
         _row.woinvav_level := 0;                       
         RETURN NEXT _row;                
        --get materials for this level        
        FOR _subx IN
          SELECT * FROM woinvavailmatl(_x.wo_id, 1, pshowshortage, pshowlowinventory) 
        LOOP                                            
	  RETURN NEXT _subx;
	END LOOP;  
	FOR _subx IN
          SELECT * FROM woinvavail(_x.wo_id, 1, pshowshortage, pshowlowinventory)
        LOOP                                            
	  RETURN NEXT _subx;
	END LOOP;  
     END LOOP;             
    ELSE
       SELECT wo_number FROM wo WHERE wo_id=pwoid LIMIT 1 INTO _wonumber;   
       --display a single level sum of work order requirements
       _qry := 'SELECT  wo_id,
                        itemsite_id, 
		        womatl_id,
			item_type,
			wo_number,                         
                        item_number, 
                        item_descrip1, 
                        item_descrip2, 
                        uom_name,                         
                        qoh, 
                        wobalance, 
                        allocated, 
                        ordered,                        
                        reorderlevel,
                        (qoh + ordered - wobalance) AS woavail,
                        (qoh + ordered - allocated) AS totalavail
	          FROM (SELECT wo_id,
	                itemsite_id, 
			womatl_id,
			item_type,			
			wo_number,                         
                        item_number, 
                        item_descrip1, 
                        item_descrip2, 
                        uom_name,                         
                        noNeg(qtyAvailable(itemsite_id)) AS qoh, 
                        noNeg(itemuomtouom(itemsite_item_id, womatl_uom_id, NULL, womatl_qtyreq - womatl_qtyiss)) AS wobalance, 
                        qtyAllocated(itemsite_id, womatl_duedate) AS allocated, 
                        qtyOrdered(itemsite_id, womatl_duedate) AS ordered,                        
                        CASE WHEN(itemsite_useparams) THEN itemsite_reorderlevel ELSE 0.0 END AS reorderlevel 
                   FROM wo, womatl, itemsite, item, uom  
                 WHERE (womatl_wo_id=wo_id) 
                   AND (womatl_itemsite_id=itemsite_id) 
                   AND (itemsite_item_id=item_id) 
                   AND (item_inv_uom_id=uom_id) ';
                IF(pshowchildsum) THEN
                  _qry := _qry || ' AND (wo_number=' || _wonumber || ')';
                ELSE  
                  _qry := _qry || ' AND (womatl_wo_id=' || pwoid || ')';                  
                END IF; 
                 _qry := _qry || ' ORDER BY item_number) AS data ';  
                IF(pshowshortage) THEN
                  _qry := _qry || ' WHERE (((qoh + ordered - allocated) < 0) OR ((qoh + ordered - wobalance) < 0)) '; 
                END IF;
                IF(pshowlowinventory AND NOT pshowshortage) THEN                 
                  _qry := _qry || ' WHERE (((qoh - allocated) < 0) OR ((qoh - wobalance) < 0)) '; 
                END IF;                 
                
      FOR _x IN   
         EXECUTE _qry
      LOOP        
        _row.woinvav_itemsite_id := _x.itemsite_id;            
        _row.woinvav_womatl_id := _x.womatl_id;  
        _row.woinvav_type := _x.item_type;      
        _row.woinvav_item_wo_number := _x.item_number;
        _row.woinvav_descrip := _x.item_descrip1 || ' ' || _x.item_descrip2;
        _row.woinvav_uomname := _x.uom_name;
        _row.woinvav_qoh := _x.qoh;
        _row.woinvav_balance := _x.wobalance;
        _row.woinvav_allocated := _x.allocated;     
        _row.woinvav_ordered := _x.ordered;         
        _row.woinvav_woavail := _x.woavail;
        _row.woinvav_totalavail := _x.totalavail;
        _row.woinvav_reorderlevel := _x.reorderlevel;
        _row.woinvav_level := 0;                
        RETURN NEXT _row;  
  END LOOP;
  END IF;                     
  RETURN;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION woinvavail(integer, integer, boolean, boolean)
  RETURNS SETOF woinvav AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
   pwoid ALIAS FOR $1; 
   plevel ALIAS FOR $2;
   pshowshortage ALIAS FOR $3;
   pshowlowinventory ALIAS FOR $4;
  _row woinvav%ROWTYPE;
  _x RECORD;
  _subx RECORD;
  _index INTEGER;
  _level INTEGER;
  _qry TEXT;   
BEGIN   
    FOR _x IN
          SELECT wo_id,
                itemsite_id,
                item_type,
                wo_number,
                wo_subnumber,                             
                item_number,
                item_descrip1, 
                item_descrip2, 
                uom_name,
                qoh, 
                wobalance, 
                allocated, 
                ordered,                        
                reorderlevel,
                (qoh + ordered - wobalance) AS woavail,
                (qoh + ordered - allocated) AS totalavail 
         FROM(SELECT wo_id,
                itemsite_id,
                item_type,
                wo_number,
                wo_subnumber,                             
                item_number,
                item_descrip1, 
                item_descrip2, 
                uom_name,
                noNeg(qtyAvailable(itemsite_id)) AS qoh, 
                noNeg(wo_qtyord - wo_qtyrcv) AS wobalance, 
                qtyAllocated(itemsite_id, wo_duedate) AS allocated, 
                qtyOrdered(itemsite_id, wo_duedate) AS ordered,                        
                CASE WHEN(itemsite_useparams) THEN itemsite_reorderlevel ELSE 0.0 END AS reorderlevel 
          FROM wo, itemsite, item, uom     
         WHERE ((wo_ordid = pwoid AND wo_ordtype = 'W')
           AND NOT (wo_status = 'C')          
           AND (itemsite_id = wo_itemsite_id)
           AND (itemsite_item_id=item_id)
           AND (item_inv_uom_id=uom_id))               
         ORDER BY wo_number, wo_subnumber) AS data
       LOOP       
         _row.woinvav_itemsite_id := _x.itemsite_id;            
         _row.woinvav_womatl_id := -1;
         _row.woinvav_type := _x.item_type;          
         _row.woinvav_item_wo_number := _x.wo_number || '-' || _x.wo_subnumber;
         _row.woinvav_descrip := _x.item_descrip1 || ' ' || _x.item_descrip2;
         _row.woinvav_uomname := _x.uom_name;
         _row.woinvav_qoh := _x.qoh;
         _row.woinvav_balance := _x.wobalance;
         _row.woinvav_allocated := _x.allocated;     
         _row.woinvav_ordered := _x.ordered;         
         _row.woinvav_woavail := _x.woavail;
         _row.woinvav_totalavail := _x.totalavail;
         _row.woinvav_reorderlevel := _x.reorderlevel;               
         _row.woinvav_level := plevel;                       
         RETURN NEXT _row;         
        --get materials for this level
        FOR _subx IN
          SELECT * FROM woinvavailmatl(_x.wo_id, plevel + 1, pshowshortage, pshowlowinventory) 
        LOOP                                            
	  RETURN NEXT _subx;
	END LOOP;
        --get next level wo
        FOR _subx IN
          SELECT * FROM woinvavail(_x.wo_id, plevel + 1, pshowshortage, pshowlowinventory) 
        LOOP                                            
	  RETURN NEXT _subx;
	END LOOP;
      END LOOP;   
  RETURN;
END;
$$ LANGUAGE 'plpgsql';


