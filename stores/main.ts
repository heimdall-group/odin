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
      Object.assign(this.user, user);
    },
    getPermissions(key: string):Permission {
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