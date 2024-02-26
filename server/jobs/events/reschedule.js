import Events from '~/server/models/events';
import moment from 'moment';

const removeAssignees = (assignees) => {
  assignees.forEach((group) => {
    group.roles.forEach((role) => {
      role.uid = "";
    })
  })
  return assignees;
}

const reschedule = async (date, event) => {
  const newEvent = new Events({
    status: 'planned',
    assignees: removeAssignees(event.assignees),
    author: event.author,
    date: date.toDate(),
    desc: event.desc,
    external: event.external,
    interested: [],
    max_assignes: event.max_assignes,
    recurring: event.recurring,
    title: event.title,
    type: event.type,
  });
  event.status = 'rescheduled';
  await event.save();
  await newEvent.save();
}

export default async () => {
  const documents = await Events.find({
    date: { $lte: new Date() },
    status: { $ne: ['rescheduled', 'active'] }
  })

  for (let i = 0; i < documents.length; i++) {
    const event = documents[i];
    const { recurring } = event;
    const date = moment(event.date);
    switch (recurring) {
      case "none":
        event.status = 'rescheduled';
        await event.save();
        break
      case "weekly":
        await reschedule(date.add('1', 'week'), event);
        break;
      case "every-other-week":
        await reschedule(date.add('2', 'week'), event);
        break;
      case "monthly-first-current-day":
        const day = date.day();
        date.add('1', 'month');
        date.startOf('month');
        if (day < date.day()) {
          date.add('1', 'week')
        }
        date.day(day)
        await reschedule(date, event);
        break;
      case "annually":
        await reschedule(date.add('1', 'year'), event);
        break;
      case "weekdays":
        if (date.day() >= 5 && date.day() !== 7) {
          date.startOf('week');
          date.add('1', 'week');
        }
        date.add('1', 'day');
        await reschedule(date, event);
        break;
    }
  }

  console.log(`Events-Rechedule: Found ${documents.length}`);
}
