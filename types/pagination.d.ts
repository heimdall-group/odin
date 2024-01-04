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
    remove?: Array<string>,
  }
  
  interface usePaginationCache {
    completed?: boolean,
    empty?: boolean,
    fetching?: boolean,
    limit: number,
    max_count?: number,
    skip?: number,
  }
}

export {}