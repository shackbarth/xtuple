CREATE OR REPLACE FUNCTION postPoReturns(INTEGER, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPoheadid ALIAS FOR $1;
  pCreateMemo ALIAS FOR $2;
  _itemlocSeries INTEGER;
  _p RECORD;
  _returnval	INTEGER;
  _tmp        INTEGER;
  _pricevar   NUMERIC := 0.00;
  _invhistid		INTEGER;
  _journalNumber INTEGER := fetchJournalNumber('GL-MISC');

BEGIN

  _itemlocSeries := 0;

  FOR _p IN SELECT pohead_number, pohead_curr_id, poreject_id, poitem_prj_id,
		   poreject_poitem_id, poitem_id, poitem_expcat_id, poitem_linenumber,
		   currToBase(COALESCE(recv_purchcost_curr_id, pohead_curr_id),
                              COALESCE(recv_purchcost, poitem_unitprice),
			      pohead_orderdate) AS poitem_unitprice_base,
                   COALESCE(itemsite_id, -1) AS itemsiteid, poitem_invvenduomratio,
                   SUM(poreject_qty) AS totalqty,
                   itemsite_item_id, itemsite_costmethod, itemsite_controlmethod, recv_date
            FROM pohead JOIN poitem ON (poitem_pohead_id=pohead_id)
                        JOIN poreject ON (poreject_poitem_id=poitem_id AND NOT poreject_posted) 
                        LEFT OUTER JOIN itemsite ON (poitem_itemsite_id=itemsite_id)
                        LEFT OUTER JOIN recv ON (recv_id=poreject_recv_id)
            WHERE (pohead_id=pPoheadid)
            GROUP BY poreject_id, pohead_number, poreject_poitem_id, poitem_id, poitem_prj_id,
		     poitem_expcat_id, poitem_linenumber, poitem_unitprice, pohead_curr_id,
		     pohead_orderdate, itemsite_id, poitem_invvenduomratio,
                     itemsite_item_id, itemsite_costmethod, itemsite_controlmethod, recv_date,
                     recv_purchcost_curr_id, recv_purchcost LOOP

    IF (_p.itemsiteid = -1) THEN
        SELECT insertGLTransaction( 'S/R', 'PO', _p.pohead_number, 'Return Non-Inventory to P/O',
                                     expcat_liability_accnt_id, 
                                     getPrjAccntId(_p.poitem_prj_id, expcat_exp_accnt_id), -1,
                                     round(_p.poitem_unitprice_base * _p.totalqty * -1, 2),
				     CURRENT_DATE ) INTO _returnval
        FROM expcat
        WHERE (expcat_id=_p.poitem_expcat_id);

        UPDATE poreject
        SET poreject_posted=TRUE, poreject_value= round(_p.poitem_unitprice_base * _p.totalqty, 2)
        WHERE (poreject_id=_p.poreject_id);

    ELSEIF (_p.itemsite_controlmethod='N') THEN
      SELECT insertGLTransaction('S/R', 'PO', _p.pohead_number, 'Return Non-Controlled Inventory from PO',
                                 costcat_liability_accnt_id,
                                 getPrjAccntId(_p.poitem_prj_id, costcat_exp_accnt_id), -1,
                                 round((_p.poitem_unitprice_base * _p.totalqty * -1), 2),
                                 CURRENT_DATE ) INTO _returnval
      FROM itemsite, costcat
      WHERE((itemsite_costcat_id=costcat_id)
        AND (itemsite_id=_p.itemsiteid));
      IF (_returnval = -3) THEN -- zero value transaction
        _returnval := 0;
      END IF;
      UPDATE poreject
      SET poreject_posted=TRUE, poreject_value= round(_p.poitem_unitprice_base * _p.totalqty, 2)
      WHERE (poreject_id=_p.poreject_id);
    ELSE
      IF (_itemlocSeries = 0) THEN
        SELECT NEXTVAL('itemloc_series_seq') INTO _itemlocSeries;
      END IF;

      SELECT postInvTrans( itemsite_id, 'RP', (_p.totalqty * _p.poitem_invvenduomratio * -1),
                           'S/R', 'PO', (_p.pohead_number || '-' || _p.poitem_linenumber::TEXT), '', 'Return Inventory to P/O',
                           costcat_asset_accnt_id, costcat_liability_accnt_id, _itemlocSeries, CURRENT_TIMESTAMP) INTO _returnval
      FROM itemsite, costcat
      WHERE ( (itemsite_costcat_id=costcat_id)
       AND (itemsite_id=_p.itemsiteid) );

      UPDATE poreject
      SET poreject_posted=TRUE, poreject_value=(invhist_unitcost *_p.totalqty * _p.poitem_invvenduomratio)
      FROM invhist
      WHERE ((poreject_id=_p.poreject_id)
      AND (invhist_id=_returnval));

    END IF;

    IF (_returnval < 0) THEN
      RETURN _returnval;
    END IF;


    UPDATE poitem
    SET poitem_qty_returned=(poitem_qty_returned + _p.totalqty),
	poitem_status='O'
    WHERE (poitem_id=_p.poitem_id);

      IF (fetchMetricBool('RecordPPVonReceipt')) THEN -- If the 'Purchase Price Variance on Receipt' option is true
         _invhistid := _returnval;
         -- Find the difference in the purchase price value expected from the P/O and the value of the transaction
         SELECT ((_p.poitem_unitprice_base * poitem_qty_returned) - (invhist_value_before - invhist_value_after)) INTO _pricevar
         FROM invhist, poitem
         WHERE ((invhist_id = _invhistid)
           AND  (poitem_id=_p.poitem_id));

         -- If difference exists then
         IF (_pricevar <> 0.00) THEN
           -- Record an additional GL Transaction for the purchase price variance
           SELECT insertGLTransaction( _journalNumber,
                'S/R', 'PO', _p.pohead_number,
                                       'Purchase price variance adjusted for P/O ' || _p.pohead_number || ' for item ' || _p.poitem_linenumber::TEXT,
                                       costcat_liability_accnt_id,
                                       getPrjAccntId(_p.poitem_prj_id, costcat_purchprice_accnt_id), -1,
                                       _pricevar,
                                       CURRENT_DATE, false ) INTO _tmp
           FROM itemsite, costcat, poitem
           WHERE ((itemsite_costcat_id=costcat_id)
              AND (itemsite_id=poitem_itemsite_id) );
           IF (NOT FOUND) THEN
             RAISE EXCEPTION 'Could not insert G/L transaction: no cost category found for itemsite_id %',
             _p.itemsiteid;
           ELSIF (_tmp < 0 AND _tmp != -3) THEN -- error but not 0-value transaction
             RETURN _tmp;
           ELSE
             -- Posting to trial balance is deferred to prevent locking
             INSERT INTO itemlocpost ( itemlocpost_glseq, itemlocpost_itemlocseries)
             VALUES ( _tmp, _itemlocSeries );
           END IF;
         END IF;
       END IF;

    IF (pCreateMemo) THEN
	SELECT postPoReturnCreditMemo(_p.poreject_id) INTO _returnval;
    END IF;

    IF (_returnval < 0) THEN
      RETURN _returnval;
    END IF;

  END LOOP;

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION postPoReturns(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPoheadid ALIAS FOR $1;
  _itemlocSeries INTEGER;
  _p RECORD;
  _returnval	INTEGER;

BEGIN

  _itemlocSeries := 0;

  SELECT postPoReturns(pPoheadid,false) INTO _itemlocseries;

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';

