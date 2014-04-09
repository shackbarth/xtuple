CREATE OR REPLACE FUNCTION transitWhs() RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _id	INTEGER;

BEGIN
  _id = fetchMetricValue(''TransitWarehouse'');

  IF (_id IS NOT NULL
      AND EXISTS(SELECT warehous_id FROM whsinfo WHERE (warehous_id=_id)) ) THEN
    RETURN _id;
  END IF;

  SELECT warehous_id INTO _id FROM whsinfo WHERE warehous_transit;

  IF (NOT FOUND) THEN
    _id := NEXTVAL(''warehous_warehous_id_seq'');

    INSERT INTO whsinfo (
      warehous_id,
      warehous_code,
      warehous_descrip,
      --warehous_fob,
      warehous_active,
      --warehous_counttag_prefix,
      --warehous_counttag_number,
      --warehous_bol_prefix,
      --warehous_bol_number,
      warehous_shipping,
      warehous_useslips,
      warehous_usezones,
      --warehous_aislesize,
      --warehous_aislealpha,
      --warehous_racksize,
      --warehous_rackalpha,
      --warehous_binsize,
      --warehous_binalpha,
      --warehous_locationsize,
      --warehous_locationalpha,
      warehous_enforcearbl,
      warehous_default_accnt_id,
      --warehous_shipping_commission,
      --warehous_cntct_id,
      --warehous_addr_id,
      warehous_taxzone_id
     ) VALUES (
       _id,
      ''TRANSIT'',
      ''Intermediate Warehouse for Inter-Warehouse Transfers'',
      --text,
      TRUE,
      --text, 
      --integer, 
      --text, 
      --integer, 
      TRUE,
      FALSE,
      FALSE,
      --integer, 
      --boolean, 
      --integer, 
      --boolean, 
      --integer, 
      --boolean, 
      --integer, 
      --boolean, 
      FALSE,
      fetchMetricValue(''UnassignedAccount''),
      --numeric(8,4) default 0.00,
      --integer, 
      --integer, 
      NULL
    );
  END IF;

  PERFORM setMetric(''TransitWarehouse'', _id);

  RETURN _id;

END;
' LANGUAGE 'plpgsql';
