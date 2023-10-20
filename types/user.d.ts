import { User as FirebaseUser } from "firebase/auth";

declare global {
  interface Permission {
    read: boolean,
    write: boolean
  }

  interface Auth_User extends FirebaseUser {
    member?: boolean,
    super_admin?: boolean,
    nickname?: string,
    joined_at?: string,
    pending?: boolean,
    roles: Array<string>,
    permissions: {[key: string]: Permission;},
  }
}

export {}
