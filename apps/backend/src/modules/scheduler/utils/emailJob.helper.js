import { sendEmail } from "../../../shared/services/email.service.js";

const sendEmailJob = async ({
  to,
  subject,
  html,
  successMessage,
  failureMessage,
}) => {
  try {
    await sendEmail({
      to,
      subject,
      html,
    });

    console.log(successMessage);
  } catch (error) {
    console.error(
      failureMessage,
      error.message
    );
  }
};

export { sendEmailJob };