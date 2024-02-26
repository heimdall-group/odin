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
  event = new Events(event);
  event.date = date.toDate();
  event.assignees = removeAssignees(event.assignees);
  event.interested = [];
  await event.save();
}

export default async () => {
  const date = moment().add('-1', 'day');
  const documents = await Events.find({
    date: { $lte: date.toDate() },
    status: 'rescheduled',
  })

  for (let i = 0; i < documents.length; i++) {
    const event = documents[i];
    event.deleteOne();
  }
  console.log(`Events-remove: Found ${documents.length}`);
}
