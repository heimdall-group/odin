declare global {
  interface Role {
    name:	string,
    id: string,
    permissions: {[key:string]: {read: boolean, write: boolean, name?: string}},
    color:	number,
    hoist:	boolean,
    unicode_emoji:	string,
    position:	number,
    flags: string,
    active: boolean,
  }
}

export {}