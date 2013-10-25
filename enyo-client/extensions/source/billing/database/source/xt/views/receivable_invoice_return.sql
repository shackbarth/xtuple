select xt.create_view('xt.receivable_invoice_return', $$

  select aropen_id as id,
    obj_uuid as natural_key,
    aropen_doctype as document_type,
    aropen_docnumber as document_number,
    aropen_posted as posted,
    aropen_open as open,
    aropen_cust_id as customer,
    aropen_docdate as document_date,
    aropen_duedate due_date,
    aropen_amount as amount,
    aropen_curr_id as currency,
    aropen_paid as paid,
    0 as balance,
    0 as base_amount,
    0 as base_paid,
    aropen_notes as notes
  from aropen
  union
  select invchead_id as id,
    invchead_invcnumber as natural_key,
    null as document_type,
    invchead_invcnumber as documentNumber,
    invchead_posted as posted,
    true as open,
    invchead_cust_id as customer,
    invchead_invcdate as document_date,
    invchead_shipdate as due_date,
    invchead_misc_amount as amount,
    invchead_curr_id as currency,
    invchead_payment as paid,
    0 as balance,
    0 as base_amount,
    0 as base_paid,
    invchead_notes as notes
  from invchead
  union
  select cmhead_id as id,
    cmhead_number as natural_key,
    null as document_type,
    cmhead_invcnumber as document_number,
    cmhead_posted as posted,
    true as open,
    cmhead_cust_id as customer,
    cmhead_docdate as document_date,
    null as due_date,
    0 as amount,
    cmhead_curr_id as currency,
    0 as paid,
    0 as balance,
    0 as base_amount,
    0 as base_paid,
    cmhead_comments as notes
  from cmhead
$$);