import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import dotenv from "dotenv"


dotenv.config({
  path: "./.env"
})
const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  }, {
    name: 'lcupcome',
    description: 'Leetcode upcoming contest'
  }, {
    name: 'potd',
    description: 'Leetcode problem of the day'
  },
  new SlashCommandBuilder()
    .setName('userstat')
    .setDescription('Users solved problem data')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('Enter LC user name')
        .setRequired(true)),

    new SlashCommandBuilder().
    setName('skillstat')
    .setDescription('Users solve problem according topic wise')
      .addStringOption(option =>
        option.setName('input').
        setDescription('Enter LC user name')
        .setRequired(true)),
    new SlashCommandBuilder().
        setName('recaccepted')
        .setDescription('User Recent Solved Problems')
          .addStringOption(option =>
            option.setName('input1').
            setDescription('Enter LC user name')
            .setRequired(true))
            .addStringOption(option =>
              option.setName('input2').
              setDescription('Enter No of recent solved problem you want')
              .setRequired(true))
            
            ,

            new SlashCommandBuilder().
            setName('conteststat')
            .setDescription('Recent Contest info')
              .addStringOption(option =>
                option.setName('input1').
                setDescription('Enter LC user name')
                .setRequired(true))
                .addStringOption(option =>
                  option.setName('input2').
                  setDescription('Enter No of recent contest stat you want')
                  .setRequired(true))
                
                ,  
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(process.env.ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}