select xt.install_js('XM','ItemSource','purchasing', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
     See www.xtuple.com/CPAL for the full text of the software license. */

  if (!XM.ItemSource) { XM.ItemSource = {}; }

  XM.ItemSource.isDispatchable = true;

  XM.ItemSource.hasDuplicate = function (uuid, itemId, vendorId, effective, expires) {
    var result,
      sql = "select count(*) as overlaps " +
            "from itemsrc " +
            "  join item on item_id=itemsrc_item_id " +
            "  join vendinfo on vend_id=itemsrc_vend_id " +
            "where itemsrc.obj_uuid != $1 " +
            " and item_number = $2" +
            " and vend_number = $3" +
            " and ( (itemsrc_effective between $4::date and $5::date or" +
            "        itemsrc_expires between $4::date and $5::date)" +
            "    or (itemsrc_effective <= $4::date and" +
            "        itemsrc_expires >= $5::date) );"

    result = plv8.execute(sql, [uuid, itemId, vendorId, effective, expires])[0].overlaps;
    return result > 0;
  }

$$ );
