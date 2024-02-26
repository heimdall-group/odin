import Events from '~/server/models/events';
import mongoose from 'mongoose'
import { REST } from 'discord.js';

export default defineEventHandler(async (event): Promise<Server_Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }
    const token = event.context.params.token;
    const { id } = await readBody(event);


    const { data, success, error } = await getPermissionsObject(token ? token : '');
    if (!success || !data) {
      throw 'Failed to get permissions'
    }
    const { user, permissions, member, super_admin } = data;

    if ((permissions['event'] === undefined || !permissions['event'].write) && !super_admin) {
      throw 'Permission denied'
    }

    const document = await Events.findOne({ _id: id })
    if (!document) {
      throw 'Couldnt find event'
    }

    const { DISCORD_BOT_TOKEN, DISCORD_SERVER_ID } = useRuntimeConfig();
    const { BASE_URL } = useRuntimeConfig().public;
    const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);

    // rest.delete(`/guilds/${DISCORD_SERVER_ID}/scheduled-events/${document.guild_scheduled_event_id}`)
    rest.delete(`/guilds/1141789491766513694/scheduled-events/${document.guild_scheduled_event_id}`)
    document.deleteOne();
    document.save();

    return removeRequestKeys({
      data: true,
      type: 'Standard',
      success: true,
    }, event);
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error,
    });
  }
});
