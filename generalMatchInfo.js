/* for the match:
      -the length of the game = gameLength
      -the game mode = gameMode
      -the winning team = winningTeam
      -match ID = matchID
      -banned heroes = bannedHeroes
      -date and time of the match = MatchDate & MatchTime
      -player info:
          -player Name = playerName
          -player hero Name = playerHeroName
          -team = teamName
          -kills/deaths/assists = playerKills & playerDeaths & playerAssists
*/

var fetch = require('node-fetch');
var dotaMatchesDataJSON = require('./sampleBasicMatchData.json')
var latestMatchDataJSON = require('./sampleExtendedMatchData.json')
let dotaHeroes = require('./dotaHeroIDs.json')
class Player {
  constructor({playerName, playerHeroID, playerHeroName, teamName, playerKills, playerDeaths, playerAssists}){
    this.playerName = playerName;
    // this.playerHeroID = playerHeroID;
    this.playerHeroName = playerHeroName;
    this.teamName = teamName;
    this.playerKills = playerKills;
    this.playerDeaths = playerDeaths;
    this.playerAssists = playerAssists
  }
}
async function getMatchesData(){
  //const latestMatch = dotaMatchesDataJSON[0].match_id; //uncomment for real data.  sets latestmatch to the most recent match
  const matchData = [];
  const radiantTeam = [];
  const direTeam = [];
  const playerInfo = [];
  let index = 0;

  while(index < 10){
    const player = new Player({
      playerName: latestMatchDataJSON.players[index].personaname,
      //playerHeroID: latestMatchDataJSON.players[index].hero_id,
      playerHeroName: dotaHeroes.find(dotaHeroes => dotaHeroes.heroID === latestMatchDataJSON.players[index].hero_id).heroName,
      teamName: latestMatchDataJSON.players[index].isRadiant? "radiant" : "dire",
      playerKills: latestMatchDataJSON.players[index].kills,
      playerDeaths: latestMatchDataJSON.players[index].deaths,
      playerAssists: latestMatchDataJSON.players[index].assists
    });
    playerInfo.push(player);
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


  console.log(playerInfo);
};

getMatchesData();
