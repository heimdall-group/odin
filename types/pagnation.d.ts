declare global {
  interface PaginationReturn extends Server_Return {
    data?: {
      limit: number,
      skip: number,
      collection_size: number,
      result: Array<any>,
    }
  }

  interface usePaginationReturn {
    data?: Array<any> | boolean
    success: boolean,
  }

  interface usePaginationParameters {
    cache: usePaginationCache,
    url: string,
    body?: {[key: string]: any},
    headers?: {[key: string]: any},
    excluded_keys?: Array<string>,
  }
  
  interface usePaginationCache {
    skip?: number,
    limit: number,
    max_count?: number,
    completed?: boolean,
    empty?: boolean,
  }
}

export {}