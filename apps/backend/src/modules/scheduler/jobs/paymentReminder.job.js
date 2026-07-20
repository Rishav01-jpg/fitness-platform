import {
  findPaymentsDueBetween,
  updatePaymentReminder,
} from "../../payment/payment.repository.js";

import { sendEmail } from "../../../shared/services/email.service.js";

const paymentReminderJob = async () => {
  console.log(
    "[Scheduler] Checking payments due soon..."
  );

  // Today (00:00:00)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 3 days from today (23:59:59)
  const reminderDate = new Date(today);
  reminderDate.setDate(
    reminderDate.getDate() + 3
  );
  reminderDate.setHours(
    23,
    59,
    59,
    999
  );

  const payments =
    await findPaymentsDueBetween(
      today,
      reminderDate
    );

  if (!payments.length) {
    console.log(
      "[Scheduler] No payments due."
    );

    return;
  }

  for (const payment of payments) {
    try {
      // Client email check
      if (!payment.client?.email) {
        console.log(
          `Skipping ${payment.client?.firstName} - Email not found`
        );

        continue;
      }

      // Prevent duplicate reminder on same day
      if (payment.lastReminderSentAt) {
        const lastReminder = new Date(
          payment.lastReminderSentAt
        );

        const now = new Date();

        if (
          lastReminder.toDateString() ===
          now.toDateString()
        ) {
          console.log(
            `Reminder already sent today to ${payment.client.email}`
          );

          continue;
        }
      }

      await sendEmail({
        to: payment.client.email,

        subject: "Payment Reminder",

        html: `
          <h2>Hello ${payment.client.firstName},</h2>

          <p>This is a reminder that your payment is due.</p>

          <table border="1" cellpadding="8" cellspacing="0">
            <tr>
              <td><strong>Membership</strong></td>
              <td>${payment.membership?.name}</td>
            </tr>

            <tr>
              <td><strong>Total Amount</strong></td>
              <td>₹${payment.finalAmount}</td>
            </tr>

            <tr>
              <td><strong>Balance Amount</strong></td>
              <td>₹${payment.balanceAmount}</td>
            </tr>

            <tr>
              <td><strong>Due Date</strong></td>
              <td>${payment.dueDate.toDateString()}</td>
            </tr>
          </table>

          <br/>

          <p>Please complete your payment before the due date.</p>

          <br/>

          <p>Regards,</p>
          <p>Gym Management Team</p>
        `,
      });

      await updatePaymentReminder(
        payment._id
      );

      console.log(
        `Payment reminder sent to ${payment.client.email}`
      );
    } catch (error) {
      console.error(
        `Failed to send payment reminder to ${payment.client?.email}`,
        error.message
      );
    }
  }
};

export default paymentReminderJob;