import { getAuth } from 'firebase-admin/auth';
import Users from "../models/users"

export default async (token: string):Promise<Return> => {
  try {
    if (token === undefined) {
      throw 'Missing Token'
    }

    const result = await getAuth().verifyIdToken(token);
    const document = await Users.aggregate([
      {
        $match: {uid: result.uid},
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'id',
          foreignField: 'roles',
          as: 'roles',
        }
      },
      {
        $project: {
          user: 1,
          super_admin: '$super_admin',
          member: '$member',
          pending: '$pending',
          roles: '$roles'
        }
      }
    ])
    if (document.length === 0) {
      throw 'User not found'
    }

    const roles:Array<Role> = document[0].roles
    const permissions = mergeRolePermissions(roles);

    return {
      data: {
        user: result,
        member: document[0].member,
        super_admin: document[0].super_admin,
        permissions: permissions,
      },
      success: true,
    }
  } catch(error: any) {
    console.error(error)
    throw 'Couldnt get Permissions Object'
  }
}

export const mergeRolePermissions = (roles: Array<Role>) => {
  const permissions: Role["permissions"] = {}
  const roles_sorted = roles.sort((a: Role, b: Role) => a.position - b.position)
  roles_sorted.forEach((role: Role) => {
    for (const key in role.permissions) {
      const element = role.permissions[key]
      if (!JSON.stringify(element).includes('true') || !element.read) {
        continue
      }
      if (permissions[key] === undefined) {
        permissions[key] = {} as {write: boolean, read: boolean};
      } else if (permissions[key].read && permissions[key].write) {
        continue 
      }
      if (element.read && !permissions[key].read) {
        permissions[key].read = true
      } else {
        continue
      }

      if (element.write && !permissions[key].write) {
        permissions[key].write = element.write
      }
    }
  });
  return permissions 
}