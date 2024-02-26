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
    status: 'planned' | 'active' | 'completed' | 'rescheduled',
    assignees: Array<Object>,
    author: string,
    date: Date,
    desc: string,
    external: boolean,
    interested: Array,
    currentUserIsInterested: boolean,
    max_assignees: number,
    recurring: 'none' | 'weekly' | 'every-other-week' | 'monthly-first-current-day' | 'annually' | 'weekdays',
    title: string,
    type: string,
    id: string,
  }

  interface AppEventApplication {
    applicant: string,
    role: {
      name: string,
      id: string,
    },
    group: {
      name: string,
      id: string,
    },
    event: {
      title: string,
      id: string,
    },
    type: string,
    date: Date,
    id: string,
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


