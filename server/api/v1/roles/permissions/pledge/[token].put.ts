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

    const { name, read, write } = await readBody(event);
    if (name === undefined) {
      throw 'Missing name'
    }
    if (read === undefined) {
      throw 'Missing read value'
    }
    if (write === undefined) {
      throw 'Missing write value'
    }

    const permission: {[key:string]: {[key:string]: boolean}} = {};
    permission[`permissions.${name}`] = {
      read: read, write: write
    }

    const document = await Roles.updateMany({ $set: permission })

    return {
      data: true,
      success: true,
    };
  } catch (error: any) {
    console.error(error)
    throw createError({
      statusCode: 400,
      statusMessage: error,
    });
  }
});
