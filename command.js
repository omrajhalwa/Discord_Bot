import { REST, Routes } from 'discord.js';

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },{
    name:'lcupcome',
    description:'Leetcode upcoming contest'
  }
];

const rest = new REST({ version: '10' }).setToken("MTI1NjY0NTYzMzg3MjIzMjQ1OQ.G9TnRc.aqH1V_THg_SAVvV3EDgdTH7Me3c819IsvwZVHc");

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands("1256645633872232459"), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}