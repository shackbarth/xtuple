-- join with the checkhead table to get information about the check recipient
SELECT dropIfExists('view', 'apchk');

CREATE VIEW apchk (
  apchk_id,
  apchk_vend_id,
  apchk_bankaccnt_id,
  apchk_printed,
  apchk_checkdate,
  apchk_number,
  apchk_amount,
  apchk_void,
  apchk_replaced,
  apchk_posted,
  apchk_rec,
  apchk_misc,
  apchk_expcat_id,
  apchk_for,
  apchk_notes,
  apchk_journalnumber,
  apchk_curr_id,
  apchk_deleted
)
AS
SELECT 
  checkhead_id,
  checkhead_recip_id,
  checkhead_bankaccnt_id,
  checkhead_printed,
  checkhead_checkdate,
  checkhead_number,
  checkhead_amount,
  checkhead_void,
  checkhead_replaced,
  checkhead_posted,
  checkhead_rec,
  checkhead_misc,
  checkhead_expcat_id,
  checkhead_for,
  checkhead_notes,
  checkhead_journalnumber,
  checkhead_curr_id,
  checkhead_deleted
FROM checkhead
WHERE (checkhead_recip_type='V');

REVOKE ALL ON TABLE apchk FROM PUBLIC;
GRANT  ALL ON TABLE apchk TO GROUP xtrole;
