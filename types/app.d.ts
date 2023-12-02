declare global {
  interface News {
    author: {
      nickname: string,
      roles: Array<string>,
    },
    body: string,
    cover: string,
    date: date,
    external: boolean,
    id: string,
    internal: boolean,
    title: string,
  }
}
export {}
