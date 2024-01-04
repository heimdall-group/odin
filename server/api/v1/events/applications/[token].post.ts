import EventApplications from '~/server/models/event-application';

export default defineEventHandler(async (event): Promise<PaginationReturn> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }
    const token = event.context.params.token;
    const { limit, skip } = await readBody(event);
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

    const max_count = await EventApplications.find().count()
    const document = await EventApplications.aggregate([
      {
        $sort: {date: -1}
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'applicant',
          foreignField: 'uid',
          as: 'applicants'
        }
      },
      {
        $unwind: '$applicants'
      },
      {
        $project: {
          applicant: '$applicants.nickname',
          role: 1,
          group: 1,
          event: 1,
          type: 1,
          date: 1,
          id: '$_id'
        }
      },
      {
        $unset: '_id'
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
