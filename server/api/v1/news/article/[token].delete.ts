import News from '~/server/models/news';

export default defineEventHandler(async (event): Promise<Server_Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }

    const token = event.context.params.token;
    const { data, success, error } = await getPermissionsObject(token)
    if (!success || !data) {
      throw 'Failed to get permissions'
    }
    const { permissions, user, super_admin } = data;

    if (
      ((permissions['internal-news'] === undefined || permissions['public-news'] === undefined) || 
      !(permissions['internal-news'].write || permissions['public-news'].write)) &&
      !super_admin
    ) {
      throw 'Permission denied'
    }

    const { id } = await readBody(event);
    if (id === undefined) {
      throw 'Missing id'
    }

    const document = await News.deleteOne({ _id: id })

    return await removeRequestKeys({
      data: document,
      success: true,
      type: 'Standard',
    }, event);
  } catch (error: any) {
    console.log(error)
    throw createError({
      statusCode: 400,
      statusMessage: error,
    });
  }
});
