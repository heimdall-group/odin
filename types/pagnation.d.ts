declare global {
  interface PagnationReturn extends Server_Return {
    data?: {
      limit: number,
      skip: number,
      collection_size: number,
      result: Array<any>,
    }
  }

  interface usePagnationReturn {
    data?: Array<any> | boolean
    success: boolean,
  }

  interface usePagnationParameters {
    cache: usePagnationCache,
    url: string,
    body?: {[key: string]: any},
    headers?: {[key: string]: any},
  }
  
  interface usePagnationCache {
    skip?: number,
    limit: number,
    max_count?: number,
    completed?: boolean,
    empty?: boolean,
  }
}

export {}