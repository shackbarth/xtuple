CREATE OR REPLACE FUNCTION calcVoucherFreight(INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVoucherid ALIAS FOR $1;
  _amount NUMERIC := 0;

BEGIN

  SELECT SUM(COALESCE(voitem_freight, 0)) INTO _amount
  FROM voitem
  WHERE (voitem_vohead_id=pVoucherid);

  RETURN _amount;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION calcVoucherTax(INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVoucherid ALIAS FOR $1;
  _amount NUMERIC := 0;

BEGIN

  SELECT COALESCE(calculateTax(vohead_taxzone_id,
                               vohead_taxtype_id,
                               vohead_docdate,
                               vohead_curr_id,
                               calcVoucherAmt(vohead_id)), 0) INTO _amount
  FROM vohead
  WHERE (vohead_id=pVoucherid);

  RETURN _amount;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION calcVoucherAmt(INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVoucherid ALIAS FOR $1;
  _amount NUMERIC := 0;

BEGIN

  SELECT SUM(COALESCE(vodist_amount, 0)) INTO _amount
  FROM vodist
  WHERE (vodist_vohead_id=pVoucherid);

  RETURN _amount;

END;
$$ LANGUAGE 'plpgsql';

