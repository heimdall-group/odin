import News from '~/server/models/news';

export default defineEventHandler(async (event): Promise<PaginationReturn> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }

    const token = event.context.params.token;
    const { data, success, error } = await getPermissionsObject(token);
    if (!success || !data) {
      throw 'Failed to get permissions'
    }
    const { permissions, super_admin } = data;

    if ((permissions['internal-news'] === undefined || !permissions['internal-news'].read) && !super_admin) {
      throw 'Permission denied'
    }

    const { limit, skip } = await readBody(event);
    if (limit === undefined) {
      throw 'Missing limit'
    }
    if (skip === undefined) {
      throw 'Missing skip'
    }

    const max_count = await News.find({internal: true}).count()
    const document = await News.aggregate([
      {
        $match: {
          internal: true,
        }
      },
      {
        $sort: {date: -1},
      },
      {
        $limit: skip + limit,
      },
      {
        $skip: skip,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: 'uid',
          as: 'users'
        }
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'users.roles',
          foreignField: 'id',
          as: 'roles'
        }
      },
      {
        $unwind: '$users',
      },
      {
        $project: {
          id: '$_id',
          title: '$title',
          author: {
            nickname: '$users.nickname',
            roles: '$roles.name'
          },
          cover: '$cover',
          body: '$body',
          date: '$date',
          internal: '$internal',
          external: '$external',
          summary: '$summary',
        }
      }
    ])

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
