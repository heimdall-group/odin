import formidable from 'formidable';
import type { H3Event } from 'h3'

export const getFile = async (event: H3Event):Promise<Return> => {
  try {
    const body = await getBody(event);
    if (!body) {
      throw 'Missing Body'
    }

    return {
      success: true,
      data: body['file'],
    }
  } catch(error: any) {
    return {
      success: false,
      error: error,
    };
  } 
}

export const getBody = async (event: H3Event):Promise<{[key: string]: any | Array<any>}> => {
  const req = event.node.req
  const form = formidable();
  const [fields, files] = await form.parse(req);

  return {
    ...fields,
    ...files,
  }
}