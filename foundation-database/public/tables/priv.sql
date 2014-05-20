insert into priv (priv_module, priv_name, priv_descrip)
select 'Accounting', 'ChangeCashRecvPostDate',
       'Can change the distribution date when posting Cash Receipts'
where not exists (select c.priv_id from priv c where c.priv_name = 'ChangeCashRecvPostDate');