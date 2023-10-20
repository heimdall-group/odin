export const useViewsStore = defineStore('views', {
  state: () => {
    return {
      state: '' as string,
      width: 0,
    }
  },
  getters: {
    getState():string {
      return this.state;
    },
    getWidth():number {
      return this.width;
    }
  },
  actions: {
    setState(width:number):void {
      this.width = width;
      if (width > 2560) {
        this.state = 'xxl';
        return
      } else if (width > 1920) {
        this.state = 'xl';
        return
      } else if (width > 1280) {
        this.state = 'lg';
        return
      } else if (width > 960) {
        this.state = 'md';
        return
      } else if (width > 600) {
        this.state = 'sm';
        return
      } else if (width < 600) {
        this.state = 'xs';
        return
      }
    },

  },
});
