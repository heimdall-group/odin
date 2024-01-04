

export const usePagination = async ({
  cache,
  url,
  body,
  headers,
  remove
}: usePaginationParameters,
  result_target: globalThis.Ref<any[]>
):Promise<usePaginationReturn> => {
  try {
    if (cache.completed || cache.empty || cache.fetching) {
      return {
        data: false,
        success: false,
      }
    }

    if (cache.skip === undefined) {
      cache.skip = 0;
    }
    if (cache.completed === undefined) {
      cache.completed = false;
    }
    if (cache.max_count === undefined) {
      cache.max_count = 0;
    }
    if (cache.empty === undefined) {
      cache.empty = false;
    }
    if (cache.fetching === undefined) {
      cache.fetching = false;
    }

    cache.fetching = true;
    const result:PaginationReturn = await useInternalFetch(url, {
      method: 'POST',
      body: {
        skip: cache.skip,
        limit: cache.limit,
        ...body,
      },
      headers: headers,
    }, remove);
    cache.fetching = false;

    if (!result.success) {
      throw 'Couldnt get result from provided url or an server error accured';
    }
    if (result.data === undefined) {
      throw 'Missing result data';
    }
    if (result.data.skip === undefined) {
      throw 'Missing skip amount';
    }
    if (result.data.limit === undefined) {
      throw 'Missing limit amount';
    }
    if (result.data.collection_size === undefined) {
      throw 'Missing collection size';
    }
    if (result.data.result === undefined) {
      throw 'Missing result';
    }

    cache.skip = cache.skip + result.data.result.length;
    cache.max_count = result.data.collection_size;
    if (cache.skip >= cache.max_count) {
      cache.completed = true;
    }
    if (cache.skip === 0 && cache.completed) {
      cache.empty = true;
      return {
        data: result.data.result,
        success: true,
      }
    }

    result_target.value.push(...result.data.result)
    return {
      data: result.data.result,
      success: true,
    }
  } catch(error: any) {
    throw createError({
      statusMessage: error
    })
  }

}