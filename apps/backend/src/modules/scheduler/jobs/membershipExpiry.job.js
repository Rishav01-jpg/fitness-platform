import {
  expireMemberships,
} from "../../membership/membership.repository.js";

const membershipExpiryJob = async () => {
  console.log(
    "[Scheduler] Checking expired memberships..."
  );

  try {
    const result =
      await expireMemberships();

    console.log(
      `[Scheduler] ${result.modifiedCount} membership(s) expired.`
    );
  } catch (error) {
    console.error(
      "[Scheduler] Membership expiry failed:",
      error.message
    );
  }
};

export default membershipExpiryJob;