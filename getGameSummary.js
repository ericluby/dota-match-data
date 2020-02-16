var fetch = require('node-fetch');
// var dotaMatchesDataJSON = require('./sampleBasicMatchData.json')
//var latestMatchDataJSON = require('./sampleExtendedMatchData.json')
let dotaHeroes = require('./dotaHeroIDs.json')
class Player {
  constructor({playerName, playerHeroID, playerHeroName, teamName, playerKills, playerDeaths, playerAssists}){
    this.playerName = playerName;
    this.playerHeroID = playerHeroID;
    this.playerHeroName = playerHeroName;
    this.teamName = teamName;
    this.playerKills = playerKills;
    this.playerDeaths = playerDeaths;
    this.playerAssists = playerAssists
  }
}

module.exports = getGameSummary

async function getGameSummary(matchID){
  //const latestMatch = dotaMatchesDataJSON[0].match_id; //uncomment for real data.  sets latestmatch to the most recent match
  const latestMatchDataJSON = await fetch(`https://api.opendota.com/api/matches/${matchID}?limit=1`).then(r => r.json());

  const gameDate = new Date(latestMatchDataJSON.start_time*1000);
  const matchData = {
    "gameLength": `${Math.floor(latestMatchDataJSON.duration/60)}:${latestMatchDataJSON.duration-(Math.floor(latestMatchDataJSON.duration/60)*60)}`,  // 12
    "gameMode": ['All Pick', "Captain's Mode", 'Random Draft', 'Single Draft', 'All Random'][latestMatchDataJSON.game_mode - 1], // "allpick"
    "winningTeam": latestMatchDataJSON.radiant_win ? 'radiant' : 'dire', // "radiant"
    "matchID": latestMatchDataJSON.match_id, // "78612478"
    "bannedHeroes": latestMatchDataJSON.picks_bans, // ["huskar", "broodmother", "riki"],  // TODO FIGURE THIS OUT
    "MatchDate": `${gameDate.getMonth()+1}/${gameDate.getDate()}/${gameDate.getFullYear()}`, // "1/4/12"
    "MatchTime": `${gameDate.getHours()}:${gameDate.getMinutes()}`, // "12:42"
    "players": []
  };

  let index = 0;
  while(index < 10){
    const player = new Player({
      playerName: latestMatchDataJSON.players[index].personaname,
      playerHeroID: latestMatchDataJSON.players[index].hero_id,
      playerHeroName: dotaHeroes.find((dotaHeroes) => dotaHeroes.id === latestMatchDataJSON.players[index].hero_id).name,
      teamName: latestMatchDataJSON.players[index].isRadiant ? "radiant" : "dire",
      playerKills: latestMatchDataJSON.players[index].kills,
      playerDeaths: latestMatchDataJSON.players[index].deaths,
      playerAssists: latestMatchDataJSON.players[index].assists
    });
    matchData.players.push(player);
    index++
  }
  //   new Player({
  //   playerName: "furikz",
  //   playerHeroName: "lich",
  //   teamName: "radiant",
  //   playerKills: 3,
  //   playerDeaths: 5,
  //   playerAssists: 7
  // });

  return matchData
};
// getGameSummary().then(console.log);
