CREATE OR REPLACE FUNCTION _shipdatatrigger() RETURNS TRIGGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _newShipdata_cohead_number 	INTEGER;
  _shipdatasum_shipper 		TEXT;
  _rows				INTEGER;
  _cohead_id 			INTEGER;
  _shiphead_number 		TEXT;
  _headcount			INTEGER;

BEGIN
  --  This is where the shipper is identified and may need to be changed
  NEW.shipdata_cohead_number := TRIM(NEW.shipdata_cohead_number);

  IF (substring(NEW.shipdata_cosmisc_tracknum from 1 for 2) = '1Z') THEN
    _shipdatasum_shipper := 'UPS';
  ELSE
    _shipdatasum_shipper := 'UNKNOWN';
  END IF;

  IF (LENGTH(TRIM(NEW.shipdata_shiphead_number)) = 0) THEN
    NEW.shipdata_shiphead_number := NULL;
  END IF;

  IF (NEW.shipdata_cosmisc_tracknum = NEW.shipdata_cosmisc_packnum_tracknum) THEN
    IF (NEW.shipdata_void_ind = 'Y') THEN
      --  Delete the current shipdatasum
      DELETE FROM shipdatasum
      WHERE ((shipdatasum_cohead_number = NEW.shipdata_cohead_number)
	AND  (shipdatasum_cosmisc_tracknum = NEW.shipdata_cosmisc_tracknum));

    ELSIF (TG_OP = 'INSERT') THEN

--      RAISE NOTICE 'Getting cohead_id (%)', NEW.shipdata_cohead_number;
      IF (NEW.shipdata_shiphead_number IS NULL) THEN
        SELECT cohead_id INTO _cohead_id FROM cohead WHERE cohead_number = NEW.shipdata_cohead_number;

        IF (FOUND) THEN

--          RAISE NOTICE 'Getting shiphead number (%)', _cohead_id;
          SELECT count(shiphead_order_id), MAX(shiphead_number) INTO _headcount, _shiphead_number 
          FROM shiphead 
          WHERE ((shiphead_tracknum IS NULL OR shiphead_tracknum = '') 
          AND ( shiphead_order_type = 'SO' and shiphead_order_id = _cohead_id) );
          
          IF (_headcount = 1) THEN
--            RAISE NOTICE 'Updating Shiphead Number (%)', _shiphead_number;
            NEW.shipdata_shiphead_number = _shiphead_number;
            
          ELSIF (_headcount > 1) THEN
            -- Trap for potential workflow problem.  Can only infer shiphead from sales order number 
            -- if shipping one at a time
            RAISE EXCEPTION 'Multiple shipments exist for this order.  Please provide a specific a shipment number.';
          END IF;
        END IF;
      END IF;

      INSERT INTO shipdatasum
	      (shipdatasum_cohead_number, shipdatasum_cosmisc_tracknum,
	       shipdatasum_cosmisc_packnum_tracknum, shipdatasum_weight,
	       shipdatasum_base_freight, shipdatasum_total_freight,
	       shipdatasum_base_freight_curr_id, shipdatasum_total_freight_curr_id,
	       shipdatasum_shipper, shipdatasum_billing_option,
	       shipdatasum_package_type, shipdatasum_shiphead_number)
       VALUES (NEW.shipdata_cohead_number, NEW.shipdata_cosmisc_tracknum,
	       NEW.shipdata_cosmisc_packnum_tracknum, NEW.shipdata_weight,
	       NEW.shipdata_base_freight, NEW.shipdata_total_freight,
	       NEW.shipdata_base_freight_curr_id, NEW.shipdata_total_freight_curr_id,
	       _shipdatasum_shipper, NEW.shipdata_billing_option,
	       NEW.shipdata_package_type, NEW.shipdata_shiphead_number);

    ELSIF (TG_OP = 'UPDATE') THEN
       UPDATE shipdatasum SET
	      shipdatasum_cohead_number=NEW.shipdata_cohead_number,
	      shipdatasum_cosmisc_tracknum=NEW.shipdata_cosmisc_tracknum,
	      shipdatasum_cosmisc_packnum_tracknum=NEW.shipdata_cosmisc_packnum_tracknum,
	      shipdatasum_weight=NEW.shipdata_weight,
	      shipdatasum_base_freight=NEW.shipdata_base_freight,
	      shipdatasum_total_freight=NEW.shipdata_total_freight,
	      shipdatasum_base_freight_curr_id=NEW.shipdata_base_freight_curr_id,
	      shipdatasum_total_freight_curr_id=NEW.shipdata_total_freight_curr_id,
	      shipdatasum_shipper=_shipdatasum_shipper,
	      shipdatasum_billing_option=NEW.shipdata_billing_option,
	      shipdatasum_package_type=NEW.shipdata_package_type,
	      shipdatasum_shiphead_number=NEW.shipdata_shiphead_number
       WHERE ((TRIM(shipdatasum_cohead_number)=TRIM(OLD.shipdata_cohead_number))
	  AND (TRIM(shipdatasum_cosmisc_tracknum)=TRIM(OLD.shipdata_cosmisc_tracknum))
	  AND (TRIM(shipdatasum_cosmisc_packnum_tracknum)=TRIM(OLD.shipdata_cosmisc_packnum_tracknum)));

       GET DIAGNOSTICS _rows = ROW_COUNT;
       IF (_rows <= 0) THEN
	 INSERT INTO shipdatasum
		(shipdatasum_cohead_number, shipdatasum_cosmisc_tracknum,
		 shipdatasum_cosmisc_packnum_tracknum, shipdatasum_weight,
		 shipdatasum_base_freight, shipdatasum_total_freight,
		 shipdatasum_base_freight_curr_id, shipdatasum_total_freight_curr_id,
		 shipdatasum_shipper, shipdatasum_billing_option,
		 shipdatasum_package_type, shipdatasum_shiphead_number)
	 VALUES (NEW.shipdata_cohead_number, NEW.shipdata_cosmisc_tracknum,
		 NEW.shipdata_cosmisc_packnum_tracknum, NEW.shipdata_weight,
		 NEW.shipdata_base_freight, NEW.shipdata_total_freight,
		 NEW.shipdata_base_freight_curr_id, NEW.shipdata_total_freight_curr_id,
		 _shipdatasum_shipper, NEW.shipdata_billing_option,
		 NEW.shipdata_package_type, NEW.shipdata_shiphead_number);
       END IF;
    END IF;
  END IF;

  RETURN NEW;

END;
$$ LANGUAGE 'plpgsql' VOLATILE;

SELECT dropIfExists('TRIGGER', 'shipdatatrigger');
CREATE TRIGGER shipdatatrigger BEFORE INSERT OR UPDATE ON shipdata FOR EACH ROW EXECUTE PROCEDURE _shipdatatrigger();
