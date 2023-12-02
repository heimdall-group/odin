import News from '~/server/models/news';

export default defineEventHandler(async (event): Promise<Server_Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }

    const token = event.context.params.token;
    const { data, success, error } = await getPermissionsObject(token)
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
      author: user.uid,
      body: body,
      cover: cover,
      date: new Date().getTime(),
      internal: permissions['internal-news'].write ? internal : false,
      external: permissions['public-news'].write ? external : false,
    })
    document.save()

    return await removeRequestKeys({
      data: true,
      success: true,
      type: 'Standard',
    }, event);
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error,
    });
  }
});
