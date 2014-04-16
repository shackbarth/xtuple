SELECT dropIfExists('view', 'apchkitem');

CREATE VIEW apchkitem (
  apchkitem_id,
  apchkitem_apchk_id,
  apchkitem_vouchernumber,
  apchkitem_ponumber,
  apchkitem_amount,
  apchkitem_invcnumber,
  apchkitem_apopen_id,
  apchkitem_docdate,
  apchkitem_curr_id,
  apchkitem_discount
  )
AS SELECT
  checkitem_id,
  checkitem_checkhead_id,
  checkitem_vouchernumber,
  checkitem_ponumber,
  checkitem_amount,
  checkitem_invcnumber,
  checkitem_apopen_id,
  checkitem_docdate,
  checkitem_curr_id,
  checkitem_discount
FROM checkhead, checkitem
WHERE ((checkitem_checkhead_id=checkhead_id)
  AND  (checkhead_recip_type = 'V'));

REVOKE ALL ON TABLE apchkitem FROM PUBLIC;
GRANT  ALL ON TABLE apchkitem TO GROUP xtrole;
