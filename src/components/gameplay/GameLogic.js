import { GenerateDominoBankForGame } from "./dominoes/DominoBank";

// this function generates 'banks' of dominos for each player
// these banks represent the dominos each player starts with in their hand
// this is then stored in a dictionary, and is only called on round setup
export function GenerateDominoesForPlayers(player_list, startingDomino) {
  GenerateDominoBankForGame();
  const dominos = JSON.parse(sessionStorage.getItem("Domino"));
  for(let i=0;i<dominos.length;i++){
    if(dominos[i][1]===startingDomino[0][1] && dominos[i][2]===startingDomino[0][2]){
      dominos.splice(i,1);
    }
  }
  // generate the "dictionaries"
  const playerDominoes = {};
  for (let k = 0; k < player_list.length; k++) {
    playerDominoes[player_list[k]] = [];
  }

  // "deal" dominoes to all players until they have fifteen
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < player_list.length; j++) {
      playerDominoes[player_list[j]].push(
        dominos.splice(Math.floor(Math.random() * dominos.length), 1)[0]
      );
    }
  }
  
  // store the remaining dominos, and the players dominos in session storage
  sessionStorage.setItem("Boneyard", JSON.stringify(dominos));
  sessionStorage.setItem("Player Dominoes", JSON.stringify(playerDominoes));
}

// this generates the object that will represent the game board,
// it is comprised of the players paths and whether they are playable or not
// along with a flag for unvalidated dominos. Occurs only on round setup
export function GeneratePathsForGame(startingDomino, player_list) {
  const gamePaths = {};
  gamePaths["Starting Domino"] = startingDomino;
  for (let i = 0; i < player_list.length; i++) {
    gamePaths[player_list[i]] = { Dominoes: [], Playable: false };
  }
  gamePaths["Mexican Train"] = { Dominoes: [], Playable: true };
  gamePaths['UnvalidatedDouble'] = null;
  // store the object in session storage
  sessionStorage.setItem("Player Paths", JSON.stringify(gamePaths));
}

// this function takes in a player, and returns all playable paths
// this function is used to determine what moves a player has on any given 
// turn, based on their bank and the state of the player paths
export function DeterminePlayablePaths(player, player_list) {
  // load all necessary components
  const game = JSON.parse(sessionStorage.getItem("game"));
  const playerDominos = game['Player Dominoes'];
  const playerPaths = game['Player Paths'];
  const boneyard = game.Boneyard;
  const playablePaths = [];
  // condition 1: there is no unvalidated double, options are not constrained
  if(playerPaths.UnvalidatedDouble === null){
    // we will check the playability condition for each domino, on each path
    for (let i = 0; i < playerDominos[player].length; i++) {
      for (let j = 0; j < player_list.length; j++) {
        const pathDominoes = playerPaths[player_list[j]].Dominoes;
        // if train is playable we can check for playability
        const playablePath = playerPaths[player_list[j]].Playable || player_list[j] === player;
        if (playablePath) {
          // if there isn't a path we check if we can play on the starting domino
          const canPlayOnStartingDomino = pathDominoes.length === 0 && 
          (playerDominos[player][i][1] === playerPaths["Starting Domino"][0][2] ||
            playerDominos[player][i][2] === playerPaths["Starting Domino"][0][2])
          // ensure we are not double pushing the domino
          if (canPlayOnStartingDomino && !playablePaths.includes(player_list[j])) {
              playablePaths.push(player_list[j]);
          }
          // if there is we check the last value of the last domino in the list, with this dominos top value
          const canPlayOnLastDomino = pathDominoes.length !== 0 && 
          (pathDominoes[pathDominoes.length - 1][1] === playerDominos[player][i][1] ||
            pathDominoes[pathDominoes.length - 1][1] === playerDominos[player][i][2]);
          // ensure we are not double pushing the domino
          if(canPlayOnLastDomino && !playablePaths.includes(player_list[j])){
            playablePaths.push(player_list[j]);
          }
        }
      }
      // after we check the players trains we can check the mexican train
      if (playerPaths["Mexican Train"].Playable) {
        const mexicanPath = playerPaths["Mexican Train"]["Dominoes"];
        // if there are no dominos on the path, can we play on the starting domino
        const canPlayOnMexicanStarting = mexicanPath.length === 0 &&
        (playerDominos[player][i][1] === playerPaths["Starting Domino"][0][2] ||
          playerDominos[player][i][2] === playerPaths["Starting Domino"][0][2]);
        // again ensure we do not double count
          if (canPlayOnMexicanStarting && !playablePaths.includes("Mexican Train")) {
            playablePaths.push("Mexican Train");
        } 
        // if there are, we check if we can play on the last domino
        const canPlayOnMexicanEnding = mexicanPath.length !== 0 &&
        (mexicanPath[mexicanPath.length - 1][1] === playerDominos[player][i][1] ||
          mexicanPath[mexicanPath.length - 1][1] === playerDominos[player][i][2]);
        // again ensure no double count
          if (canPlayOnMexicanEnding && !playablePaths.includes("Mexican Train")) {
          playablePaths.push("Mexican Train");
        }
      }
    } 
  } else{
    // option 2: options constrained and we must play on the unvalidated double
    const lastDomino = playerPaths[playerPaths.UnvalidatedDouble].Dominoes[playerPaths[playerPaths.UnvalidatedDouble].Dominoes.length-1];
    for (let i = 0; i < playerDominos[player].length; i++){
      const canPlayOnUnvalidatedDouble = (lastDomino[1] === playerDominos[player][i][2] || lastDomino[1]=== playerDominos[player][i][1]) && !playablePaths.includes(playerPaths.UnvalidatedDouble);
      if(canPlayOnUnvalidatedDouble){
        playablePaths.push(playerPaths.UnvalidatedDouble);
      }
    }
  }
  // now that we have looped through all dominos, if no playable options were available
  // we determine that a player must pass or draw. Pass only occurs if no dominos exist in the boneyard
  if (playablePaths.length === 0 && boneyard.length !== 0) {
    playablePaths.push("Draw");
  } else if (playablePaths.length === 0 && boneyard.length === 0) {
    playablePaths.push("Pass");
    // if a player's status changes, we alert the game that they have gone choo choo
    if(!playerPaths[player].Playable){
      alert(player + " has gone choo choo! Their path is now playable.");
    }
    // store playability changes
    playerPaths[player].Playable = true;
    game['Playable Paths'] = playerPaths;
    sessionStorage.setItem("game", JSON.stringify(game));
  }
  
  // return the playable paths
  return playablePaths;
}

// this function is responsible for drawing a domino for a player, and then storing it in their bank
export function DrawADomino(player, player_list) {
  // set up with all necessary constants
  const game = JSON.parse(sessionStorage.getItem("game"))
  const paths = DeterminePlayablePaths(player, player_list);
  const boneyard = game.Boneyard;
  const playerDominos = game['Player Dominoes'];
  const playerPaths = game['Player Paths'];
  // ensure that drawing is actually necessary here
  if (paths.includes("Draw")) {
    // add a random boneyard domino to the player bank
    playerDominos[player].push(
      boneyard.splice(Math.floor(Math.random() * boneyard.length), 1)[0]
    );
    game.Boneyard = boneyard
    game['Player Dominoes'] = playerDominos;
    game['Player Paths'] = playerPaths;
    // update the game
    sessionStorage.setItem("game", JSON.stringify(game));
    //check if the player's playability status changed, if it does, store it
    const newPaths = DeterminePlayablePaths(player, player_list);
    if(newPaths.includes("Draw") || newPaths.includes("Pass")){
      if(!playerPaths[player].Playable){
        alert(player + " has gone choo choo! Their path is now playable.");
      }
      playerPaths[player].Playable = true;
      game['Player Paths'] = playerPaths;
      sessionStorage.setItem("game", JSON.stringify(game));
    }
    return true;
  } else {
    alert("Cannot draw domino. There are playable dominoes!");
    return false;
  }
}

// determines for a selected domino, what paths a single domino is playable on
// utilizes the determine playable paths to narrow options
export function CheckIfDominoIsPlayable(player, player_list, domino) {
  // get constants
  const game = JSON.parse(sessionStorage.getItem("game"));
  const paths = DeterminePlayablePaths(player, player_list);
  const playerPaths = game['Player Paths'];
  const playablePaths = [];
  
  //loop through all possible paths and determine if the domino is playable on it
  for(let i = 0; i < paths.length; i++) {
    // if there is no domino on the path, starting domino is our last domino
    if(playerPaths[paths[i]].Dominoes.length === 0) {
      const playableOnStart = playerPaths['Starting Domino'][0][2] === domino[1] || playerPaths['Starting Domino'][0][2] === domino[2];
      if(playableOnStart) {
        playablePaths.push(paths[i]);
      }
    } else {
      // if there is we get the ending domino and determine if it is playable
      const endingDomino = playerPaths[paths[i]].Dominoes[playerPaths[paths[i]].Dominoes.length - 1];
      const playableOnEnd = endingDomino[1] === domino[1] || endingDomino[1] === domino[2];
      if(playableOnEnd) {
        playablePaths.push(paths[i]);
      }
    }
  }
  
  // if no paths are playable, alert the user to select a different domino
  if(playablePaths.length === 0) {
    alert('This Domino is not playable. Please pick a different one!');
  } else {
    return playablePaths;
  }
}

// function that allows a user to play a domino on a path
// it can only occur after the domino is verified to play on a certain path
export function PlayDomino(player, domino, path){
  // get constants
  const game = JSON.parse(sessionStorage.getItem("game"));
  const playerDominos = game["Player Dominoes"];
  const playerPaths = game["Player Paths"];
  // determine the domino we will be removing from the player bank
  for(let i=0;i<playerDominos[player].length;i++){
    const dominoToRemove = (playerDominos[player][i][1]===domino[1]&&playerDominos[player][i][2]===domino[2])||(playerDominos[player][i][2]===domino[1]&&playerDominos[player][i][1]===domino[2]);
    if(dominoToRemove){
      playerDominos[player].splice(i,1)
      break;
    }
  }
  
  //get the direction right (reverse if top connects to bottom)
  const startingDominoBackwards = playerPaths[path].Dominoes.length===0 && playerPaths['Starting Domino'][0][2]===domino[1];
  const nonStartingDominoBackwards = playerPaths[path].Dominoes.length !== 0 && playerPaths[path].Dominoes[playerPaths[path].Dominoes.length-1][1]===domino[1]
  if(startingDominoBackwards || nonStartingDominoBackwards){
    const temp = domino[2];
    domino[2] = domino[1];
    domino[1] = temp;
  }
  // add the correctly ordered domino 
  playerPaths[path].Dominoes.push(domino);
  
  // if we play on an unvalidated double, alert that it has been validated
  if(playerPaths.UnvalidatedDouble !== null){
    playerPaths.UnvalidatedDouble = null;
    alert(player + " has validated the double!");
  }

  // check for double, flag if it is a double. If not double, ensure that a player
  // is allowed to get off the train if they play on their own train
  if(domino[1] === domino[2]){
    playerPaths.UnvalidatedDouble = path;
    alert(player + " has played an unvalidated double!");
  } else if(player === path && playerPaths[player].Playable){
    playerPaths[player].Playable = false;
    alert(player + " has gone ooch ooch! Their path is no longer playable.");
  }
  // store the johnsons
  game['Player Paths'] = playerPaths;
  game['Player Dominoes'] = playerDominos
  sessionStorage.setItem('game', JSON.stringify(game));
}

// checks for a winner, if any player has no dominos in their bank at the END of their turn
// ends the round
export function CheckWinner(player_list){
  const playerDominos = JSON.parse(sessionStorage.getItem("game"))['Player Dominoes'];
  for(let i=0;i<player_list.length;i++){
    if(playerDominos[player_list[i]].length===0){
      return player_list[i];
    }
  }
  return "No One";
}

// backup function that ensures the game can continue, in case the game is unable to continue
export function EnsurePlayability(player_list){
  const game = JSON.parse(sessionStorage.getItem("game"));
  const boneyard = game.Boneyard;
  // if they can draw the game can go on
  if(boneyard.length!==0){
    return false;
  }
  // if all players must pass the game is over
  for(let i=0;i<player_list.length;i++){
    const paths = DeterminePlayablePaths(player_list[i],player_list)
    if(!paths.includes("Pass")){
      return false;
    }
  }
  return true;
}

// calculates the scores of all the players
export function CalculateScores(player_list){
  // set up
  const playerDominos = JSON.parse(sessionStorage.getItem("game"))["Player Dominoes"];
  const returnList = [];
  // for each player, sum the total of their dominos and add it to the list
  for(let i=0;i<player_list.length;i++){
    const dominos = playerDominos[player_list[i]];
    if(dominos.length===0){
      returnList.push(0);
    } else{
      let sum = 0;
      for(let j=0;j<dominos.length;j++){
        sum += dominos[j][1] + dominos[j][2];
      }
      returnList.push(sum);
    }
  }
  return returnList;
}