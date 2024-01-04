import mongoose from 'mongoose';
import Events from '~/server/models/events';

export default defineEventHandler(async (event): Promise<Server_Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }
    const token = event.context.params.token;
    const { id, group_id, role_id } = await readBody(event);

    const { data, success, error } = await getPermissionsObject(token);
    if (!success || !data) {
      throw 'Failed to get permissions';
    }
    const { permissions, user, super_admin, external } = data;
    if ((permissions['event'] === undefined || !permissions['event'].read) && !super_admin && !external) {
      throw 'Permission denied';
    }

    const removeUpdate = await Events.updateOne(
      { _id: id },
      {
        $set: {
          'assignees.$[a].roles.$[b].uid': "",
        },
      },
      {
        arrayFilters: [
          { 'a.id': new mongoose.Types.ObjectId(group_id) },
          { 'b.id': new mongoose.Types.ObjectId(role_id) },
        ],
      },
    );
    return removeRequestKeys({
      data: {
        remove: removeUpdate,
      },
      type: 'Standard',
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
