import { getAuth } from 'firebase-admin/auth';
import Users from "../models/users";
import Keys from "../models/keys";

export default async (token: string):Promise<PermissionsObject> => {
  try {
    if (token === undefined) {
      throw 'Missing Token'
    }
    if(token === '') {
      return {
        data: {
          user: '',
          member: false,
          super_admin: false,
          permissions: {},
          external: true,
        },
        success: true,
      }
    }

    const result = await getFirebasePermissionsObject(token);
    if (result.success) {
      return result;
    } else {
      return await getAccessPermissionsObject(token);
    }
  } catch(error: any) {
    return {
      success: false,
      error: error,
    }
  }
}

export const getFirebasePermissionsObject = async (token: string):Promise<PermissionsObject> => {
  try {
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
    if (document.length > 1) {
      throw 'More then one user found'
    }

    const roles:Array<Role> = document[0].roles
    const permissions = mergeRolePermissions(roles);
    return {
      data: {
        user: result.uid,
        member: document[0].member,
        super_admin: document[0].super_admin,
        permissions: permissions,
      },
      success: true,
    }
  } catch(error: any) {
    return {
      success: false,
      error: error,
    }
  }
}

export const getAccessPermissionsObject = async (token: string):Promise<PermissionsObject> => {
  try {
    const keyUser = await Keys.findOne({})

    // placeholder: 
    return {
      data: {
        user: '',
        member: false,
        super_admin: false,
        permissions: {},
        external: true,
      },
      success: true,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error,
    }
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