-- table definition

select xt.create_table('batch', 'xtbatch');
select xt.add_column('batch','batch_id', 'serial', 'primary key', 'xtbatch');
select xt.add_column('batch','batch_action', 'text', '', 'xtbatch');
select xt.add_column('batch','batch_parameter', 'text', '', 'xtbatch');
select xt.add_column('batch','batch_user', 'text', '', 'xtbatch');
select xt.add_column('batch','batch_email', 'text', '', 'xtbatch');
select xt.add_column('batch','batch_submitted', 'text', '', 'xtbatch');
select xt.add_column('batch','batch_scheduled', 'text', '', 'xtbatch');
select xt.add_column('batch','batch_started', 'text', '', 'xtbatch');
select xt.add_column('batch','batch_completed', 'text', '', 'xtbatch');
select xt.add_column('batch','batch_responsebody', 'text', '', 'xtbatch');
select xt.add_column('batch','batch_subject', 'text', '', 'xtbatch');
select xt.add_column('batch','batch_filename', 'text', '', 'xtbatch');
select xt.add_column('batch','batch_exitstatus', 'text', '', 'xtbatch');
select xt.add_column('batch','batch_fromemail', 'text', '', 'xtbatch');
select xt.add_column('batch','batch_reschedinterval', 'text', '', 'xtbatch');
select xt.add_column('batch','batch_cc', 'text', '', 'xtbatch');
select xt.add_column('batch','batch_emailhtml', 'text', '', 'xtbatch');
select xt.add_column('batch','batch_replyto', 'text', '', 'xtbatch');
select xt.add_column('batch','batch_bcc', 'text', '', 'xtbatch');
select xt.add_column('batch','batch_recurring_batch_id', 'integer', 'references xtbatch.batch (batch_id)', 'xtbatch');

comment on table xtbatch.batch is 'Core table for email profiles';
comment on column xtbatch.batch.batch_id is 'Internal ID of this Batch Manager job.';
comment on column xtbatch.batch.batch_action is 'The value describes the task this job is to perform. Values include but are not limited to RunReport, Email, UpdateOUTLevel, and UpdateReorderLevel. An exhaustive list is in the Batch Manager''s process.cpp.';
comment on column xtbatch.batch.batch_parameter is 'A single parameter that further defines the task to perform. In the case of RunReport, this is the name of the report to run and is also used to generate a default subject line. For Email, it is used to generate a default subject line.';
comment on column xtbatch.batch.batch_user is 'The username of the person who submitted the job.';
comment on column xtbatch.batch.batch_email is 'The email address of the recipient.';
comment on column xtbatch.batch.batch_submitted is 'The date and time the job was submitted to the Batch Manager.';
comment on column xtbatch.batch.batch_scheduled is 'The date and time the job is supposed to be run by the Batch Manager.';
comment on column xtbatch.batch.batch_started is 'The date and time the job was actually started.';
comment on column xtbatch.batch.batch_completed is 'The date and time the job actually finished processing.';
comment on column xtbatch.batch.batch_responsebody is 'The text to accompany whatever report or other EDI file is generated if this job results in an email message.';
comment on column xtbatch.batch.batch_subject is 'The subject line to accompany whatever report or other EDI file is generated if this job results in an email message.';
comment on column xtbatch.batch.batch_filename is 'The name of the file in which to store the generated report or other EDI data.';
comment on column xtbatch.batch.batch_exitstatus is 'A text description of any failure that occurred during processing, or blank if the job completed successfully.';
comment on column xtbatch.batch.batch_fromemail is 'The email address of the sender. This defaults to the email address in the DefaultBatchFromEmailAddress metric.';
comment on column xtbatch.batch.batch_reschedinterval is 'NO LONGER USED; see batch_recurring_batch_id and the recur table instead.';
comment on column xtbatch.batch.batch_cc is 'The email address to which a copy of this message should be sent.';
comment on column xtbatch.batch.batch_emailhtml is 'A flag indicating whether email messages should be sent as plain text or as HTML.';
comment on column xtbatch.batch.batch_replyto is 'The email address to which replies will be directed if the recipient replies to an email message.';
comment on column xtbatch.batch.batch_bcc is 'The email address to which this email message will be sent silently (nobody but the bcc recipient will know).';
comment on column xtbatch.batch.batch_recurring_batch_id is 'The first batch record in the series if this is a recurring Batch Manager job. If the batch_recurring_batch_id is the same as the batch_id, this record is the first in the series.';

