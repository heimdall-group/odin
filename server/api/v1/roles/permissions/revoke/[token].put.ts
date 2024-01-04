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

    const { name } = await readBody(event);
    if (name === undefined) {
      throw 'Missing name'
    }

    const permission: {[key:string]: string} = {};
    const document = await Roles.updateMany({ $unset: permission })

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
