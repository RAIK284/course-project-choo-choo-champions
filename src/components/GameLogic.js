import DominoBank from "./DominoBank";

function GenerateDominos(player_list){
    const dominos = DominoBank.GenerateDominoBank();
    // generate the "dictionaries"
    const playerDominoes = {};
    for (let k = 0; k < player_list.length; k++) {
        playerDominoes[player_list[k]] = [];
    }

    // "deal" dominoes to all players until they have fifteen
    for(let i=0; i<15;i++){
        for(let j=0;j<player_list.length;j++){
            playerDominoes[player_list[j]].push(dominos.pop(Math.floor(Math.random()*dominos.length)));
        }
    }
    return playerDominoes;
}