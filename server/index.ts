import mongoose from "mongoose";
import { initializeApp, cert } from "firebase-admin/app";
import { CacheType, ChatInputCommandInteraction, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { Client, GatewayIntentBits, Events } from 'discord.js';

import commands from '~/discord-commands'

export default async () => {
  try {
    if (!process.argv.includes('generate')) {
      initializeApp({
        credential: cert('./cert.json'),
      });
      const config = useRuntimeConfig();
      await mongoose.connect(config.MONGO_URL);
      console.log("DB connection true");

      const { DISCORD_BOT_TOKEN, DISCORD_CLIENT_PUBLIC_KEY } = useRuntimeConfig();
    
      const client = new Client({ intents: [GatewayIntentBits.Guilds] });
      const commandHandler = (interaction: ChatInputCommandInteraction<CacheType>) => {
        for (let i = 0; i < commands.length; i++) {
          const {name, handler} = commands[i];
          if (interaction.commandName === name) {
            handler(interaction);
          }
        }
      }

      const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);
      try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(DISCORD_CLIENT_PUBLIC_KEY), { body: commands.map((command: AppCommand) => command.command) });
        console.log('Successfully reloaded application (/) commands.');

        // console.log(await rest.get(`/guilds/1141789491766513694`))

        client.destroy();
        client.on('ready', async () => {
          console.log(`Logged in as ${client.user.tag}!`);


          client.on('interactionCreate', commandHandler);
        });
        
      
        await client.login(DISCORD_BOT_TOKEN);
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error("DB connection false", error);
  }
};
