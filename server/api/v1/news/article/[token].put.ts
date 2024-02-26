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

    const { id, title, body, cover, internal, external } = await readBody(event);
    if (id === undefined) {
      throw 'Missing id'
    }
    
    const document = await News.findOneAndUpdate(
      {
        _id: id,
      },
      {
        title: title,
        author: user,
        body: body,
        cover: cover,
        date: new Date().getTime(),
        internal: super_admin ? internal : permissions['internal-news'].write ? internal : false,
        external: super_admin ? external : permissions['public-news'].write ? external : false,
        summary: body === undefined ? undefined : createNewsSummary(body),
      }
    );

    if (!document) {
      throw 'Couldnt find article'
    }

    const { DISCORD_BOT_TOKEN, DISCORD_NEWS_CHANNEL_ID } = useRuntimeConfig();
    const { BASE_URL } = useRuntimeConfig().public;
    const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);
    
    const mentions = document.mentions.map((mention) => `<@${mention}>`)
    const url = document.internal && !document.external ? `${BASE_URL}/app/news/internal/${document.id}` : 
    document.external ? `${BASE_URL}/information/news/${document.id}` : '';

    const content = `# ${document.title} \n` +
      document.summary !== '' ? `${document.summary}... \n\n` : '' +
      `Läs hela inlägget här: ${url} \n` +
      `${mentions}\n` +
      `Av: <@${document.author}>`;
    const imageResult: any = await rest.patch(`/channels/${DISCORD_NEWS_CHANNEL_ID}/messages/${document.message_ids?.cover}`, {body: {content: `${document.cover} \n`}})
    const bodyResult: any = await rest.patch(`/channels/${DISCORD_NEWS_CHANNEL_ID}/messages/${document.message_ids?.body}`, {body: {content}});
    document.message_ids = {
      cover: imageResult.id,
      body: bodyResult.id
    };
    document.save();

    return await removeRequestKeys({
      data: true,
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
