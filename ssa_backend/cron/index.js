const { CronJob } = require('cron');
const { sendPendingOrdersReportToEmail } = require('./order_reports');

const jobs = () => {
  const pendingOrderReportEmailSendingJob = new CronJob(
    '0 19 * * *', // cronTime (Every day at 7:00 PM)
    sendPendingOrdersReportToEmail, // onTick
    null, // onComplete
    true // start
  );

  pendingOrderReportEmailSendingJob.start();
};

module.exports = jobs;
