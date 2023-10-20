import { getAuth } from 'firebase-admin/auth';
import Users from '~/server/models/users';

export default defineEventHandler(async (event): Promise<Server_Return> => {
  try {
    const { code } = await readBody(event);
    if (code === undefined || code === '') {
      throw 'Code is missing'
    }

    const {
      DISCORD_CLIENT_PUBLIC_KEY,
      DISCORD_CLIENT_SECRET_KEY,
      DISCORD_REDIRECT_URI,
      DISCORD_SERVER_ID,
      DISCORD_MEMBER_ROLE_ID,
    } = useRuntimeConfig();

    if (DISCORD_CLIENT_PUBLIC_KEY === undefined || DISCORD_CLIENT_PUBLIC_KEY === '') {
      throw 'DISCORD_CLIENT_PUBLIC_KEY is missing'
    }
    if (DISCORD_CLIENT_SECRET_KEY === undefined || DISCORD_CLIENT_SECRET_KEY === '') {
      throw 'Missing DISCORD_CLIENT_SECRET_KEY is missing'
    }
    if (DISCORD_REDIRECT_URI === undefined || DISCORD_REDIRECT_URI === '') {
      throw 'Missing DISCORD_REDIRECT_URI is missing'
    }
    if (DISCORD_SERVER_ID === undefined || DISCORD_SERVER_ID === '') {
      throw 'Missing DISCORD_SERVER_ID is missing'
    }
    if (DISCORD_MEMBER_ROLE_ID === undefined || DISCORD_MEMBER_ROLE_ID === '') {
      throw 'Missing DISCORD_MEMBER_ROLE_ID is missing'
    }

    const params = new URLSearchParams({
      'client_id': DISCORD_CLIENT_PUBLIC_KEY,
      'client_secret': DISCORD_CLIENT_SECRET_KEY,
      'grant_type': 'authorization_code',
      'code': code,
      'redirect_uri': DISCORD_REDIRECT_URI,
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'application/x-www-form-urlencoded'
    };
  
    const result:OAuth2_Result = await $fetch(`https://discord.com/api/oauth2/token`, {
      method: 'POST',
      body: params,
      headers,
    });
    if (result === undefined) {
      throw 'OAuth2 result missing'
    }
  
    const guildResult:Guild_Member = await $fetch(`https://discord.com/api/v10/users/@me/guilds/${DISCORD_SERVER_ID}/member`, {
      headers: {
        Authorization: `Bearer ${result.access_token}`,
        ...headers
      }
    });
    if (guildResult === undefined) {
      throw 'Guild member result missing'
    }
    if (guildResult.user === undefined) {
      throw 'Guild member user property missing'
    }

    const auth = getAuth();
    if (auth === null) {
      throw 'Auth return is null'
    }

    const customToken = await createCustomToken(auth, guildResult.user.id, result.expires_in);
    if (!customToken.success) {
      throw 'Creation of token failed'
    }

    const newUser = await Users.findOne({uid: guildResult.user.id}) ? false : true;
    if (newUser) {
      const userDocument = new Users({
        uid: guildResult.user.id,
        roles: guildResult.roles,
        pending: guildResult.pending,
        member: guildResult.roles.includes(DISCORD_MEMBER_ROLE_ID),
        nickname: guildResult.nick,
        joined_at: guildResult.joined_at,
        super_admin: false,
        avatar: guildResult.user.avatar,
      })
      userDocument.save();
    }

    return {
      data: {
        token: customToken.data,
      },
      success: true,
    };
  } catch (error: any) {
    // Handles Discord external errors
    if (error.name) {
      throw createError({
        statusCode: 400,
        statusMessage: error.name,
      });
    }
    throw createError({
      statusCode: 400,
      statusMessage: error,
    });
  }
});
