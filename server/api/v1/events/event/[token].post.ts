import Events from '~/server/models/events';
import mongoose from 'mongoose'
import { REST } from 'discord.js';

export default defineEventHandler(async (event): Promise<Server_Return> => {
  try {
    if (event.context.params === undefined) {
      throw 'Missing parameters'
    }
    const token = event.context.params.token;
    const { assignees, date, desc, status, interested, recurring, max_assignes, external, title, type } = await readBody(event);
    if (date === undefined) {
      throw 'Missing date'
    }
    if (desc === undefined) {
      throw 'Missing desc'
    }
    if (recurring === undefined) {
      throw 'Missing recurring'
    }
    if (external === undefined) {
      throw 'Missing external'
    }
    if (title === undefined) {
      throw 'Missing title'
    }
    if (type === undefined) {
      throw 'Missing type'
    }


    const { data, success, error } = await getPermissionsObject(token ? token : '');
    if (!success || !data) {
      throw 'Failed to get permissions'
    }
    const { user, permissions, member, super_admin } = data;

    if ((permissions['event'] === undefined || !permissions['event'].write) && !super_admin) {
      throw 'Permission denied'
    }

    if (assignees) {
      assignees.forEach((group: AppEventCombatGroup) => {
        group.id = new mongoose.Types.ObjectId();
        group.roles.forEach(role => {
          role.id = new mongoose.Types.ObjectId();
        });
      });
    }

    const document = new Events({
      status: status ? status : 'planned',
      assignees: assignees ? assignees : [],
      author: user,
      date,
      desc,
      recurring,
      interested: interested ? interested : [],
      max_assignes: max_assignes ? max_assignes : 0,
      external,
      title,
      type
    });

    const { DISCORD_BOT_TOKEN, DISCORD_SERVER_ID, DISCORD_EVENTS_CHANNEL_ID } = useRuntimeConfig();
    const { BASE_URL } = useRuntimeConfig().public;
    const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);

    // const result:any = await rest.post(`/guilds/${DISCORD_SERVER_ID}/scheduled-events`, {
    const result:any = await rest.post(`/guilds/1141789491766513694/scheduled-events`, {
      body: {
        channel_id: DISCORD_EVENTS_CHANNEL_ID,
        name: document.title,
        description: document.desc,
        privacy_level: 2,
        entity_type: 2,
        scheduled_start_time: document.date,
      }
    });
    document.guild_scheduled_event_id = result.id
    document.save();

    return removeRequestKeys({
      data: document._id,
      type: 'Standard',
      success: true,
    }, event);
  } catch (error: any) {
    console.log(error)
    throw createError({
      statusCode: 400,
      statusMessage: error,
    });
  }
});
