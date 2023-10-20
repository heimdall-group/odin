declare global {
  interface Documentation {
    website_trigger: string, // Website action that invoces this
    bot_trigger: string, // Bot action that invoces this
    event: string, // What endpoint does when invoced
    endpoint: string, // Url to endpoint
    reponse_title: string,
    response: string, // What can be expected in response
    parameters_title: string,
    parameters: string, // Parameters needed
    version: number, // Api version
  }
}

export {}