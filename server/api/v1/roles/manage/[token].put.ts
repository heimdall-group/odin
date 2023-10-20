import Roles from '~/server/models/roles';

export default defineEventHandler(async (event): Promise<Server_Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }

    const token = event.context.params.token;
    const { data, success, error } = await getPermissionsObject(token)
    const { super_admin } = data;

    if (!super_admin) {
      throw 'Permission denied'
    }

    const { id, permissions } = await readBody(event);
    if (!id) {
      throw 'Missing id'
    }
    if (!permissions) {
      throw 'Missing permissions'
    }

    for (const key in permissions) {
      delete permissions[key].name
    }

    const document = await Roles.findOneAndUpdate({id: id}, {permissions: permissions})

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
