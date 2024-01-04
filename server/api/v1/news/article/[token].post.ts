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

    const { title, body, cover, internal, external } = await readBody(event);
    if (title === undefined) {
      throw 'Missing title'
    }
    if (body === undefined) {
      throw 'Missing body'
    }
    if (cover === undefined) {
      throw 'Missing cover'
    }
    if (internal === undefined) {
      throw 'Missing internal'
    }
    if (external === undefined) {
      throw 'Missing external'
    }
    
    

    const document = new News({
      title: title,
      author: user,
      body: body,
      cover: cover,
      date: new Date().getTime(),
      internal: super_admin ? internal : permissions['internal-news'].write ? internal : false,
      external: super_admin ? external : permissions['public-news'].write ? external : false,
      summary: createNewsSummary(body),
    })
    document.save()

    return await removeRequestKeys({
      data: document._id,
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
