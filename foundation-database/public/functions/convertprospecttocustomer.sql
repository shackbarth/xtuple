CREATE OR REPLACE FUNCTION convertProspectToCustomer(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN convertProspectToCustomer($1, FALSE);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION convertProspectToCustomer(INTEGER, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pProspectId ALIAS FOR $1;
  pdoquotes   ALIAS FOR $2;
  _p          RECORD;
  _q          RECORD;

BEGIN
  SELECT * INTO _p
  FROM prospect
  WHERE (prospect_id=pProspectId);

  IF (EXISTS(SELECT cust_id FROM custinfo WHERE cust_id=pProspectId)) THEN
    RAISE EXCEPTION '[xtuple: convertProspectToCustomer, -10]';
  END IF;

  INSERT INTO custinfo (
        cust_id, cust_active, cust_number,
        cust_name, cust_cntct_id, cust_taxzone_id,
        cust_comments, cust_creditstatus,
        cust_salesrep_id, cust_preferred_warehous_id,
        cust_terms_id,
        cust_custtype_id, cust_shipform_id,
        cust_shipvia, cust_balmethod,
        cust_ffshipto, cust_backorder,
        cust_partialship, cust_creditlmt,
        cust_creditrating, cust_commprcnt,
        cust_discntprcnt, cust_blanketpos,
        cust_shipchrg_id, cust_ffbillto,
        cust_usespos, cust_emaildelivery,
        cust_autoupdatestatus,cust_autoholdorders,
        cust_soemaildelivery) 
  SELECT
      _p.prospect_id, _p.prospect_active, _p.prospect_number,
      _p.prospect_name, _p.prospect_cntct_id, _p.prospect_taxzone_id,
      _p.prospect_comments, 'G',
      COALESCE(_p.prospect_salesrep_id, salesrep_id),
      COALESCE(_p.prospect_warehous_id, -1),
      FetchMetricValue('DefaultTerms'),
      FetchMetricValue('DefaultCustType'),
      FetchMetricValue('DefaultShipFormId'),
      COALESCE(FetchMetricValue('DefaultShipViaId'),-1),
      FetchMetricText('DefaultBalanceMethod'),
      FetchMetricBool('DefaultFreeFormShiptos'),
      FetchMetricBool('DefaultBackOrders'),
      FetchMetricBool('DefaultPartialShipments'),
      FetchMetricValue('SOCreditLimit'),
      FetchMetricText('SOCreditRate'),
      salesrep_commission,
      0, false, -1,false,false,false,false,
      false, false
  FROM salesrep WHERE (salesrep_id=FetchMetricValue('DefaultSalesRep'));

  DELETE FROM prospect WHERE (prospect_id=pprospectId);

  IF (pdoquotes) THEN
    BEGIN
      FOR _q IN SELECT quhead_number, convertQuote(quhead_id) AS err
                  FROM quhead
                 WHERE ((COALESCE(quhead_expire, endOfTime()) >= CURRENT_DATE)
                    AND (quhead_cust_id=pProspectId)) LOOP
        IF (_q.err < 0) THEN
          RAISE NOTICE 'Quote % for % didn''t convert to a Sales Order [xtuple: convertQuote, %]',
                       _q.quhead_number, _p.prospect_number, _q.err;
        END IF;
      END LOOP;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Ignored errors convering quotes: % %', SQLSTATE, SQLERRM;
    END;
  END IF;

  RETURN pProspectId;
END;
$$ LANGUAGE 'plpgsql';

