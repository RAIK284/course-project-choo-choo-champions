import { GenerateDominoBankForGame } from "./DominoBank";

export function GenerateDominoesForPlayers(player_list) {
  GenerateDominoBankForGame();
  const dominos = JSON.parse(sessionStorage.getItem("Domino"));
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

export function GeneratePathsForGame(startingDomino, player_list){
    const gamePaths = {};
    gamePaths['Starting Domino'] = startingDomino;
    for (let i=0; i<player_list.length;i++){
      gamePaths[player_list[i]] = {'Dominoes': [], 'Playable': false};
    }
    gamePaths['Mexican Train'] = {'Dominoes': [], 'Playable': true};
    sessionStorage.setItem("Player Paths", JSON.stringify(gamePaths));
}

export function DeterminePlayablePaths(player, player_list){
  const playerDominos = JSON.parse(sessionStorage.getItem("Player Dominoes"));
  const playerPaths = JSON.parse(sessionStorage.getItem("Player Paths"));
  const boneyard = JSON.parse(sessionStorage.getItem("Boneyard"));
  const playablePaths = [];
  for(let i=0; i<playerDominos[player].length; i++){
    for(let j=0; j<player_list.length;j++){
      const pathDominoes = playerPaths[player_list[j]]['Dominoes'];
      // if train is playable we can check for playability
      if(playerPaths[player_list[j]].Playable || player_list[j] === player){
        // if there isn't a path we check the starting domino
        if(pathDominoes.length === 0 && (playerDominos[player][i][1]===playerPaths['Starting Domino'][0][2] || playerDominos[player][i][2]===playerPaths['Starting Domino'][0][2])){
          if(!playablePaths.includes(player)){
            playablePaths.push(player);
          }
        } 
        // if there is we check the last value of the last domino in the list, with this dominos top value
        else if(pathDominoes.length !== 0 && (pathDominoes[pathDominoes.length-1][2] === playerDominos[player][i][1] || pathDominoes[pathDominoes.length-1][2] === playerDominos[player][i][2])){
          if(!playablePaths.includes(player)){
            playablePaths.push(player);
          }
        }
      }
    }
    if(playerPaths['Mexican Train'].Playable){
      const mexicanPath = playerPaths['Mexican Train']['Dominoes'];
      if(mexicanPath.length === 0 && (playerDominos[player][i][1]===playerPaths['Starting Domino'][0][2] || playerDominos[player][i][2]===playerPaths['Starting Domino'][0][2])){
        if(!playablePaths.includes('Mexican Train')){
          playablePaths.push('Mexican Train');
        }
      } 
      else if(mexicanPath.length !== 0 && (mexicanPath[mexicanPath.length-1][2] === playerDominos[player][i][1] || mexicanPath[mexicanPath.length-1][2] === playerDominos[player][i][2])){
        if(!playablePaths.includes('Mexican Train')){
          playablePaths.push('Mexican Train');
        }
      }
    }    
  }
  if(playablePaths.length === 0 && boneyard.length !== 0){
    playablePaths.push("Draw");
  } else if(playablePaths.length ===0 && boneyard.length === 0){
    playablePaths.push("Pass");
  }
  return playablePaths;
}

export function CheckIfDominoIsPlayable(player, player_list, domino, path){
    const paths = DeterminePlayablePaths(player, player_list);
    if(paths.includes(path)){
      if(paths[path].Dominoes.length===0){
        return paths['Starting Domino'][2]===domino[1] || paths['Starting Domino']===domino[2];
      } else {
        const endDomino = paths[path].Dominoes[paths[path].Dominoes.length-1]
        return endDomino[2]===domino[1] || endDomino[2]===domino[2]
      }
    }
    return false;
  }

function GameLogic() {
  return null;
}
export default GameLogic;
