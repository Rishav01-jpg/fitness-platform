import dotenv from "dotenv";

dotenv.config();

const { sendEmail } = await import("./shared/services/email.service.js");

try {
  const response = await sendEmail({
    to: "kalart496@gmail.com",
    subject: "Gym CRM - Resend Test",
    html: `
      <h1>Resend is working 🎉</h1>
      <p>This is a test email from Gym CRM.</p>
    `,
  });

  console.log("SUCCESS");
  console.log(response);
} catch (error) {
  console.error("FAILED");
  console.error(error);
}