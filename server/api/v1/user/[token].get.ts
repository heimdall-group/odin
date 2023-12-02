import { getAuth } from 'firebase-admin/auth';
import Users from '~/server/models/users';

export default defineEventHandler(async (event): Promise<Server_Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }

    const token = event.context.params.token;
    
    const result = await getAuth().verifyIdToken(token);
    const document = await Users.aggregate([
      {
        $match: {
          uid: result.uid
        }
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'roles',
          foreignField: 'id',
          as: 'roles'
        }
      },
      {
        $project: {
          member: '$member',
          super_admin: '$super_admin',
          nickname: '$nickname',
          joined_at: '$joined_at',
          pending: '$pending',
          roles: '$roles',
        }
      }
    ]);

    if (document.length === 0) {
      throw 'Couldnt find associated user'
    }

    if (document.length > 1) {
      throw 'Somehow more then 1 user was found'
    }

    const { member, super_admin, nickname, joined_at, pending, roles } = document[0]
    const permissions = mergeRolePermissions(roles);
    const names: Array<string> = roles.map((role: Role) => role.name)

    return {
      data: { member, super_admin, nickname, joined_at, pending, roles: names, permissions },
      success: true,
      type: 'Standard',
    }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error,
    });
  }
});
