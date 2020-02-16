const {Client, Attachment, MessageCollector} = require('discord.js');
var fetch = require('node-fetch');
require('dotenv').config()
const client = new Client();
const gameToImage = require('./gameToImage.js');
const getGameSummary = require('./getGameSummary.js');
const POLL_FOR_LATEST_MATCH_MS = 10*60*1000
const DISCORD_SEARCH_STRING = "DOTABOT match ID ";
const PNG = ".png"
// const matchID = 5238584453;

async function getMatchIDsSince(lastPostedMatchID){
  const dotaMatchesDataJSON = await fetch('https://api.opendota.com/api/players/64765188/matches?sort=start_time').then(r => r.json());
  const matchIDs = dotaMatchesDataJSON.map(elementMatch => String(elementMatch.match_id))
  const indexOfLatestMatch = matchIDs.indexOf(String(lastPostedMatchID))
  console.log("indexOfLatestMatch", indexOfLatestMatch)
  return matchIDs.slice(0, indexOfLatestMatch).reverse();
}
// functions to do every interal
async function toDoEveryInterval(channel) {
  const lastPostedMatchID = await getLastPostedMatchID(channel) // done
  console.log("lastPostedMatchID2", lastPostedMatchID)
  const matchIDs = await getMatchIDsSince(lastPostedMatchID) // not done
  console.log(matchIDs);

  //const matchIDs = [5235239734];
  matchIDs.forEach(async function(matchID){
    const gameSummary = await getGameSummary(matchID) // done
    console.log(gameSummary);
    const title = `${DISCORD_SEARCH_STRING}${matchID}${PNG}`
    const imageBuffer = await gameToImage(gameSummary, title) // done
    await postImageToDiscord(channel, imageBuffer, title) // done
  });

}

async function postImageToDiscord(channel, imageBuffer, title){
  channel.send(title);
  // Create the attachment using Attachment
  const attachment = new Attachment(imageBuffer, title);
      // const attachment = new Attachment('./test.png');
  // Send the attachment in the message channel
  channel.send(attachment);
}

async function getLastPostedMatchID (channel){
  // https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=fetchMessages
  // https://anidiots.guide/understanding/collections#finding-by-key
  const lastMatchMessage = await channel.fetchMessages({limit: 100})
  .then(messages => messages.find(message => message.content.includes(DISCORD_SEARCH_STRING)))
  //.then(message => console.log("message", {author: message.author.username, content: message.content}));
  const lastMatchID = lastMatchMessage ? lastMatchMessage.content.replace(DISCORD_SEARCH_STRING, "").replace(PNG, "") : 0;
  //console.log("ended getLastPostedMatchID")
  return lastMatchID;
};

client.on('ready', () => {
  console.log(client.user.tag + ' is ready!');
  const channel = client.channels.find(ch => ch.name === 'projects' && ch.type === 'text');
  toDoEveryInterval(channel)
  setInterval(() => toDoEveryInterval(channel), POLL_FOR_LATEST_MATCH_MS);
});

client.on('message', async message => {
  if (message.content === '!ping') {
    message.reply('pong');
  }
  if (message.content === '!match') {
    postMatch(message.channel);
  }
  if (message.content === '!id') {
    console.log("called !id")
    const lastMatchID = await getLastPostedMatchID(message.channel);
    message.reply(lastMatchID);
    console.log("lastMatchID", lastMatchID);
  }
});

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
if (!process.env.discord_bot_token) throw new Error('make sure you are using your .env')
client.login(process.env.discord_bot_token)
