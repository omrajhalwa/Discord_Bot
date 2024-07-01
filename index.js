import { Client, GatewayIntentBits, time } from 'discord.js';
import axios from 'axios';
import dotenv from "dotenv"
import  cron from 'node-cron';

dotenv.config({
    path:"./.env"
})
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});



client.on('ready',async () => {
    console.log(`Logged in as ${client.user.tag}!`);
     
    let title=null;
    let date=null;

// Function to be executed every 12 hours
async function doSomething() {
    try {
        let result=await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/upcomingContest`,{
            withCredentials:true,
            headers:{
                'Content-Type':'multipart/form-data'
            }
        })
        console.log(result.data.data);
        title=result.data.data[0].title;
        date=result.data.data[0].date;
        let currentTimestamp = Date.now();

        // Create a new Date object with the current timestamp
        let currentDate = new Date(currentTimestamp);
        
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
        let day = currentDate.getDate(); // Get the day of the month
       let curDate=year+'-'+month+'-'+day;

   // console.log(year+'-'+month+'-'+day);
        
      

    } catch (error) {
        console.log(error);
    }

}

// Calculate the interval duration for 12 hours
const intervalInMs = 13 * 60 * 60 * 1000; // 13 hours in milliseconds

// Set up the setInterval to run the function every 12 hours
setInterval(doSomething, intervalInMs);
// Run the function immediately on startup
await doSomething();






    // Schedule a task to check reminders every minute

    let contestType =title;
    let contestArr = contestType.split(" ");
       // console.log(contestArr[0].toLowerCase());
    let newDate = new Date(); // Current date and time
    if(contestArr[0].toLowerCase() =='biweekly'){
        newDate.setHours(12);     // Set hours to 22 (10 PM)
        newDate.setMinutes(0);    // Set minutes to 38
    }else{
        newDate.setHours(10);     // Set hours to 22 (10 PM)
        newDate.setMinutes(0);    // Set minutes to 38
    }
    
  
    // Get timestamp in milliseconds
    let updatedTimestamp  = newDate.getTime();


    cron.schedule('* * * * *', async () => {
      
        // console.log(Date.now());

        // Compare timestamp with current time
        if (date === curDate && updatedTimestamp && updatedTimestamp <= Date.now()) {
            // If the timestamp is in the past or now, send a message
            let channel = client.channels.cache.get(process.env.CHANNEL_ID); // Replace with your channel ID
            if (channel) {
                channel.send(`@everyone ${title} at 08:00 ${contestArr[0].toLowerCase() == 'biweekly' ? 'PM':'AM'}`); // Mention everyone and send message
            }
            updatedTimestamp=null;
        }
    });

});



client.on("messageCreate", async(message) => {
//    console.log(message);
   // console.log(message.content);

   let currentDate = new Date();
   let currentTime = currentDate.toLocaleTimeString();
   let scheduledTime = new Date("2024-06-30T08:43:00").getTime() - Date.now();


   

    if(message.author.bot) return;
   // console.log(message.author);
    if(message.content==='Hi'||message.content==='Hello'||message.content==='hi'||message.content==='hello'){
        message.reply({
            content:"<:emoji_33:1194860841619697694> Rom Rom Bhaiyoo.. ",
        })
    }
    let str = message.content;
    let strArray = str.split(" ");
        // console.log(strArray[0]);
        // console.log(strArray[1]);
    if(strArray.length > 1 && strArray[0]===';lcprofile'){
        try {
            let result=await axios.get(`https://alfa-leetcode-api.onrender.com/${strArray[1]}/contest`,{
                withCredentials:true,
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            // console.log(result.data);
            message.reply({
                content:"Handle Name - "+`${strArray[1]}`+'\n'+
                "Total Contest -"+`${result.data.contestAttend}`+'\n'+
                "Contest Rating - "+`${result.data.contestRating}`+'\n'+
                "Contest Top Percenteage - "+`${result.data.contestTopPercentage}`,
            })
          

        } catch (error) {
            message.reply({
                content:"Invalid User",
            })
        }
    }
  
   
});

client.on("interactionCreate",async interaction=>{
   // console.log(interaction);
    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
    if (interaction.commandName === 'lcupcome') {
        
        try {
            let result=await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/upcomingContest`,{
                withCredentials:true,
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            // console.log(result.data.data);
            await interaction.reply(result.data.data[0].title+' - ('+result.data.data[0].date +')'+'\n'+result.data.data[1].title+' -  ('+result.data.data[1].date +')');
          

        } catch (error) {
            console.log(error);
        }

       // await interaction.reply('LC Weekly contest!');
    }

    if(interaction.commandName === 'potd'){
            let result=await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/problemoftheday`,{
                withCredentials:true,
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })

            console.log(result.data.content.activeDailyCodingChallengeQuestion.date);
            let resData=result.data.content.activeDailyCodingChallengeQuestion;
            await interaction.reply('* Q-Name - '+resData.question.title+'\n'+'* Difficulty-level - '+resData.question.difficulty+'\n'+'* Acceptance-Rate - '+parseInt(resData.question.acRate)+'%'+'\n'+'* Problem-Link - '+'https://leetcode.com'+resData.link);
    }

    if(interaction.commandName === 'userstat'){
        const input = interaction.options.getString('input');
     try{
    let result=await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/username/${input}`,{
        withCredentials:true,
        headers:{
            'Content-Type':'multipart/form-data'
        }
    })       
               let resData=result.data.content.matchedUser.submitStats.acSubmissionNum;

               await interaction.reply('User Name - '+`${input}`+'\n'+'-> Total Problem Solved - '+resData[0].count+'\n'+
                '-> Easy Problem Solved - '+resData[1].count+'\n'+
                '-> Medium Problem Solved - '+resData[2].count+'\n'+
                '-> Hard Problem Solved - '+resData[3].count
               );
       }catch(err){
             await interaction.reply("Invalid User, Try it again!");
       }

    }

    if(interaction.commandName === 'skillstat'){
        const input = interaction.options.getString('input');
        try {
            let result=await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/skillstat/${input}`,{
                withCredentials:true,
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            }) 

            
            let topicObj=result.data.content.matchedUser.tagProblemCounts
            let advanced=topicObj.advanced;
            let intermediate=topicObj.intermediate;

            let fundamental=topicObj.fundamental;
           // console.log(advanced);
            // let myReply=null;
           let advancedString='';
            advanced.forEach(element => {
                advancedString += `${element.tagName} - ${element.problemsSolved}\n`;
               // console.log(element.tagName);
              });
              let intermediateString='';
              intermediate.forEach(element => {
                  intermediateString += `${element.tagName} - ${element.problemsSolved}\n`;
                 // console.log(element.tagName);
                });

                let fundamentalString='';
            fundamental.forEach(element => {
                fundamentalString += `${element.tagName} - ${element.problemsSolved}\n`;
               // console.log(element.tagName);
              });
           
             await interaction.reply(`Username - ${input} \n--Topic wise problem solved---\n * 1. Advanced Topics -> \n${advancedString} \n * 2. Intermediate Topics -> \n${intermediateString} \n * 3. Fundamental Topics -> \n${fundamentalString}`);
        } catch (error) {
            await interaction.reply("Invalid User, Try it again!");
        }
    }

    if(interaction.commandName === 'recaccepted'){
        const input1 = interaction.options.getString('input1');
        const input2 = interaction.options.getString('input2');
        try {
            let result=await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/recentac/${input1}/${input2}`,{
                withCredentials:true,
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            }) 

            
            let resData=result.data.content.recentAcSubmissionList;
            let advancedString=`* Recent Solved Problems by ${input1}\n \n`;
            let cnt=1;
            resData.forEach(element => {
                advancedString += `-> ${cnt}. ${element.title}\nProblem_Link - https://leetcode.com/problems/${element.titleSlug}/description/\n \n`;
             cnt++;
              });
           
              await interaction.reply(advancedString);
        } catch (error) {
            await interaction.reply("Invalid User, Try it again!");
        }
        
    }

    if(interaction.commandName === 'conteststat'){
        const input1 = interaction.options.getString('input1');
        const input2 = interaction.options.getString('input2');
        try {
            let result=await axios.get(`https://leetcodecustomapi.onrender.com/api/omrajhalwa/leetcode/conteststat/${input1}`,{
                withCredentials:true,
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            }) 

            
            let resData=result.data.content;
           let userRanking=resData.userContestRanking;
           let userRecentContest=resData.userContestRankingHistory;
          // console.log(userRecentContest);
           let val=input2;
           let rankingListLength=userRecentContest.length;
        //    console.log(rankingListLength);
           let ansString=`Recent Contest of ${input1}\n`;
           let cnt=1;
           for(let i=rankingListLength-1;i>=0 && val--;i--){
            if(userRecentContest[i].attended){
                const totalSeconds = userRecentContest[i].finishTimeInSeconds;

// Calculate hours
const hours = Math.floor(totalSeconds / 3600);

// Calculate remaining minutes
const minutes = Math.floor((totalSeconds % 3600) / 60);

// Calculate remaining seconds
const seconds = totalSeconds % 60;
             ansString+=`${cnt}. ${userRecentContest[i].contest.title}\n-> Rating - ${userRecentContest[i].rating}\n-> Ranking - ${userRecentContest[i].ranking}\n-> Problem_Solved - ${userRecentContest[i].problemsSolved}/${userRecentContest[i].totalProblems}\n-> Rating_Trend - ${userRecentContest[i].trendDirection}\n-> Finish_Time - ${hours} hours, ${minutes} minutes, and ${seconds} seconds\n \n`;
                    cnt++;
            }
                   
           }
            await interaction.reply(ansString);
         
        } catch (error) {
            await interaction.reply("Invalid User, Try it again!");
        }
        
    }
  
})

client.login(
   process.env.TOKEN
)