CREATE OR REPLACE FUNCTION site() RETURNS SETOF whsinfo AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _row whsinfo%ROWTYPE;
  _r RECORD;

BEGIN

  IF ( (fetchMetricBool(''MultiWhs'')) AND
       (SELECT (COUNT(usrpref_id)=1)
        FROM usrpref
        WHERE ((usrpref_name=''selectedSites'')
        AND (usrpref_value=''t'')
        AND (usrpref_username=getEffectiveXtUser()))) ) THEN

    FOR _r IN SELECT *
            FROM whsinfo,usrsite
            WHERE ((warehous_id=usrsite_warehous_id)
            AND (usrsite_username=getEffectiveXtUser()))
    LOOP
      _row.warehous_id:=_r.warehous_id;
      _row.warehous_code:=_r.warehous_code;
      _row.warehous_descrip:=_r.warehous_descrip;
      _row.warehous_fob:=_r.warehous_fob;
      _row.warehous_active:=_r.warehous_active;
      _row.warehous_counttag_prefix:=_r.warehous_counttag_prefix;
      _row.warehous_counttag_number:=_r.warehous_counttag_number;
      _row.warehous_bol_prefix:=_r.warehous_bol_prefix;
      _row.warehous_bol_number:=_r.warehous_bol_number;
      _row.warehous_shipping:=_r.warehous_shipping;
      _row.warehous_useslips:=_r.warehous_useslips;
      _row.warehous_usezones:=_r.warehous_usezones;
      _row.warehous_aislesize:=_r.warehous_aislesize;
      _row.warehous_racksize:=_r.warehous_racksize;
      _row.warehous_binsize:=_r.warehous_binsize;
      _row.warehous_binalpha:=_r.warehous_binalpha;
      _row.warehous_locationsize:=_r.warehous_locationsize;
      _row.warehous_locationalpha:=_r.warehous_locationalpha;
      _row.warehous_enforcearbl:=_r.warehous_enforcearbl;
      _row.warehous_default_accnt_id:=_r.warehous_default_accnt_id;
      _row.warehous_shipping_commission:=_r.warehous_shipping_commission;
      _row.warehous_cntct_id:=_r.warehous_cntct_id;
      _row.warehous_addr_id:=_r.warehous_addr_id;
      _row.warehous_taxzone_id:=_r.warehous_taxzone_id;
      _row.warehous_transit:=_r.warehous_transit;
      _row.warehous_shipform_id:=_r.warehous_shipform_id;
      _row.warehous_shipvia_id:=_r.warehous_shipvia_id;
      _row.warehous_shipcomments:=_r.warehous_shipcomments;
      _row.warehous_costcat_id:=_r.warehous_costcat_id;
      _row.warehous_sitetype_id:=_r.warehous_sitetype_id;
             
      RETURN NEXT _row;
    END LOOP;
  ELSE
    FOR _r IN SELECT *
            FROM whsinfo
    LOOP
      _row.warehous_id:=_r.warehous_id;
      _row.warehous_code:=_r.warehous_code;
      _row.warehous_descrip:=_r.warehous_descrip;
      _row.warehous_fob:=_r.warehous_fob;
      _row.warehous_active:=_r.warehous_active;
      _row.warehous_counttag_prefix:=_r.warehous_counttag_prefix;
      _row.warehous_counttag_number:=_r.warehous_counttag_number;
      _row.warehous_bol_prefix:=_r.warehous_bol_prefix;
      _row.warehous_bol_number:=_r.warehous_bol_number;
      _row.warehous_shipping:=_r.warehous_shipping;
      _row.warehous_useslips:=_r.warehous_useslips;
      _row.warehous_usezones:=_r.warehous_usezones;
      _row.warehous_aislesize:=_r.warehous_aislesize;
      _row.warehous_racksize:=_r.warehous_racksize;
      _row.warehous_binsize:=_r.warehous_binsize;
      _row.warehous_binalpha:=_r.warehous_binalpha;
      _row.warehous_locationsize:=_r.warehous_locationsize;
      _row.warehous_locationalpha:=_r.warehous_locationalpha;
      _row.warehous_enforcearbl:=_r.warehous_enforcearbl;
      _row.warehous_default_accnt_id:=_r.warehous_default_accnt_id;
      _row.warehous_shipping_commission:=_r.warehous_shipping_commission;
      _row.warehous_cntct_id:=_r.warehous_cntct_id;
      _row.warehous_addr_id:=_r.warehous_addr_id;
      _row.warehous_taxzone_id:=_r.warehous_taxzone_id;
      _row.warehous_transit:=_r.warehous_transit;
      _row.warehous_shipform_id:=_r.warehous_shipform_id;
      _row.warehous_shipvia_id:=_r.warehous_shipvia_id;
      _row.warehous_shipcomments:=_r.warehous_shipcomments;
      _row.warehous_costcat_id:=_r.warehous_costcat_id;
      _row.warehous_sitetype_id:=_r.warehous_sitetype_id;
             
      RETURN NEXT _row;
    END LOOP;
  END IF;
  
  RETURN;
END;
' LANGUAGE 'plpgsql';
