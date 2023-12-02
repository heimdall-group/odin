declare global {
  interface Return {
    data?: any,
    success: boolean,
    error?: string,
  }

  interface Server_Return {
    data?: any,
    message?: string,
    stack?: string,
    statusCode?: number,
    statusMessage?: string,
    success?: boolean,
    type: 'Pagination' | 'Object' | 'Standard' | 'Array',
    url?: string,
  }

  interface Throw_Error {
    message: string,
    // section/error
    // example: auth/user_db-fetch-failed
    code: string,
    // 1: Sent to sentry + console.error and alert
    // 2: console.error and alert
    // 3: console.warning and alert
    // 4: console.warning
    severity: 1 | 2 | 3 | 4,
    type: 'client' | 'server',
    server_error?: any,
  }
}

export {}