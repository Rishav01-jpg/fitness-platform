import {
  findClientsWithBirthdayToday,
  updateBirthdayWishSent,
} from "../../client/client.repository.js";

import { sendEmail } from "../../../shared/services/email.service.js";

const birthdayReminderJob = async () => {
  console.log(
    "[Scheduler] Checking today's birthdays..."
  );

  const clients =
    await findClientsWithBirthdayToday();

  if (!clients.length) {
    console.log(
      "[Scheduler] No birthdays today."
    );

    return;
  }

  for (const client of clients) {
    try {
      // Email check
      if (!client.email) {
        console.log(
          `Skipping ${client.firstName} - Email not found`
        );

        continue;
      }

      // Prevent duplicate birthday wish on same day
      if (client.lastBirthdayWishSentAt) {
        const lastWish = new Date(
          client.lastBirthdayWishSentAt
        );

        const today = new Date();

        if (
          lastWish.toDateString() ===
          today.toDateString()
        ) {
          console.log(
            `Birthday wish already sent to ${client.email}`
          );

          continue;
        }
      }

      await sendEmail({
        to: client.email,

        subject: "🎉 Happy Birthday!",

        html: `
          <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">

            <h1 style="color:#ff9800;">
              🎂 Happy Birthday ${client.firstName}!
            </h1>

            <p>
              Wishing you a fantastic birthday filled with happiness,
              good health, and success.
            </p>

            <p>
              Thank you for being a valued member of our gym family.
              We hope you have an amazing year ahead!
            </p>

            <br/>

            <h3>
              💪 Keep Training. Keep Growing.
            </h3>

            <br/>

            <p>
              Best Wishes,<br/>
              <strong>Gym Management Team</strong>
            </p>

          </div>
        `,
      });

      await updateBirthdayWishSent(
        client._id
      );

      console.log(
        `Birthday wish sent to ${client.email}`
      );
    } catch (error) {
      console.error(
        `Failed to send birthday wish to ${client.email}`,
        error.message
      );
    }
  }
};

export default birthdayReminderJob;