import {
    GenerateDominoesForPlayers,
    GeneratePathsForGame,
    CheckWinner,
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
        // Setup
        GenerateDominoesForPlayers(playerList, startingDomino);
        // Execute
        const playerDominoes = JSON.parse(sessionStorage.getItem("Player Dominoes"));
        // Test
        expect(playerDominoes['Alice'].length).toBe(15);
        expect(playerDominoes['Bob'].length).toBe(15);
    });

    test('GeneratePathsForGame initializes paths correctly', () => {
        // Setup
        GeneratePathsForGame(startingDomino, playerList);
        // Execute
        const paths = JSON.parse(sessionStorage.getItem("Player Paths"));
        // Test
        expect(paths['Starting Domino']).toEqual(startingDomino);
        expect(paths['Mexican Train']).toEqual({ Dominoes: [], Playable: true });
    });

    test('CheckWinner detects a winner correctly', () => {
        // Setup
        sessionStorage.setItem("game", JSON.stringify({
            "Player Dominoes": { "Alice": [], "Bob": [[1, 1]] }
        }));
        // Execute
        const winner = CheckWinner(playerList);
        // Test
        expect(winner).toBe('Alice');
    });

    test('CalculateScores calculates scores correctly', () => {
        // Setup
        sessionStorage.setItem("game", JSON.stringify({
            "Player Dominoes": { "Alice": [[1, 1], [2, 2]], "Bob": [] }
        }));
        // Execute
        const scores = CalculateScores(playerList);
        // Test
        expect(scores).toEqual([NaN, 0]);
    });

});