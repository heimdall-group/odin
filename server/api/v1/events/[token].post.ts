import Events from '~/server/models/events';

export default defineEventHandler(async (event): Promise<PaginationReturn> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }
    const token = event.context.params.token;
    const { start, end, limit, skip } = await readBody(event);
    if (start === undefined) {
      throw 'Missing start'
    }
    if (end === undefined) {
      throw 'Missing end'
    }
    if (limit === undefined) {
      throw 'Missing limit'
    }
    if (skip === undefined) {
      throw 'Missing skip'
    }

    const { data, success, error } = await getPermissionsObject(token);
    if (!success || !data) {
      throw 'Failed to get permissions';
    }
    const { permissions, user, super_admin, external } = data;

    if ((permissions['event'] === undefined || !permissions['event'].read) && !super_admin && !external) {
      throw 'Permission denied';
    }

    const max_count = await Events.find({date: { $gt: new Date(start), $lt: new Date(end) }}).count()
    const document = await Events.aggregate(getEventsPipeline({
      date: { $gt: new Date(start), $lt: new Date(end) },
    }, user, skip, limit));
    
    document.sort((a,b)=> new Date(a.date).getTime() - new Date(b.date).getTime()).reverse();
    document.forEach((item) => {
      item.assignees = item.assignees.sort((a: {order: number}, b: {order: number}) => a.order - b.order);
    });

    return removeRequestKeys({
      data: {
        limit: limit,
        skip: skip,
        collection_size: max_count,
        result: document,
      },
      type: 'Pagination',
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
