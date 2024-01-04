import Events from '~/server/models/events';

export default defineEventHandler(async (event): Promise<Server_Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }
    const token = event.context.params.token;
    const { id } = await readBody(event);

    const { data, success, error } = await getPermissionsObject(token);
    if (!success || !data) {
      throw 'Failed to get permissions';
    }
    const { permissions, user, super_admin, external } = data;
    if ((permissions['event'] === undefined || !permissions['event'].read) && !super_admin && !external) {
      throw 'Permission denied';
    }

    const document = await Events.findOneAndUpdate({ _id: id }, {
      $push: { interested: user, }
    })
    document?.save();
    return removeRequestKeys({
      data: true,
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
