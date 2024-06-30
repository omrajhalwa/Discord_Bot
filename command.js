import { REST, Routes } from 'discord.js';
import dotenv from "dotenv"


dotenv.config({
    path:"./.env"
})
const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },{
    name:'lcupcome',
    description:'Leetcode upcoming contest'
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(process.env.ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}