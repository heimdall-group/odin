import News from '~/server/models/news';
import mongoose from 'mongoose'

export default defineEventHandler(async (event): Promise<Server_Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }
    const id = event.context.params.id;
    const { token } = await readBody(event);

    const { data, success, error } = await getPermissionsObject(token, true);
    const { permissions, member, super_admin } = data;

    if ((permissions['internal-news'] === undefined || !permissions['internal-news'].read) && !super_admin) {
      throw 'Permission denied'
    }

    const document = await News.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        }
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
        }
      }
    ])

    if (document[0] && (document[0].internal && !permissions['internal-news'].read)) {
      throw 'Permission denied'
    }

    return removeRequestKeys({
      data: document[0],
      type: 'Object',
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
