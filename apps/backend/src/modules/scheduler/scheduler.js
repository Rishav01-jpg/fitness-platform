import { env } from "../../config/env.js";

import {
  registerJob,
  startCronJobs,
} from "./services/cron.service.js";

import membershipReminderJob from "./jobs/membershipReminder.job.js";
import membershipExpiryJob from "./jobs/membershipExpiry.job.js";
import paymentReminderJob from "./jobs/paymentReminder.job.js";
import birthdayReminderJob from "./jobs/birthdayReminder.job.js";
import inactiveClientJob from "./jobs/inactiveClient.job.js";
import dailyReportJob from "./jobs/dailyReport.job.js";

const initializeScheduler = () => {
  const membershipReminderSchedule =
    env.NODE_ENV === "development"
      ? "*/1 * * * *"
      : "0 9 * * *";

  const membershipExpirySchedule =
    env.NODE_ENV === "development"
      ? "*/2 * * * *"
      : "5 0 * * *";

  const paymentReminderSchedule =
    env.NODE_ENV === "development"
      ? "*/3 * * * *"
      : "10 9 * * *";

      const birthdayReminderSchedule =
  env.NODE_ENV === "development"
    ? "*/4 * * * *"
    : "15 9 * * *";

   const inactiveClientSchedule =
  env.NODE_ENV === "development"
    ? "*/1 * * * *"
    : "20 9 * * *";

    const dailyReportSchedule =
  env.NODE_ENV === "development"
    ? "*/6 * * * *"
    : "0 20 * * *";

  registerJob(
    "Membership Reminder",
    membershipReminderSchedule,
    membershipReminderJob
  );

  registerJob(
    "Membership Expiry",
    membershipExpirySchedule,
    membershipExpiryJob
  );

  registerJob(
    "Payment Reminder",
    paymentReminderSchedule,
    paymentReminderJob
  );

  registerJob(
  "Birthday Reminder",
  birthdayReminderSchedule,
  birthdayReminderJob
);

registerJob(
  "Inactive Client Reminder",
  inactiveClientSchedule,
  inactiveClientJob
);

registerJob(
  "Daily Report",
  dailyReportSchedule,
  dailyReportJob
);

  startCronJobs();

  console.log(
    "✅ Scheduler initialized successfully."
  );
};

export default initializeScheduler;