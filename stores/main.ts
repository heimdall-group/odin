export const useStore = defineStore('main', {
  state: () => {
    return {
      user: {} as Auth_User,
      global_loading: true as boolean,
    };
  },
  getters: {
    getUser():Auth_User {
      return this.user;
    },
    getGlobalLoading():boolean {
      return this.global_loading
    },
  },
  actions: {
    setUser(user: Auth_User):void {
      this.user = user;
    },
    setGlobalLoading(loading:boolean):void {
      this.global_loading = loading;
    },
    addUserDocument(user: Auth_User):void {
      this.user = Object.assign(this.user, user)
    },
    getPermissions(key: string):Permission {
      if (this.user.super_admin) {
        return {
          read: true,
          write: true,
        }
      }
      if (Object.keys(this.user).length === 0) {
        return {
          read: false,
          write: false,
        }
      }
      const permission =  this.user.permissions[key];
      if (permission === undefined) {
        return {
          read: false,
          write: false,
        }
      }
      return permission
    },
  },
});
