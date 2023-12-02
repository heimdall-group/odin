import type { H3Event } from 'h3'

export default async (ReturnObject: Server_Return, event:H3Event): Promise<Server_Return | PaginationReturn> => {
  if (event.method === 'GET' || ReturnObject.type === 'Standard') {
    return ReturnObject
  }

  const { remove } = await readBody(event)
  if (remove === undefined || remove.constructor !== Array) {
    return ReturnObject
  }

  const { data, type } = ReturnObject;
  const targets = []
  switch(type) {
    case 'Array':
      targets.push(...data);
    break;
    case 'Object':
      targets.push(...[data]);
    break;
    case 'Pagination':
      for (let i = 0; i < data.result.length; i++) {
        const target = data.result[i];
        targets.push(target);
      }
    break;
  }

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    for (let i = 0; i < remove.length; i++) {
      const key = remove[i];
      delete target[key]
    }
  }
  return ReturnObject;
}