import { Message, REST } from 'discord.js';
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

    const { title, body, cover, internal, external, mentions } = await readBody(event);
    if (title === undefined) {
      throw 'Missing title'
    }
    if (body === undefined) {
      throw 'Missing body'
    }
    if (cover === undefined) {
      throw 'Missing cover'
    }
    if (internal === undefined) {
      throw 'Missing internal'
    }
    if (external === undefined) {
      throw 'Missing external'
    }

    console.log(mentions)
    const document = new News({
      title: title,
      author: user,
      body: body,
      cover: cover,
      date: new Date().getTime(),
      internal: super_admin ? internal : permissions['internal-news'].write ? internal : false,
      external: super_admin ? external : permissions['public-news'].write ? external : false,
      summary: createNewsSummary(body),
      mentions: mentions !== undefined ? mentions.split(' ') : [],
    })
    
    const { DISCORD_BOT_TOKEN, DISCORD_NEWS_CHANNEL_ID } = useRuntimeConfig();
    const { BASE_URL } = useRuntimeConfig().public;
    const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);
    
    const mentionsString = document.mentions.map((mention) => `<@${mention}>`)
    const url = document.internal && !document.external ? `${BASE_URL}/app/news/internal/${document.id}` : 
    document.external ? `${BASE_URL}/information/news/${document.id}` : '';

    const content = `# ${document.title} \n` +
      `${document.summary !== '' ? `${document.summary}... \n\n` : ''}` +
      `Läs hela inlägget här: ${url} \n` +
      `${mentionsString}\n` +
      `Av: <@${document.author}>`;
    const imageResult: any = await rest.post(`/channels/${DISCORD_NEWS_CHANNEL_ID}/messages`, {body: {content: `${document.cover} \n`}})
    const bodyResult: any = await rest.post(`/channels/${DISCORD_NEWS_CHANNEL_ID}/messages`, {body: {content}});
    document.message_ids = {
      cover: imageResult.id,
      body: bodyResult.id
    };
    document.save()
    
    return await removeRequestKeys({
      data: document._id,
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
