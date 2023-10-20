declare global {
  interface News {
    title: string,
    author: {
      nickname: string,
      roles: Array<string>,
    },
    body: string,
    date: date,
    internal: boolean,
    external: boolean,
  }
}
export {}