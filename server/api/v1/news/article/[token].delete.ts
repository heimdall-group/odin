import { REST } from 'discord.js';
import News from '~/server/models/news';

export default defineEventHandler(async (event): Promise<Server_Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }

    const token = event.context.params.token;
    const { data, success, error } = await getPermissionsObject(token)
    if (!success || !data) {
      throw 'Failed to get permissions'
    }
    const { permissions, user, super_admin } = data;

    if (
      ((permissions['internal-news'] === undefined || permissions['public-news'] === undefined) || 
      !(permissions['internal-news'].write || permissions['public-news'].write)) &&
      !super_admin
    ) {
      throw 'Permission denied'
    }

    const { id } = await readBody(event);
    if (id === undefined) {
      throw 'Missing id'
    }

    const document = await News.findOne({ _id: id })
    if (!document) {
      throw 'Couldnt find article'
    }

    try {
      const { DISCORD_BOT_TOKEN, DISCORD_SERVER_ID, DISCORD_NEWS_CHANNEL_ID } = useRuntimeConfig();
      const { BASE_URL } = useRuntimeConfig().public;
      const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);
      if (!document.message_ids || !document.message_ids.cover || !document.message_ids.body) {
        throw 'Missing message ids'
      }
      await rest.delete(`/channels/${DISCORD_NEWS_CHANNEL_ID}/messages/${document.message_ids.cover}`)
      await rest.delete(`/channels/${DISCORD_NEWS_CHANNEL_ID}/messages/${document.message_ids.body}`)
    } catch(error) {
      console.error(error);
    }
    document.deleteOne();
    document.save();

    return await removeRequestKeys({
      data: document,
      success: true,
      type: 'Standard',
    }, event);
  } catch (error: any) {
    console.log(error)
    throw createError({
      statusCode: 400,
      statusMessage: error,
    });
  }
});
