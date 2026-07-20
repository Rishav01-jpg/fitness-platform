import cron from "node-cron";

const jobs = [];

export const registerJob = (name, schedule, task, options = {}) => {
  const job = cron.schedule(
    schedule,
    async () => {
      console.log(`[CRON] Running job: ${name}`);

      try {
        await task();
        console.log(`[CRON] Completed job: ${name}`);
      } catch (error) {
        console.error(
          `[CRON] Failed job: ${name}`,
          error.message
        );
      }
    },
    {
      scheduled: false,
      timezone: options.timezone || "Asia/Kolkata",
    }
  );

  jobs.push({
    name,
    job,
  });

  return job;
};

export const startCronJobs = () => {
  jobs.forEach(({ job, name }) => {
    job.start();
    console.log(`[CRON] Started: ${name}`);
  });
};

export const stopCronJobs = () => {
  jobs.forEach(({ job, name }) => {
    job.stop();
    console.log(`[CRON] Stopped: ${name}`);
  });
};

export const getRegisteredJobs = () => jobs;