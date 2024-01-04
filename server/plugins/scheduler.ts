import { useScheduler } from "#scheduler"
import eventsReschedule from '~/server/jobs/events/reschedule'

const jobs = [
  {
    name: 'events-reschedule',
    job: eventsReschedule,
    cron: '0,15,30,45 * * * *',
  },
]

export default defineNitroPlugin(async () => {
  const scheduler = useScheduler();

  for (let i = 0; i < jobs.length; i++) {
    const { job, cron } = jobs[i];
    scheduler.run(job).cron(cron)
  }
})
