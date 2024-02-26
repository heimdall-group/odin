import { ChatInputCommandInteraction, SlashCommandBuilder, type CacheType } from 'discord.js'
  
const { BASE_URL } = useRuntimeConfig().public;

export const createNews: AppCommand = {
  command: new SlashCommandBuilder()
    .setName('skapa-nyhet')
    .setDescription('Create a new article')
  ,
  name: 'skapa-nyhet',
  handler: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    await interaction.reply({ content: `Head over to our website to create an article. ${BASE_URL}/app/news/create`, ephemeral: true, });
  }
}
