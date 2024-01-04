import Events from '~/server/models/events';
import mongoose from 'mongoose'

export default defineEventHandler(async (event): Promise<Server_Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }
    const token = event.context.params.token;
    const { assignees, date, desc, interested, recurring, max_assignes, external, title, type } = await readBody(event);
    if (date === undefined) {
      throw 'Missing date'
    }
    if (desc === undefined) {
      throw 'Missing desc'
    }
    if (recurring === undefined) {
      throw 'Missing recurring'
    }
    if (external === undefined) {
      throw 'Missing external'
    }
    if (title === undefined) {
      throw 'Missing title'
    }
    if (type === undefined) {
      throw 'Missing type'
    }


    const { data, success, error } = await getPermissionsObject(token ? token : '');
    if (!success || !data) {
      throw 'Failed to get permissions'
    }
    const { user, permissions, member, super_admin } = data;

    if ((permissions['event'] === undefined || !permissions['event'].write) && !super_admin) {
      throw 'Permission denied'
    }

    if (assignees) {
      assignees.forEach((group: AppEventCombatGroup) => {
        group.id = new mongoose.Types.ObjectId();
        group.roles.forEach(role => {
          role.id = new mongoose.Types.ObjectId();
        });
      });
    }

    const document = new Events({
      active: false,
      assignees: assignees ? assignees : [],
      author: user,
      date,
      desc,
      recurring,
      interested: interested ? interested : [],
      max_assignes: max_assignes ? max_assignes : 0,
      external,
      title,
      type
    })
    document.save();

    return removeRequestKeys({
      data: document._id,
      type: 'Standard',
      success: true,
    }, event);
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error,
    });
  }
});
