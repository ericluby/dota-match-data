var fetch = require('node-fetch');
var dotaMatchesDataJSON = require('./sampleBasicMatchData.json')
var latestMatchDataJSON = require('./sampleExtendedMatchData.json')
let dotaHeroes = require('./dotaHeroIDs.json')
async function getMatchesData(){
  //const dotaMatchesDataJSON = await fetch('https://api.opendota.com/api/players/64765188/matches?limit=3').then(r => r.json());
  //sample data with match ID and my hero played
  const latestMatch = dotaMatchesDataJSON[2].match_id;
  //const latestMatchDataJSON = await fetch(`https://api.opendota.com/api/matches/${latestMatch}?limit=1`).then(r => r.json());
  const radiantTeam = [];
  const direTeam = [];
  let playersTeam = "radiant";
  let winningTeam = "radiant"
  let index = 0;
  let generalData = [];
  const heroIDPlayed = dotaMatchesDataJSON[2].hero_id;
  let heroFromMatch = dotaHeroes.filter(dotaHeroes => dotaHeroes.heroID === heroIDPlayed)
  //console.log(latestMatchDataJSON.players[0].hero_id);
  latestMatchDataJSON.players.forEach(function(player){
    if(index<5){
      radiantTeam.push(player.hero_id);
      index++
    }else {
      direTeam.push(player.hero_id);
    }
  })// assign player's heroes to radiant or dire
  //console.log("radiantTeam", radiantTeam);
  //console.log("direTeam", direTeam);


  if(radiantTeam.indexOf(heroIDPlayed) !== -1) { //potentially fix
    playersTeam = "radiant";
    //console.log('you played for radiant')
  } else { //you played for direTeam
    playersTeam = "dire";
    //console.log('you played for dire')
  }
  if(dotaMatchesDataJSON[2].radiant_win){
    winningTeam = 'radiant';
  }else{
    winningTeam = 'dire'
  }
  let playerWon = "won";
  if (winningTeam === playersTeam){
    playerWon = "Won"
  }else{
    playerWon = "Lost"
  }


  //console.log(latestMatchDataJSON);
  // console.log(dotaMatchesDataJSON[2]);
  // const heroIDPlayed = dotaMatchesDataJSON[2].hero_id;
  // let heroFromMatch = dotaHeroes.filter(dotaHeroes => dotaHeroes.heroID === heroIDPlayed)

  console.log(`You ${playerWon} last match as you played for team ${playersTeam} as ${heroFromMatch[0].heroName} and had ${dotaMatchesDataJSON[2].kills} kills and ${dotaMatchesDataJSON[2].deaths} deaths`);
};

getMatchesData();
