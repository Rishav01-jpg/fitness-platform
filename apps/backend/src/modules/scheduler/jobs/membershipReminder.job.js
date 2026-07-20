import {
  findMembershipsExpiringBetween,
  updateMembershipReminder,
} from "../../membership/membership.repository.js";

import { sendEmailJob } from "../utils/emailJob.helper.js";
import { getDateRange } from "../utils/date.helper.js";

const membershipReminderJob = async () => {
  console.log(
    "[Scheduler] Checking memberships expiring soon..."
  );

 const {
  startDate,
  endDate,
} = getDateRange(3);

  const memberships =
    await findMembershipsExpiringBetween(
  startDate,
  endDate
);
  if (!memberships.length) {
    console.log(
      "[Scheduler] No memberships expiring."
    );

    return;
  }

  for (const membership of memberships) {
  try {
    if (!membership.client?.email) {
      console.log(
        `Skipping ${membership.client?.firstName} - Email not found`
      );

      continue;
    }

    // Skip if reminder was already sent today
    if (membership.lastReminderSentAt) {
      const today = new Date();

      const lastReminder = new Date(
        membership.lastReminderSentAt
      );

      if (
        lastReminder.toDateString() ===
        today.toDateString()
      ) {
        console.log(
          `Reminder already sent today to ${membership.client.email}`
        );

        continue;
      }
    }

   await sendEmailJob({
  to: membership.client.email,

  subject: "Membership Expiry Reminder",

  html: `
    <h2>Hello ${membership.client.firstName},</h2>

    <p>
      Your membership <strong>${membership.name}</strong>
      will expire on
      <strong>${membership.endDate.toDateString()}</strong>.
    </p>

    <p>
      Please renew your membership to continue enjoying our services.
    </p>

    <br/>

    <p>Regards,</p>
    <p>Gym Management Team</p>
  `,

  successMessage:
    `Reminder sent to ${membership.client.email}`,

  failureMessage:
    `Failed to send reminder to ${membership.client.email}`,
});

    // Update reminder timestamp
    await updateMembershipReminder(
      membership._id
    );

    console.log(
      `Reminder sent to ${membership.client.email}`
    );
  } catch (error) {
    console.error(
      `Failed to send reminder to ${membership.client?.email}`,
      error.message
    );
  }
}
};

export default membershipReminderJob;