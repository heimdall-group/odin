import { getAuth } from 'firebase-admin/auth';
import Roles from '~/server/models/roles';

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
    const { super_admin } = data;

    if (!super_admin) {
      throw 'Permission denied'
    }

    const document = await Roles.aggregate([
      {
        $project: {
          name:	'$name',
          id: '$id',
          color:	'$color',
          hoist:	'$hoist',
          unicode_emoji:	'$unicode_emoji',
          permissions:	'$permissions',
          position:	'$position',
          flags: '$flags',
        }
      },
      {
        $sort: {'position': 1}
      }
    ]);

    return {
      data: document,
      success: true,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error,
    });
  }
});
