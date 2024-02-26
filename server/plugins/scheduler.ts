import { useScheduler } from "#scheduler"
import eventsReschedule from '~/server/jobs/events/reschedule'
import eventsRemove from '~/server/jobs/events/remove'

const jobs = [
  {
    name: 'events-reschedule',
    job: eventsReschedule,
    cron: '0,15,30,45 * * * *',
  },
  {
    name: 'events-remove',
    job: eventsRemove,
    cron: '0 0 * * *',
  },
]

export default defineNitroPlugin(async () => {
  const scheduler = useScheduler();

  for (let i = 0; i < jobs.length; i++) {
    const { job, cron } = jobs[i];
    job()
    scheduler.run(job).cron(cron)
  }
})
