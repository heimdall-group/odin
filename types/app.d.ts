import type { ObjectId } from "mongoose"

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
    summary: string,
    title: string,
  };

  interface AppEvent {
    active: boolean,
    assignees: Array<Object>,
    author: string,
    date: Date,
    desc: string,
    external: boolean,
    interested: Array,
    currentUserIsInterested: Boolean,
    max_assignees: number,
    recurring: 'none' | 'weekly' | 'every-other-week' | 'monthly-first-current-day' | 'annually' | 'weekdays',
    title: string,
    type: string,
  }

  interface AppEventApplication {
    applicant: String,
    role: String,
    group: String,
    event: String,
    type: String,
    date: Date,
    id: String,
  }

  interface AppEventCombat extends AppEvent {
    assignees: Array<AppEventCombatGroup>,
  }

  interface AppEventCombatGroup {
    name: string,
    type: 'air' | 'ground' | 'mechanised',
    // roles: {[key: string]: AppEventCombatRole},
    roles: Array<AppEventCombatRole>,
    order?: number,
    id?: moongose.Types.ObjectId,
  }

  interface AppEventCombatRole {
    application: boolean,
    name: string,
    user: {
      nickname: string,
      currentUser: boolean,
    } | boolean,
    order: number,
    id?: moongose.Types.ObjectId,
  }

  interface CreateAppEventCombatGroup extends AppEventCombatGroup {
    roles: Array<CreateAppEventCombatRole>,
    template?: string,
  }

  interface CreateAppEventCombatRole extends AppEventCombatRole {
    title?: string,
    value?: string,
    name?: string,
    application: boolean,
    template?: boolean,
    uid?: string,
    order?: number,
    user?: boolean,
  }
}
export {}


