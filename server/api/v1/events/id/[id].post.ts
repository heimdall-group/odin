import Events from '~/server/models/events';
import mongoose from 'mongoose'

export default defineEventHandler(async (event): Promise<Server_Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }
    const id = event.context.params.id;
    const { token } = await readBody(event);
    if (!token) {
      throw 'Missing token';
    }

    const { data, success, error } = await getPermissionsObject(token ? token : '');
    if (!success || !data) {
      throw 'Failed to get permissions';
    }
    const { permissions, user, super_admin, external } = data;

    if ((permissions['event'] === undefined || !permissions['event'].read) && !super_admin && !external) {
      throw 'Permission denied';
    }

    const document = await Events.aggregate(getEventsPipeline({_id: new mongoose.Types.ObjectId(id)}, user));
    if (document.length === 0) {
      throw 'Event not found';
    }
    if (document[0].assignees.length === 1 && document[0].assignees[0].roles.length === 1 && document[0].assignees[0].roles.order === undefined &&  document[0].assignees[0].roles.name === undefined) {
      document[0].assignees = [];
    } else {
      document[0].assignees = document[0].assignees.sort((a: {order: number}, b: {order: number}) => a.order - b.order);
    }

    return removeRequestKeys({
      data: document[0],
      type: 'Object',
      success: true,
    }, event);
  } catch (error: any) {
    console.log(error)
    throw createError({
      statusCode: 400,
      statusMessage: error,
    });
  }
});
