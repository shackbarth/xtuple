CREATE OR REPLACE FUNCTION copyContract(pContrctid INTEGER,
                                        pNumber TEXT,
                                        pEffective DATE,
                                        pExpires DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _contrctid INTEGER;
  _itemsrcid INTEGER;
  _r RECORD;

BEGIN

  INSERT INTO contrct
  ( contrct_number,
    contrct_vend_id,
    contrct_descrip,
    contrct_effective,
    contrct_expires,
    contrct_note )
  SELECT
    pNumber,
    contrct_vend_id,
    contrct_descrip,
    pEffective,
    pExpires,
    contrct_note
  FROM contrct
  WHERE (contrct_id=pContrctid)
  RETURNING contrct_id INTO _contrctid;

  FOR _r IN
  SELECT * FROM itemsrc WHERE (itemsrc_contrct_id=pContrctid)
  LOOP
  INSERT INTO itemsrc
    ( itemsrc_item_id,
      itemsrc_vend_id,
      itemsrc_vend_item_number,
      itemsrc_vend_item_descrip,
      itemsrc_comments,
      itemsrc_vend_uom,
      itemsrc_invvendoruomratio,
      itemsrc_minordqty,
      itemsrc_multordqty,
      itemsrc_leadtime,
      itemsrc_ranking,
      itemsrc_active,
      itemsrc_manuf_name,
      itemsrc_manuf_item_number,
      itemsrc_manuf_item_descrip,
      itemsrc_default,
      itemsrc_upccode,
      itemsrc_effective,
      itemsrc_expires,
      itemsrc_contrct_id )
    VALUES
    ( _r.itemsrc_item_id,
      _r.itemsrc_vend_id,
      _r.itemsrc_vend_item_number,
      _r.itemsrc_vend_item_descrip,
      _r.itemsrc_comments,
      _r.itemsrc_vend_uom,
      _r.itemsrc_invvendoruomratio,
      _r.itemsrc_minordqty,
      _r.itemsrc_multordqty,
      _r.itemsrc_leadtime,
      _r.itemsrc_ranking,
      _r.itemsrc_active,
      _r.itemsrc_manuf_name,
      _r.itemsrc_manuf_item_number,
      _r.itemsrc_manuf_item_descrip,
      _r.itemsrc_default,
      _r.itemsrc_upccode,
      pEffective,
      pExpires,
      _contrctid )
    RETURNING itemsrc_id INTO _itemsrcid;

  INSERT INTO itemsrcp
    ( itemsrcp_itemsrc_id,
      itemsrcp_qtybreak,
      itemsrcp_price,
      itemsrcp_updated,
      itemsrcp_curr_id,
      itemsrcp_dropship,
      itemsrcp_warehous_id,
      itemsrcp_type,
      itemsrcp_discntprcnt,
      itemsrcp_fixedamtdiscount )
    SELECT
      _itemsrcid,
      itemsrcp_qtybreak,
      itemsrcp_price,
      CURRENT_DATE,
      itemsrcp_curr_id,
      itemsrcp_dropship,
      itemsrcp_warehous_id,
      itemsrcp_type,
      itemsrcp_discntprcnt,
      itemsrcp_fixedamtdiscount
    FROM itemsrcp
    WHERE (itemsrcp_itemsrc_id=_r.itemsrc_id);

  END LOOP;

  RETURN _contrctid;

END;
$$ LANGUAGE plpgsql;
