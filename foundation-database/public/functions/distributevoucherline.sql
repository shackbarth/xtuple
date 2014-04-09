CREATE OR REPLACE FUNCTION distributeVoucherLine(INTEGER, INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVoucherId ALIAS FOR $1;
  pPoitemId ALIAS FOR $2;
  pCurrId ALIAS FOR $3;
  _count INTEGER;
  _costelemId INTEGER;
  _close BOOLEAN;
  _r RECORD;
  _qtyOrdered NUMERIC;
  _voitemId INTEGER;
  _taxtypeid INTEGER;

BEGIN

--  Make sure the P/O and Voucher are same currency

  SELECT COALESCE(COUNT(*),0) INTO _count
        FROM poitem JOIN pohead ON (pohead_id=poitem_pohead_id)
        WHERE ((poitem_id=pPoitemid)
        AND (pohead_curr_id=pCurrId));
  IF (_count = 0) THEN
        RETURN -3;
  END IF;

--  Validate and get cost element

        SELECT COALESCE(COUNT(*),0) INTO _count
                FROM itemcost, item, itemsite, poitem
                WHERE ((itemcost_item_id=item_id)
                AND (item_id=itemsite_item_id)
                AND (itemsite_id=poitem_itemsite_id)
                AND (poitem_id=pPoitemId));

        IF (_count > 1) THEN
                RETURN -5;
        ELSEIF (_count = 1) THEN
                SELECT itemcost_costelem_id INTO _costelemId
                        FROM itemcost, item, itemsite, poitem
                        WHERE ((itemcost_item_id=item_id)
                        AND (item_id=itemsite_item_id)
                        AND (itemsite_id=poitem_itemsite_id)
                        AND (poitem_id=pPoitemId));
        ELSE
                SELECT costelem_id INTO _costelemId
                        FROM costelem
                        WHERE (costelem_type='Material');
        END IF;


--  Clear previous distributions

        UPDATE recv SET recv_vohead_id=NULL, recv_voitem_id=NULL
                WHERE ((recv_vohead_id=pVoucherId)
                AND (recv_orderitem_id=pPoitemId)
		AND (recv_order_type='PO'));
        UPDATE poreject SET poreject_vohead_id=NULL, poreject_voitem_id=NULL
                WHERE ((poreject_vohead_id=pVoucherId)
                AND (poreject_poitem_id=pPoitemId));
        DELETE FROM vodist
                WHERE ((vodist_poitem_id=pPoitemId)
                AND (vodist_vohead_id=pVoucherId));
        DELETE FROM voitem
                WHERE ((voitem_poitem_id=pPoitemId)
                AND (voitem_vohead_id=pVoucherId));

--  Determine Line balances

        SELECT  COALESCE(SUM(qty_received),0) AS qty_received,
                COALESCE(SUM(qty_rejected),0) AS qty_rejected,
                COALESCE(SUM(qty_vouchered),0) AS qty_vouchered,
                round(COALESCE(SUM(balance),0),2) AS balance,
                round(COALESCE(SUM(freight),0),2) AS freight INTO _r
         FROM   (
                SELECT  recv_qty AS qty_received,
                        0 AS qty_rejected,
                        0 AS qty_vouchered,
                        (recv_qty * COALESCE(recv_purchcost, poitem_unitprice)) AS balance,
                        recv_freight AS freight
                FROM poitem JOIN recv ON ((recv_orderitem_id=poitem_id) AND
                                          (recv_order_type='PO'))
                WHERE ( (recv_vohead_id IS NULL)
                        AND (NOT recv_invoiced)
                        AND (recv_posted)
                        AND (poitem_id=pPoitemId) )

                UNION ALL

                SELECT  0 AS qty_received,
                        (poreject_qty) AS qty_rejected,
                        0 AS qty_vouchered,
                        (poreject_qty * -1 * COALESCE(recv_purchcost, poitem_unitprice)) AS balance,
                        0 AS freight
                FROM poitem JOIN poreject ON (poreject_poitem_id=poitem_id)
                            LEFT OUTER JOIN recv ON (recv_id=poreject_recv_id)
                WHERE ( (poreject_posted)
                        AND (poreject_vohead_id IS NULL)
                        AND (NOT poreject_invoiced)
                        AND (poitem_id=pPoitemId) )

                UNION ALL

                SELECT  0 AS qty_received,
                        0 AS qty_rejected,
                        voitem_qty AS qty_vouchered,
                        0 AS balance,
                        0 AS freight
                FROM voitem, poitem
                WHERE ( (voitem_poitem_id=pPoitemId)
                        AND (poitem_id=voitem_poitem_id) )
                ) AS data;

                SELECT poitem_qty_ordered INTO _qtyOrdered
                FROM poitem
                WHERE (poitem_id=pPoitemId);

        IF _r.balance < 0 THEN
                RETURN -4;
        ELSEIF ( ((_r.qty_received <> 0) OR (_r.qty_received <> 0)) AND (_r.qty_received - _r.qty_rejected = 0) ) THEN
                RETURN -2;
        ELSEIF ((_r.qty_received - _r.qty_rejected) = 0) THEN
                RETURN 0;
        END IF;

-- Determine whether to close P/O item

        IF (_r.qty_received -_r.qty_rejected + _r.qty_vouchered) >= _qtyOrdered THEN
                _close:=True;
        ELSE
                _close:=False;
        END IF;


-- Create distribution

        INSERT INTO vodist
                (vodist_poitem_id,vodist_vohead_id,vodist_costelem_id,vodist_amount,vodist_qty,vodist_expcat_id)
                VALUES (pPoitemId,pVoucherId,_costelemId,_r.balance,(_r.qty_received -_r.qty_rejected),-1);

-- Create voucher item
        SELECT poitem_taxtype_id INTO _taxtypeid
        FROM poitem
        WHERE (poitem_id=pPoitemId);

        SELECT NEXTVAL('voitem_voitem_id_seq') INTO _voitemId;

        INSERT INTO voitem (voitem_id,voitem_vohead_id,voitem_poitem_id,voitem_close,voitem_qty,voitem_freight, voitem_taxtype_id)
                VALUES (_voitemId,pVoucherId,pPoitemId,_close,(_r.qty_received -_r.qty_rejected),_r.freight, _taxtypeid);

-- Tag receipt records

        UPDATE recv
        SET recv_vohead_id=pVoucherId, recv_voitem_id=_voitemId
        WHERE ((recv_orderitem_id=pPoitemId)
	  AND  (recv_order_type='PO')
          AND  (recv_vohead_id IS NULL));

        UPDATE poreject
        SET poreject_vohead_id=pVoucherId,poreject_voitem_id=_voitemId
        WHERE ((poreject_poitem_id=pPoitemId)
        AND (NOT poreject_invoiced)
        AND (poreject_vohead_id IS NULL));


  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
