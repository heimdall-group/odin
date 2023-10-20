declare global {
  interface Return {
    data?: any,
    success: boolean,
    message?: string,
    error?: string,
    error_code?: string,
  }

  interface Server_Return {
    statusCode?: number,
    fatal?: boolean,
    unhandled?: boolean,
    statusMessage?: string,
    data?: any,
    success: boolean,
    cause?: unknown,
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