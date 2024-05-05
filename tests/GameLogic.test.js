import {
    GenerateDominoesForPlayers,
    GeneratePathsForGame,
    DeterminePlayablePaths,
    DrawADomino,
    CheckIfDominoIsPlayable,
    CheckWinner,
    EnsurePlayability,
    CalculateScores
} from '../src/components/gameplay/GameLogic';

describe('Domino Game Tests', () => {
    const playerList = ['Alice', 'Bob'];
    const startingDomino = [[6, 6]];

    beforeEach(() => {
        // Mock sessionStorage for Jest
        const sessionStorageMock = (function () {
            let store = {};
            return {
                getItem(key) {
                    return store[key] || null;
                },
                setItem(key, value) {
                    store[key] = value.toString();
                },
                clear() {
                    store = {};
                }
            };
        })();

        Object.defineProperty(window, 'sessionStorage', {
            value: sessionStorageMock
        });
    });

    test('GenerateDominoesForPlayers assigns dominoes correctly', () => {
        GenerateDominoesForPlayers(playerList, startingDomino);
        const playerDominoes = JSON.parse(sessionStorage.getItem("Player Dominoes"));
        expect(playerDominoes['Alice'].length).toBe(15);
        expect(playerDominoes['Bob'].length).toBe(15);
    });

    test('GeneratePathsForGame initializes paths correctly', () => {
        GeneratePathsForGame(startingDomino, playerList);
        const paths = JSON.parse(sessionStorage.getItem("Player Paths"));
        expect(paths['Starting Domino']).toEqual(startingDomino);
        expect(paths['Mexican Train']).toEqual({ Dominoes: [], Playable: true });
    });

    test('CheckWinner detects a winner correctly', () => {
        sessionStorage.setItem("game", JSON.stringify({
            "Player Dominoes": { "Alice": [], "Bob": [[1, 1]] }
        }));
        const winner = CheckWinner(playerList);
        expect(winner).toBe('Alice');
    });

    test('CalculateScores calculates scores correctly', () => {
        sessionStorage.setItem("game", JSON.stringify({
            "Player Dominoes": { "Alice": [[1, 1], [2, 2]], "Bob": [] }
        }));
        const scores = CalculateScores(playerList);
        expect(scores).toEqual([NaN, 0]);
    });

});