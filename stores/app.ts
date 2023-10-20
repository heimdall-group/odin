export const useAppStore = defineStore('app', {
  state: () => {
    return {
      permissions: {} as Permissions
    };
  },
  getters: {
    getPermissions(): Permissions {
      return this.permissions
    }
  },
  actions: {

  },
});
