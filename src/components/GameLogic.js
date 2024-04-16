import { GenerateDominoBankForGame } from "./DominoBank";

export function GenerateDominoesForPlayers(player_list, startingDomino) {
  GenerateDominoBankForGame();
  const dominos = JSON.parse(sessionStorage.getItem("Domino"));
  dominos.splice(dominos.indexOf(startingDomino));
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
  sessionStorage.setItem("Boneyard", JSON.stringify(dominos));
  sessionStorage.setItem("Player Dominoes", JSON.stringify(playerDominoes));
}

export function GeneratePathsForGame(startingDomino, player_list) {
  const gamePaths = {};
  gamePaths["Starting Domino"] = startingDomino;
  for (let i = 0; i < player_list.length; i++) {
    gamePaths[player_list[i]] = { Dominoes: [], Playable: false };
  }
  gamePaths["Mexican Train"] = { Dominoes: [], Playable: true };
  sessionStorage.setItem("Player Paths", JSON.stringify(gamePaths));
}

export function DeterminePlayablePaths(player, player_list) {
  const playerDominos = JSON.parse(sessionStorage.getItem("Player Dominoes"));
  const playerPaths = JSON.parse(sessionStorage.getItem("Player Paths"));
  const boneyard = JSON.parse(sessionStorage.getItem("Boneyard"));
  const playablePaths = [];
  for (let i = 0; i < playerDominos[player].length; i++) {
    for (let j = 0; j < player_list.length; j++) {
      const pathDominoes = playerPaths[player_list[j]].Dominoes;
      // if train is playable we can check for playability
      // TODO: this if will have to be modified in the future (can keep right now)
      if (playerPaths[player_list[j]].Playable || player_list[j] === player) {
        // if there isn't a path we check the starting domino
        if (
          pathDominoes.length === 0 &&
          (playerDominos[player][i][1] ===
            playerPaths["Starting Domino"][0][2] ||
            playerDominos[player][i][2] ===
              playerPaths["Starting Domino"][0][2])
        ) {
          if (!playablePaths.includes(player)) {
            playablePaths.push(player);
          }
        }
        // if there is we check the last value of the last domino in the list, with this dominos top value
        else if (
          pathDominoes.length !== 0 &&
          (pathDominoes[pathDominoes.length - 1][1] ===
            playerDominos[player][i][1] ||
            pathDominoes[pathDominoes.length - 1][1] ===
              playerDominos[player][i][2])
        ) {
          if (!playablePaths.includes(player)) {
            playablePaths.push(player);
          }
        }
      }
    }
    if (playerPaths["Mexican Train"].Playable) {
      const mexicanPath = playerPaths["Mexican Train"]["Dominoes"];
      if (
        mexicanPath.length === 0 &&
        (playerDominos[player][i][1] === playerPaths["Starting Domino"][0][2] ||
          playerDominos[player][i][2] === playerPaths["Starting Domino"][0][2])
      ) {
        if (!playablePaths.includes("Mexican Train")) {
          playablePaths.push("Mexican Train");
        }
      } else if (
        mexicanPath.length !== 0 &&
        (mexicanPath[mexicanPath.length - 1][1] ===
          playerDominos[player][i][1] ||
          mexicanPath[mexicanPath.length - 1][1] ===
            playerDominos[player][i][2])
      ) {
        if (!playablePaths.includes("Mexican Train")) {
          playablePaths.push("Mexican Train");
        }
      }
    }
  }
  if (playablePaths.length === 0 && boneyard.length !== 0) {
    playablePaths.push("Draw");
  } else if (playablePaths.length === 0 && boneyard.length === 0) {
    playablePaths.push("Pass");
  }
  return playablePaths;
}


export function DrawADomino(player, player_list) {
  const paths = DeterminePlayablePaths(player, player_list);
  const boneyard = JSON.parse(sessionStorage.getItem("Boneyard"));
  const playerDominos = JSON.parse(sessionStorage.getItem("Player Dominoes"));
  if (boneyard.length === 0) {
    alert("Cannot draw domino. There are no dominoes available!");
  }
  if (paths.includes("Draw")) {
    playerDominos[player].push(
      boneyard.splice(Math.floor(Math.random() * boneyard.length), 1)[0]
    );
    sessionStorage.setItem("Boneyard", JSON.stringify(boneyard));
    sessionStorage.setItem("Player Dominoes", JSON.stringify(playerDominos));
    return true;
  } else {
    alert("Cannot draw domino. There are playable dominoes!");
    return false;
  }
}

export function CheckIfDominoIsPlayable(player, player_list, domino) {
  const paths = DeterminePlayablePaths(player, player_list);
  const playerPaths = JSON.parse(sessionStorage.getItem("Player Paths"));
  const playablePaths = [];
  for(let i = 0; i < paths.length; i++) {
    if(playerPaths[paths[i]].Dominoes.length === 0) {
      if(playerPaths['Starting Domino'][0][2] === domino[1] || playerPaths['Starting Domino'][0][2] === domino[2]) {
        playablePaths.push(paths[i]);
      }
    } else {
      const endingDomino = playerPaths[paths[i]].Dominoes[playerPaths[paths[i]].Dominoes.length - 1];
      if(endingDomino[1] === domino[1] || endingDomino[1] === domino[2]) {
        playablePaths.push(paths[i]);
      }
    }
  }
  
  if(playablePaths.length === 0) {
    alert('This Domino is not playable. Please pick a different one!');
  } else {
    return playablePaths;
  }
}

export function PlayDomino(player, player_list, domino, path){
  // this runs under assumption that the call to this function will only occur on a playable path
  const playerDominos = JSON.parse(sessionStorage.getItem("Player Dominoes"));
  const playerPaths = JSON.parse(sessionStorage.getItem("Player Paths"));
  for(let i=0;i<playerDominos[player].length;i++){
    if((playerDominos[player][i][1]===domino[1]&&playerDominos[player][i][2]===domino[2])||(playerDominos[player][i][2]===domino[1]&&playerDominos[player][i][1]===domino[2])){
      playerDominos[player].splice(i,1)
      break;
    }
  }
  
  //get the direction right (reverse if top connects to bottom)
  if(playerPaths[path].Dominoes.length===0 && playerPaths['Starting Domino'][0][2]===domino[1]){
    const temp = domino[2];
    domino[2] = domino[1];
    domino[1] = temp;
  } else if(playerPaths[path].Dominoes.length !== 0 && playerPaths[path].Dominoes[playerPaths[path].Dominoes.length-1][1]===domino[1]){
    const temp = domino[2];
    domino[2] = domino[1];
    domino[1] = temp;
  }
  playerPaths[path].Dominoes.push(domino);

  // check for double, if it is return false (signifying turn isn't ove)
  if(domino[1] === domino[2]){
    for(let i=0;i<player_list.length;i++){
      if(player !== player_list[i]){
        playerPaths[player].Playable = false;
      }
    }
    sessionStorage.setItem('Player Paths', JSON.stringify(playerPaths));
    sessionStorage.setItem('Player Dominoes', JSON.stringify(playerDominos));
    return false;
  }
  sessionStorage.setItem('Player Paths', JSON.stringify(playerPaths));
  sessionStorage.setItem('Player Dominoes', JSON.stringify(playerDominos));
  return true;
}

function GameLogic() {
  return null;
}
export default GameLogic;
