declare global {
  interface AppCommand {
    command: SlashCommandBuilder,
    name: String,
    handler: Function
  }

  interface OAuth2_Result {
    token_type: string;
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
  }

  interface User {
    id: string,
    username:	string,
    discriminator:	string,
    global_name:	string,
    avatar:	string,
    bot?:	boolean,
    system?:	boolean,
    mfa_enabled?:	boolean,
    banner?:	string,
    accent_color?:	number,
    locale?:	string,
    verified?:	boolean,
    email?:	string,
    flags?:	number,
    premium_type?:	number,
    public_flags?:	number,
    avatar_decoration:	string,
  }

  interface Partial_Guild {
    id: string,
    name: string,
    icon: string,
    owner: boolean,
    permissions: string,
    features: Array<string>,
    approximate_member_count: number,
    approximate_presence_count: number,
  }

  interface Guild_Member {
    user?:	User,
    nick?:	string,
    avatar?:	string,
    roles:	Array<string>,
    joined_at:	number,
    premium_since?:	number,
    deaf:	boolean,
    mute:	boolean,
    flags:	number,
    pending?:	boolean,
    permissions?:	string,
    communication_disabled_until?: number,
  }
}

export {}