CREATE OR REPLACE FUNCTION _quheadtrigger() RETURNS "trigger" AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cmnttypeid INTEGER;
  _oldHoldType TEXT;
  _newHoldType TEXT;
  _p RECORD;
  _a RECORD;
  _w RECORD;
  _shiptoId INTEGER;
  _addrId INTEGER;
  _prjId INTEGER;
  _check BOOLEAN;
  _numGen CHAR(1);

BEGIN

  --  Checks
  SELECT checkPrivilege('MaintainQuotes') INTO _check;
  IF NOT (_check) THEN
    RAISE EXCEPTION 'You do not have privileges to maintain Quotes.';
  END IF;

  -- If this is imported, check the quote number
  IF (TG_OP = 'INSERT') THEN
    IF (NEW.quhead_imported) THEN
      SELECT fetchMetricText('QUNumberGeneration') INTO _numGen;
      IF ((NEW.quhead_number IS NULL) AND (_numGen='M')) THEN
        RAISE EXCEPTION 'You must supply a Quote Number.';
      ELSE
        IF ((NEW.quhead_number IS NOT NULL) AND (_numGen='A')) THEN
          RAISE EXCEPTION 'You may not supply a new Quote Number xTuple will generate the number.';
        ELSE
          IF ((NEW.quhead_number IS NULL) AND (_numGen='O')) THEN
            SELECT fetchqunumber() INTO NEW.quhead_number;
          ELSE
            IF (NEW.quhead_number IS NULL) THEN
              SELECT fetchsonumber() INTO NEW.quhead_number;
            END IF;
          END IF;
        END IF;
      END IF;
    END IF;

    IF (fetchMetricText('QUNumberGeneration') IN ('A','O')) THEN
      --- clear the number from the issue cache
      PERFORM clearNumberIssue('QuNumber', NEW.quhead_number);
    ELSIF (fetchMetricText('QUNumberGeneration') = 'S') THEN
      --- clear the number from the issue cache
      PERFORM clearNumberIssue('SoNumber', NEW.quhead_number);
    END IF;

  ELSE
    IF (TG_OP = 'UPDATE') THEN
       IF (NEW.quhead_number <> OLD.quhead_number) THEN
         RAISE EXCEPTION 'The order number may not be changed.';
       END IF;
    END IF;
  END IF;

  IF (TG_OP IN ('INSERT','UPDATE')) THEN
    -- Get Customer data
    IF (NEW.quhead_shipto_id IS NULL) THEN
      SELECT * INTO _p FROM (
      SELECT cust_number,cust_usespos,cust_blanketpos,cust_ffbillto,
	     cust_ffshipto,cust_name,cust_salesrep_id,cust_terms_id,cust_shipvia,
	     cust_commprcnt,cust_curr_id,cust_taxzone_id,
  	     addr_line1,addr_line2,addr_line3,addr_city,addr_state,addr_postalcode,addr_country,
	     shipto_id,shipto_addr_id,shipto_name,shipto_salesrep_id,shipto_shipvia,
	     shipto_shipchrg_id,shipto_shipform_id,shipto_commission,shipto_taxzone_id
      FROM custinfo
        LEFT OUTER JOIN cntct ON (cust_cntct_id=cntct_id)
        LEFT OUTER JOIN addr ON (cntct_addr_id=addr_id)
        LEFT OUTER JOIN shiptoinfo ON ((cust_id=shipto_cust_id) AND shipto_default)
      WHERE (cust_id=NEW.quhead_cust_id)
      UNION
      SELECT prospect_number,false,false,true,
	     true,prospect_name,prospect_salesrep_id,null,null,
	     null,null,prospect_taxzone_id,
  	     addr_line1,addr_line2,addr_line3,addr_city,addr_state,addr_postalcode,addr_country,
	     null,null,null,null,null,
	     null,null,null,null
      FROM prospect
        LEFT OUTER JOIN cntct ON (prospect_cntct_id=cntct_id)
        LEFT OUTER JOIN addr ON (cntct_addr_id=addr_id)
      WHERE (prospect_id=NEW.quhead_cust_id)) AS data;
    ELSE
      SELECT cust_creditstatus,cust_number,cust_usespos,cust_blanketpos,cust_ffbillto,
	     cust_ffshipto,cust_name,cust_salesrep_id,cust_terms_id,cust_shipvia,
	     cust_shipchrg_id,cust_shipform_id,cust_commprcnt,cust_curr_id,cust_taxzone_id,
  	     addr_line1,addr_line2,addr_line3,addr_city,addr_state,addr_postalcode,addr_country,
	     shipto_id,shipto_addr_id,shipto_name,shipto_salesrep_id,shipto_shipvia,
	     shipto_shipchrg_id,shipto_shipform_id,shipto_commission,shipto_taxzone_id INTO _p
      FROM shiptoinfo,custinfo
        LEFT OUTER JOIN cntct ON (cust_cntct_id=cntct_id)
        LEFT OUTER JOIN addr ON (cntct_addr_id=addr_id)
      WHERE ((cust_id=NEW.quhead_cust_id)
      AND (shipto_id=shipto_id));
    END IF;

    -- If there is customer data, then we can get to work
    IF (FOUND) THEN
      -- Only check PO number for imports because UI checks when whole quote is saved
      IF (TG_OP = 'INSERT') THEN
          -- Set to defaults if values not provided
          NEW.quhead_shipto_id		:= COALESCE(NEW.quhead_shipto_id,_p.shipto_id);
	  NEW.quhead_salesrep_id 	:= COALESCE(NEW.quhead_salesrep_id,_p.shipto_salesrep_id,_p.cust_salesrep_id);
          NEW.quhead_terms_id		:= COALESCE(NEW.quhead_terms_id,_p.cust_terms_id);
          NEW.quhead_shipvia		:= COALESCE(NEW.quhead_shipvia,_p.shipto_shipvia,_p.cust_shipvia);
          NEW.quhead_commission		:= COALESCE(NEW.quhead_commission,_p.shipto_commission,_p.cust_commprcnt);
          NEW.quhead_quotedate		:= COALESCE(NEW.quhead_quotedate,current_date);
          NEW.quhead_packdate		:= COALESCE(NEW.quhead_packdate,NEW.quhead_quotedate);
          NEW.quhead_curr_id		:= COALESCE(NEW.quhead_curr_id,_p.cust_curr_id,basecurrid());
          NEW.quhead_taxzone_id		:= COALESCE(NEW.quhead_taxzone_id,_p.shipto_taxzone_id,_p.cust_taxzone_id);
          NEW.quhead_freight		:= COALESCE(NEW.quhead_freight,0);
          NEW.quhead_custponumber	:= COALESCE(NEW.quhead_custponumber,'');
          NEW.quhead_ordercomments	:= COALESCE(NEW.quhead_ordercomments,'');
          NEW.quhead_shipcomments	:= COALESCE(NEW.quhead_shipcomments,'');
          NEW.quhead_shiptophone	:= COALESCE(NEW.quhead_shiptophone,'');
          NEW.quhead_misc		:= COALESCE(NEW.quhead_misc,0);
          NEW.quhead_misc_descrip	:= COALESCE(NEW.quhead_misc_descrip,'');

          IF ((NEW.quhead_warehous_id IS NULL) OR (NEW.quhead_fob IS NULL)) THEN
            IF (NEW.quhead_warehous_id IS NULL) THEN
              SELECT warehous_id,warehous_fob INTO _w
              FROM usrpref, whsinfo
              WHERE ((warehous_id=CAST(usrpref_value AS INTEGER))
                AND (warehous_shipping)
                AND (warehous_active)
                AND (usrpref_username=getEffectiveXtUser())
                AND (usrpref_name='PreferredWarehouse'));
            ELSE
              SELECT warehous_id,warehous_fob INTO _w
              FROM whsinfo
              WHERE (warehous_id=NEW.quhead_warehous_id);
            END IF;

            IF (FOUND) THEN
              NEW.quhead_warehous_id 	:= COALESCE(NEW.quhead_warehous_id,_w.warehous_id);
              NEW.quhead_fob		:= COALESCE(NEW.quhead_fob,_w.warehous_fob);
            END IF;
          END IF;
      END IF;

      --Auto create project if applicable
      IF ((TG_OP = 'INSERT') AND (COALESCE(NEW.quhead_prj_id,-1)=-1)) THEN
        SELECT fetchMetricBool('AutoCreateProjectsForOrders') INTO _check;
        IF (_check) THEN
          SELECT NEXTVAL('prj_prj_id_seq') INTO _prjId;
          NEW.quhead_prj_id := _prjId;
          INSERT INTO prj (prj_id, prj_number, prj_name, prj_descrip,
                           prj_status, prj_so, prj_wo, prj_po,
                           prj_owner_username, prj_start_date, prj_due_date,
                           prj_assigned_date, prj_completed_date, prj_username,
                           prj_recurring_prj_id, prj_crmacct_id,
                           prj_cntct_id, prj_prjtype_id)
          SELECT _prjId, NEW.quhead_number, NEW.quhead_number, 'Auto Generated Project from Quote.',
                 'O', TRUE, TRUE, TRUE,
                 getEffectiveXTUser(), NEW.quhead_quotedate, NEW.quhead_packdate,
                 NEW.quhead_quotedate, NULL, getEffectiveXTUser(),
                 NULL, crmacct_id,
                 NEW.quhead_billto_cntct_id, NULL
          FROM crmacct
          WHERE (crmacct_cust_id=NEW.quhead_cust_id)
             OR (crmacct_prospect_id=NEW.quhead_cust_id)
          LIMIT 1;
        END IF;
      END IF;

      -- Deal with Billing Address
      IF (TG_OP = 'INSERT') THEN
        IF (_p.cust_ffbillto) THEN
          -- If they didn't supply data, we'll put in the bill to address
          NEW.quhead_billtoname=COALESCE(NEW.quhead_billtoname,_p.cust_name,'');
          NEW.quhead_billtoaddress1=COALESCE(NEW.quhead_billtoaddress1,_p.addr_line1,'');
          NEW.quhead_billtoaddress2=COALESCE(NEW.quhead_billtoaddress2,_p.addr_line2,'');
          NEW.quhead_billtoaddress3=COALESCE(NEW.quhead_billtoaddress3,_p.addr_line3,'');
          NEW.quhead_billtocity=COALESCE(NEW.quhead_billtocity,_p.addr_city,'');
          NEW.quhead_billtostate=COALESCE(NEW.quhead_billtostate,_p.addr_state,'');
          NEW.quhead_billtozip=COALESCE(NEW.quhead_billtozip,_p.addr_postalcode,'');
          NEW.quhead_billtocountry=COALESCE(NEW.quhead_billtocountry,_p.addr_country,'');
        ELSE
          -- Free form not allowed, we're going to put in the address regardless
          NEW.quhead_billtoname=COALESCE(_p.cust_name,'');
          NEW.quhead_billtoaddress1=COALESCE(_p.addr_line1,'');
          NEW.quhead_billtoaddress2=COALESCE(_p.addr_line2,'');
          NEW.quhead_billtoaddress3=COALESCE(_p.addr_line3,'');
          NEW.quhead_billtocity=COALESCE(_p.addr_city,'');
          NEW.quhead_billtostate=COALESCE(_p.addr_state,'');
          NEW.quhead_billtozip=COALESCE(_p.addr_postalcode,'');
          NEW.quhead_billtocountry=COALESCE(_p.addr_country,'');
        END IF;
      END IF;

      -- Now let's look at Shipto Address
      -- If there's nothing in the address fields and there is a shipto id
      -- or there is a default address available, let's put in some shipto address data
      IF ((TG_OP = 'INSERT')
       AND NOT ((NEW.quhead_shipto_id IS NULL) AND NOT _p.cust_ffshipto)
       AND (NEW.quhead_shiptoname IS NULL)
       AND (NEW.quhead_shiptoaddress1 IS NULL)
       AND (NEW.quhead_shiptoaddress2 IS NULL)
       AND (NEW.quhead_shiptoaddress3 IS NULL)
       AND (NEW.quhead_shiptocity IS NULL)
       AND (NEW.quhead_shiptostate IS NULL)
       AND (NEW.quhead_shiptocountry IS NULL)) THEN
        IF ((NEW.quhead_shipto_id IS NULL) AND (_p.shipto_id IS NOT NULL)) THEN
          _shiptoId := _p.shipto_addr_id;
        ELSE
          _shiptoId := NEW.quhead_shipto_id;
        END IF;

        SELECT * INTO _a
        FROM shiptoinfo, addr
        WHERE ((shipto_id=_shiptoId)
        AND (addr_id=shipto_addr_id));

        NEW.quhead_shiptoname := COALESCE(_p.shipto_name,'');
        NEW.quhead_shiptoaddress1 := COALESCE(_a.addr_line1,'');
        NEW.quhead_shiptoaddress2 := COALESCE(_a.addr_line2,'');
        NEW.quhead_shiptoaddress3 := COALESCE(_a.addr_line3,'');
        NEW.quhead_shiptocity := COALESCE(_a.addr_city,'');
        NEW.quhead_shiptostate := COALESCE(_a.addr_state,'');
        NEW.quhead_shiptozipcode := COALESCE(_a.addr_postalcode,'');
        NEW.quhead_shiptocountry := COALESCE(_a.addr_country,'');
      ELSE
        IF (_p.cust_ffshipto) THEN
          -- Use Address Save function to see if the new address entered matches
          -- data for the shipto number.  If not that will insert new address for CRM
          SELECT SaveAddr(
            NULL,
            NULL,
            NEW.quhead_shiptoaddress1,
            NEW.quhead_shiptoaddress2,
            NEW.quhead_shiptoaddress3,
            NEW.quhead_shiptocity,
            NEW.quhead_shiptostate,
            NEW.quhead_shiptozipcode,
            NEW.quhead_shiptocountry,
            'CHANGEONE') INTO _addrId;
          SELECT shipto_addr_id INTO _shiptoid FROM shiptoinfo WHERE (shipto_id=NEW.quhead_shipto_id);
           -- If the address passed doesn't match shipto address, then it's something else
           IF (_shiptoid <> _addrId) THEN
             NEW.quhead_shipto_id := NULL;
           END IF;
        ELSE
          SELECT quhead_shipto_id INTO _shiptoid FROM quhead WHERE (quhead_id=NEW.quhead_id);
          -- Get the shipto address
            IF (COALESCE(NEW.quhead_shipto_id,-1) <> COALESCE(_shiptoid,-1)) THEN
            SELECT * INTO _a
            FROM shiptoinfo
            LEFT OUTER JOIN cntct ON (shipto_cntct_id=cntct_id)
            LEFT OUTER JOIN addr ON (shipto_addr_id=addr_id)
            WHERE (shipto_id=NEW.quhead_shipto_id);
            IF (FOUND) THEN
              -- Free form not allowed so we're going to make sure address matches Shipto data
              NEW.quhead_shiptoname := COALESCE(_a.shipto_name,'');
              NEW.quhead_shiptophone := COALESCE(_a.cntct_phone,'');
              NEW.quhead_shiptoaddress1 := COALESCE(_a.addr_line1,'');
              NEW.quhead_shiptoaddress2 := COALESCE(_a.addr_line2,'');
              NEW.quhead_shiptoaddress3 := COALESCE(_a.addr_line3,'');
              NEW.quhead_shiptocity := COALESCE(_a.addr_city,'');
              NEW.quhead_shiptostate := COALESCE(_a.addr_state,'');
              NEW.quhead_shiptozipcode := COALESCE(_a.addr_postalcode,'');
              NEW.quhead_shiptocountry := COALESCE(_a.addr_country,'');
            ELSE
              -- If no shipto data and free form not allowed, this won't work
              RAISE EXCEPTION 'Free form Shipto is not allowed on this Customer. You must supply a valid Shipto ID.';
            END IF;
          END IF;
        END IF;
      END IF;
    END IF;
  END IF;

  IF ( SELECT (metric_value='t')
       FROM metric
       WHERE (metric_name='SalesOrderChangeLog') ) THEN

--  Cache the cmnttype_id for ChangeLog
    SELECT cmnttype_id INTO _cmnttypeid
    FROM cmnttype
    WHERE (cmnttype_name='ChangeLog');
    IF (FOUND) THEN
      IF (TG_OP = 'INSERT') THEN
        PERFORM postComment(_cmnttypeid, 'Q', NEW.quhead_id, 'Created');

      ELSIF (TG_OP = 'UPDATE') THEN

        IF (OLD.quhead_terms_id <> NEW.quhead_terms_id) THEN
          PERFORM postComment( _cmnttypeid, 'Q', NEW.quhead_id,
                               ('Terms Changed from "' || oldterms.terms_code || '" to "' || newterms.terms_code || '"') )
          FROM terms AS oldterms, terms AS newterms
          WHERE ( (oldterms.terms_id=OLD.quhead_terms_id)
           AND (newterms.terms_id=NEW.quhead_terms_id) );
        END IF;

      ELSIF (TG_OP = 'DELETE') THEN
        DELETE FROM comment
        WHERE ( (comment_source='Q')
         AND (comment_source_id=OLD.quhead_id) );
      END IF;
    END IF;
  END IF;

  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;

END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS quheadtrigger ON quhead;
CREATE TRIGGER quheadtrigger
  BEFORE INSERT OR UPDATE OR DELETE
  ON quhead
  FOR EACH ROW
  EXECUTE PROCEDURE _quheadtrigger();
