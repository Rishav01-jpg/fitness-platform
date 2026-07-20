import { findInactiveClients } from "../../attendance/attendance.repository.js";
import { findTenantAdmins } from "../../user/user.repository.js";

import { sendEmailJob } from "../utils/emailJob.helper.js";

const inactiveClientJob = async () => {
  console.log(
    "[Scheduler] Checking inactive clients..."
  );

  try {
    const inactiveClients =
      await findInactiveClients(30);

    if (!inactiveClients.length) {
      console.log(
        "[Scheduler] No inactive clients."
      );

      return;
    }

    // Group inactive clients by tenant
    const tenantMap = new Map();

    for (const client of inactiveClients) {
      const tenantId =
        client.tenant.toString();

      if (!tenantMap.has(tenantId)) {
        tenantMap.set(tenantId, []);
      }

      tenantMap.get(tenantId).push(client);
    }

    // Send one report per tenant
    for (const [
      tenantId,
      clients,
    ] of tenantMap.entries()) {
      const admins =
        await findTenantAdmins(tenantId);

      if (!admins.length) {
        console.log(
          `[Scheduler] No admin found for tenant ${tenantId}`
        );

        continue;
      }

      const rows = clients
        .map(
          (client, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>
                ${client.client.firstName}
                ${client.client.lastName || ""}
              </td>
              <td>${client.client.phone}</td>
              <td>
                ${new Date(
                  client.lastAttendance
                ).toDateString()}
              </td>
            </tr>
          `
        )
        .join("");

      const html = `
        <h2>Inactive Client Report</h2>

        <p>
          The following clients have not
          visited the gym in the last
          <strong>30 days</strong>.
        </p>

        <table
          border="1"
          cellpadding="8"
          cellspacing="0"
          style="border-collapse: collapse;"
        >
          <tr>
            <th>#</th>
            <th>Client</th>
            <th>Phone</th>
            <th>Last Attendance</th>
          </tr>

          ${rows}
        </table>

        <br/>

        <strong>
          Total Inactive Clients :
          ${clients.length}
        </strong>

        <br/><br/>

        Regards,<br/>
        Fitness SaaS
      `;

      for (const admin of admins) {
        if (!admin.email) {
  console.log(
    `[Scheduler] Admin ${admin._id} has no email. Skipping.`
  );

  continue;
}

        await sendEmailJob({
          to: admin.email,

          subject:
            "Inactive Client Report",

          html,

          successMessage: `Inactive client report sent to ${admin.email}`,

          failureMessage: `Failed to send inactive client report to ${admin.email}`,
        });
      }
    }
  } catch (error) {
    console.error(
      "[Scheduler] Inactive Client Job Failed:",
      error.message
    );
  }
};

export default inactiveClientJob;