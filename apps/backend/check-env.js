import dotenv from "dotenv";

const result = dotenv.config();

console.log(result);

console.log("RESEND_API_KEY =", process.env.RESEND_API_KEY);
console.log("EMAIL_FROM =", process.env.EMAIL_FROM);