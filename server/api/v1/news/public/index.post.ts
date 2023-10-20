import News from '~/server/models/news';

export default defineEventHandler(async (event): Promise<PagnationReturn> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }

    const { limit, skip } = await readBody(event);
    if (limit === undefined) {
      throw 'Missing limit'
    }
    if (skip === undefined) {
      throw 'Missing skip'
    }

    const max_count = await News.find({external: true}).count()
    const document = await News.aggregate([
      {
        $match: {
          external: true,
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
          body: '$body',
          date: '$date',
          internal: '$internal',
          external: '$external',
        }
      }
    ])

    return {
      data: {
        limit: limit,
        skip: skip,
        collection_size: max_count,
        result: document,
      },
      success: true,
    };
  } catch (error: any) {
    console.log(error)
    throw createError({
      statusCode: 400,
      statusMessage: error,
    });
  }
});
