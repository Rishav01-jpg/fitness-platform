import {
  countNewClientsToday,
} from "../../client/client.repository.js";

import {
  countNewMembershipsToday,
  countMembershipsExpiringSoon,
} from "../../membership/membership.repository.js";

import {
  getTodayRevenue,
  countPendingPayments,
} from "../../payment/payment.repository.js";

import {
  countTodayAttendance,
} from "../../attendance/attendance.repository.js";

import {
  findTenantAdmins,
} from "../../user/user.repository.js";

import Tenant from "../../tenant/tenant.model.js";

import { sendEmailJob } from "../utils/emailJob.helper.js";
import { TENANT_STATUS } from "../../../constants/tenantStatus.js";

const dailyReportJob = async () => {
  console.log(
    "[Scheduler] Generating Daily Reports..."
  );

  try {
    // Get all active tenants
    const tenants = await Tenant.find({
  status: TENANT_STATUS.ACTIVE,
});

    if (!tenants.length) {
      console.log(
        "[Scheduler] No active tenants found."
      );
      return;
    }

    for (const tenant of tenants) {
      const tenantId = tenant._id;

      // Collect today's statistics
      const [
        newClients,
        newMemberships,
        revenue,
        attendance,
        expiringMemberships,
        pendingPayments,
      ] = await Promise.all([
        countNewClientsToday(tenantId),

        countNewMembershipsToday(
          tenantId
        ),

        getTodayRevenue(tenantId),

        countTodayAttendance(
          tenantId
        ),

        countMembershipsExpiringSoon(
          tenantId
        ),

        countPendingPayments(
          tenantId
        ),
      ]);

      // Skip report if there is no activity
      const hasActivity =
        newClients > 0 ||
        newMemberships > 0 ||
        revenue > 0 ||
        attendance > 0 ||
        expiringMemberships > 0 ||
        pendingPayments > 0;

      if (!hasActivity) {
        console.log(
          `[Scheduler] No activity for ${tenant.name}. Skipping report.`
        );

        continue;
      }

      // Find tenant admins
      const admins =
        await findTenantAdmins(
          tenantId
        );

      if (!admins.length) {
        console.log(
          `[Scheduler] No admin found for tenant ${tenant.name}`
        );

        continue;
      }

      const html = `
        <h2>📊 Daily Gym Report</h2>

        <p>
          Hello <strong>${tenant.name}</strong>,
        </p>

        <p>
          Here is your business summary for today.
        </p>

        <table
          border="1"
          cellpadding="8"
          cellspacing="0"
          style="border-collapse: collapse;"
        >
          <tr>
            <td><strong>👥 New Clients</strong></td>
            <td>${newClients}</td>
          </tr>

          <tr>
            <td><strong>🏋️ New Memberships</strong></td>
            <td>${newMemberships}</td>
          </tr>

          <tr>
            <td><strong>💰 Today's Revenue</strong></td>
            <td>₹${revenue}</td>
          </tr>

          <tr>
            <td><strong>✅ Today's Attendance</strong></td>
            <td>${attendance}</td>
          </tr>

          <tr>
            <td><strong>⏳ Memberships Expiring Soon</strong></td>
            <td>${expiringMemberships}</td>
          </tr>

          <tr>
            <td><strong>💳 Pending Payments</strong></td>
            <td>${pendingPayments}</td>
          </tr>
        </table>

        <br/>

        <p>
          Regards,<br/>
          <strong>Fitness SaaS</strong>
        </p>
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
            "📊 Daily Gym Report",

          html,

          successMessage:
            `Daily report sent to ${admin.email}`,

          failureMessage:
            `Failed to send daily report to ${admin.email}`,
        });
      }
    }

    console.log(
      "[Scheduler] Daily reports completed."
    );
  } catch (error) {
    console.error(
      "[Scheduler] Daily Report Job Failed:",
      error.message
    );
  }
};

export default dailyReportJob;