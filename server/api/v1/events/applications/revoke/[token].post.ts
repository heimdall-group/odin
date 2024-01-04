import Events from '~/server/models/events';
import EventApplications from '~/server/models/event-application';
import mongoose from 'mongoose';

export default defineEventHandler(async (h3Event): Promise<PaginationReturn> => {
  try {
    if (h3Event.context.params === undefined) {
      throw 'Missing parameters'
    }
    const token = h3Event.context.params.token;
    const { id } = await readBody(h3Event);
    if (id === undefined) {
      throw 'Missing id'
    }

    const { data, success, error } = await getPermissionsObject(token);
    if (!success || !data) {
      throw 'Failed to get permissions';
    }
    const { permissions, user, super_admin } = data;

    if ((permissions['event-application'] === undefined || !permissions['event-application'].write) && !super_admin) {
      throw 'Permission denied';
    }

    const application = await EventApplications.findOneAndDelete({ _id: id });

    return removeRequestKeys({
      data: true,
      type: 'Standard',
      success: true,
    }, h3Event);
  } catch (error: any) {
    console.log(error)
    throw createError({
      statusCode: 400,
      statusMessage: error,
    });
  }
});
