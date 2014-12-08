
CREATE OR REPLACE FUNCTION indentedwo(integer, boolean, boolean, boolean) RETURNS SETOF wodata AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
   pwoid ALIAS FOR $1;
   pshowops ALIAS FOR $2;
   pshowmatl ALIAS FOR $3; 
   pshowindent ALIAS FOR $4;   
  _row wodata%ROWTYPE;
  _subrow wodata%ROWTYPE;  
  _opx wodata%ROWTYPE;
  _x RECORD;
  _level INTEGER;
   
BEGIN 
    --The wodata_id_type column is used to indicate the source of the wodata_id
    --there are three different tables used wo, womatl and womatlvar
    --wodata_id_type = 1 = wo_id
    --wodata_id_type = 2 = womatl_id
    --wodata_id_type = 3 = wooper_id
    --initialise values
    _level := 0;   
    --get top level works orders
    FOR _x IN
       SELECT wo_id,wo_number,wo_subnumber,wo_status,wo_startdate,
         wo_duedate,wo_adhoc,wo_itemsite_id,qtyAvailable(itemsite_id) AS availableqoh,
         wo_qtyord,wo_qtyrcv,wo_prodnotes, item_number,
         item_descrip1, item_descrip2, item_listprice, uom_name
       FROM wo, itemsite, item, uom     
       WHERE ((wo_id = pwoid)
         AND (itemsite_id = wo_itemsite_id)
         AND (itemsite_item_id=item_id)
         AND (item_inv_uom_id=uom_id))      
       ORDER BY wo_number, wo_subnumber
    LOOP
        _row.wodata_id := _x.wo_id;
        _row.wodata_id_type := 1;            
        _row.wodata_number := _x.wo_number;
        _row.wodata_subnumber := _x.wo_subnumber;
        _row.wodata_itemnumber := _x.item_number;
        _row.wodata_descrip := _x.item_descrip1 || '-' || _x.item_descrip2;
        _row.wodata_status := _x.wo_status;
        _row.wodata_startdate := _x.wo_startdate;
        _row.wodata_duedate := _x.wo_duedate;
        _row.wodata_adhoc := _x.wo_adhoc;     
        _row.wodata_itemsite_id := _x.wo_itemsite_id;
        _row.wodata_custprice := _x.item_listprice;
        _row.wodata_listprice := _x.item_listprice;
        _row.wodata_qoh := _x.availableqoh;
        _row.wodata_short := noneg(_x.wo_qtyord - _x.wo_qtyrcv);
        _row.wodata_qtyrcv := _x.wo_qtyrcv;   
        _row.wodata_qtyordreq := _x.wo_qtyord;   
        _row.wodata_qtyuom := _x.uom_name;    
        _row.wodata_scrap := 0;        
        _row.wodata_notes := _x.wo_prodnotes;     
        _row.wodata_level := _level;                
        RETURN NEXT _row;
        IF (pshowmatl AND NOT pshowops) THEN
          --expand materials      
          FOR _subrow IN
             SELECT * FROM indentedwomatl(pwoid, _level)
          LOOP                                                  
            RETURN NEXT _subrow;
          END LOOP;
        END IF;
        
        IF ((pshowmatl OR pshowindent) AND NOT pshowops) THEN
          --expand next level down               
          FOR _subrow IN
           SELECT * FROM indentedwo(_x.wo_id, NULL, _level + 1, pshowmatl, pshowindent) 
          LOOP                                           
            RETURN NEXT _subrow; 
          END LOOP;
        END IF;
          
        IF (pshowops) THEN
         --expand materials not on operations   
         IF (pshowmatl) THEN   
           FOR _subrow IN
             SELECT * FROM indentedwomatl(pwoid, -1, _level)
           LOOP                                                  
             RETURN NEXT _subrow;
           END LOOP;
         END IF;

         IF (pshowmatl OR pshowindent) THEN
           --expand next level down             
           FOR _subrow IN
             SELECT * FROM indentedwo(_x.wo_id, -1, _level + 1,  pshowmatl, pshowindent) 
           LOOP                                           
             RETURN NEXT _subrow; 
           END LOOP;
         END IF;

         --expand opeartions
         FOR _opx IN
           SELECT * FROM xtmfg.indentedwoops(pwoid,_level)
         LOOP
           RETURN NEXT _opx;

           IF (pshowmatl) THEN  
              --expand materials on operations      
              FOR _subrow IN
                 SELECT * FROM indentedwomatl(pwoid, _opx.wodata_id, _level + 1)
              LOOP                                                  
                RETURN NEXT _subrow;
              END LOOP;
           END IF;

           IF (pshowmatl OR pshowindent) THEN
              --expand next level down             
              FOR _subrow IN
                SELECT * FROM indentedwo(_x.wo_id, _opx.wodata_id, _level + 2,  pshowmatl, pshowindent) 
              LOOP                                           
                RETURN NEXT _subrow; 
              END LOOP;
           END IF; 
         END LOOP; 
       END IF;                           
  END LOOP;                     
  RETURN;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION indentedwo(integer, integer, integer, boolean, boolean) RETURNS SETOF wodata AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
   pwoid ALIAS FOR $1;   
   pwooperid ALIAS FOR $2;
   plevel ALIAS FOR $3;
   pshowmatl ALIAS FOR $4; 
   pshowindent ALIAS FOR $5;  
  _row wodata%ROWTYPE;   
  _opx wodata%ROWTYPE; 
  _x RECORD;
  _subx RECORD;
  _index INTEGER;
  _level INTEGER;
  _qry TEXT;
   
BEGIN 
    --The wodata id column is used to indicate the source of the id
    --there are three different tables used wo, womatl and womatlvar
    --wodata_id_type = 1 = wo_id
    --wodata_id_type = 2 = womatl_id
    --wodata_id_type = 3 = wooper_id
    _level := (plevel + 1);    
    --find all WO with the ordid of the next level up
    _qry := 'SELECT wo_id,wo_number,wo_subnumber,wo_status,wo_startdate,wo_duedate,
         wo_adhoc,wo_itemsite_id,qtyAvailable(itemsite_id) AS availableqoh,wo_qtyord,wo_qtyrcv, wo_prodnotes,
         item_number,item_descrip1, item_descrip2, item_listprice, uom_name,
         womatl_qtyiss, womatl_scrap, womatl_wooper_id
       FROM itemsite,  wo, item, uom, womatl 
       WHERE ((wo_ordid = ' || pwoid || ')
         AND (wo_ordtype = ''W'')
         AND (itemsite_item_id=item_id)
         AND (item_inv_uom_id=uom_id)   
         AND (wo_womatl_id=womatl_id)   
         AND (wo_itemsite_id = itemsite_id) ';

    IF (pwooperid IS NOT NULL) THEN
      _qry := _qry || ' AND (womatl_wooper_id=' || pwooperid || ') ';
    END IF;               

    _qry := _qry || ') ORDER BY wo_number, wo_subnumber';
 /* if (pwooperid IS NOT NULL) THEN
    raise exception 'stop %',_qry;
  END IF;*/
    FOR _x IN
      EXECUTE _qry
    LOOP 
        _row.wodata_id := _x.wo_id;
        _row.wodata_id_type := 1;                     
        _row.wodata_number := _x.wo_number;
        _row.wodata_subnumber := _x.wo_subnumber;
        _row.wodata_itemnumber := _x.item_number;
        _row.wodata_descrip := _x.item_descrip1 || '-' || _x.item_descrip2;
        _row.wodata_status := _x.wo_status;
        _row.wodata_startdate := _x.wo_startdate;
        _row.wodata_duedate := _x.wo_duedate;
        _row.wodata_adhoc := _x.wo_adhoc;      
        _row.wodata_itemsite_id := _x.wo_itemsite_id;        
        _row.wodata_custprice := _x.item_listprice;
        _row.wodata_listprice := _x.item_listprice;
        _row.wodata_qoh := _x.availableqoh;
        _row.wodata_short := noneg(_x.wo_qtyord - _x.wo_qtyrcv);
        _row.wodata_qtyiss := _x.womatl_qtyiss;  
        _row.wodata_qtyrcv := _x.wo_qtyrcv;   
        _row.wodata_qtyordreq := _x.wo_qtyord; 
	_row.wodata_scrap := _x.womatl_scrap;  
        _row.wodata_notes := _x.wo_prodnotes;       
        _row.wodata_level := plevel;                
        RETURN NEXT _row;  
        --if indentation require expand next level
        IF (pshowindent AND pwooperid IS NULL) THEN
          IF (pshowmatl AND pshowindent) THEN    
      	    --get materials for this level
            FOR _subx IN
              SELECT * FROM indentedwomatl(_x.wo_id, plevel) 
	    LOOP                                            
	      RETURN NEXT _subx;
  	    END LOOP;
          END IF;

          IF (pshowindent) THEN  
            --expand lower levels 
            FOR _subx IN
              SELECT * FROM indentedwo(_x.wo_id, NULL, _level, pshowmatl, pshowindent )
            LOOP                                           
	      RETURN NEXT _subx; 
            END LOOP; 
          END IF;    
            
        ELSIF (pshowindent) THEN --Handle operations
          --expand materials not on operations   
          IF (pshowmatl) THEN   
            FOR _subx IN
              SELECT * FROM indentedwomatl(_x.wo_id, -1, plevel)
            LOOP                                                  
              RETURN NEXT _subx;
            END LOOP;
          END IF;

          --expand next level down not on operations
          FOR _subx IN
            SELECT * FROM indentedwo(_x.wo_id, -1, _level,  pshowmatl, pshowindent) 
          LOOP                                           
            RETURN NEXT _subx; 
          END LOOP;
          
          --expand operations
          FOR _opx IN
            SELECT * FROM xtmfg.indentedwoops(_x.wo_id,plevel)
          LOOP
            RETURN NEXT _opx;

            IF (pshowmatl) THEN  
              --expand materials on operations      
              FOR _subx IN
                 SELECT * FROM indentedwomatl(_x.wo_id, _opx.wodata_id, _level)
              LOOP                                                  
                RETURN NEXT _subx;
                --	raise exception 'stop %',_opx.wodata_id;
              END LOOP;
            END IF;
              
            --expand next level down   
            FOR _subx IN
              SELECT * FROM indentedwo(_x.wo_id, _opx.wodata_id, _level + 2,  pshowmatl, pshowindent) 
            LOOP                                        
              RETURN NEXT _subx; 
            END LOOP;
              
          END LOOP;
        END IF;      	              
      END LOOP;                         
  RETURN;
END;
$$ LANGUAGE 'plpgsql';

