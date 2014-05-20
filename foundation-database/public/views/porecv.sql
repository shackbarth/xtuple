SELECT dropIfExists('VIEW', 'porecv');
CREATE VIEW porecv AS
  SELECT       recv_id                 AS porecv_id,
               recv_date               AS porecv_date,
               recv_rlsd_duedate       AS porecv_rlsd_duedate,
               pohead_orderdate        AS porecv_orderdate,
               pohead_released         AS porecv_released,
               recv_order_number       AS porecv_ponumber,
               recv_itemsite_id        AS porecv_itemsite_id,
               recv_vend_id            AS porecv_vend_id,
               item.item_number        AS porecv_item_number,
               recv_vend_item_number   AS porecv_vend_item_number,
               COALESCE(item.item_descrip1, recv_vend_item_descrip) AS porecv_vend_item_descrip,
               recv_vend_uom           AS porecv_vend_uom,
               recv_qty                AS porecv_qty,
               recv_posted             AS porecv_posted,
               recv_invoiced           AS porecv_invoiced,
               usesysid::INTEGER       AS porecv_trans_usr_id,
               recv_orderitem_id       AS porecv_poitem_id,
               NULL::INTEGER           AS porecv_linenumber,   -- not used!
               recv_purchcost          AS porecv_purchcost,
               recv_vohead_id          AS porecv_vohead_id,
               recv_recvcost           AS porecv_recvcost,
               recv_duedate            AS porecv_duedate,
               recv_agent_username     AS porecv_agent_username,
               recv_notes              AS porecv_notes,
               recv_freight            AS porecv_freight,
               recv_freight_curr_id    AS porecv_curr_id,
               recv_gldistdate         AS porecv_gldistdate,
               recv_voitem_id          AS porecv_voitem_id,
               recv_value              AS porecv_value
   FROM recv
   LEFT JOIN pg_user ON (recv_trans_usr_name = usename)
   LEFT JOIN pohead ON (recv_order_number = pohead_number)
   LEFT OUTER JOIN itemsite ON (recv_itemsite_id = itemsite_id)
   LEFT JOIN item ON (itemsite_item_id = item_id)
  WHERE recv_order_type='PO';

REVOKE ALL ON TABLE porecv FROM PUBLIC;
GRANT  ALL ON TABLE porecv TO GROUP xtrole;
