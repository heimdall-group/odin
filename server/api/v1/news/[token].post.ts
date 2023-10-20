import News from '~/server/models/news';

export default defineEventHandler(async (event): Promise<Server_Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }

    const token = event.context.params.token;
    const { data, success, error } = await getPermissionsObject(token)
    const { permissions, user } = data;

    if (permissions['internal-news'] === undefined || !permissions['internal-news'].write) {
      throw 'Permission denied'
    }

    const { title, body, internal, external } = await readBody(event);
    if (title === undefined) {
      throw 'Missing title'
    }
    if (body === undefined) {
      throw 'Missing body'
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
      date: new Date().getTime(),
      internal: internal,
      external: external,
    })
    document.save()

    return {
      data: true,
      success: true,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error,
    });
  }
});
