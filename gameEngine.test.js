import { GameEngine } from './gameEngine';

describe('GameEngine', () => {
    let game;

    beforeEach(() => {
        game = new GameEngine();
    });

    test('startNewGame initializes piles with random heights', () => {
        game.startNewGame();
        expect(game.piles.length).toBeGreaterThanOrEqual(2);
        expect(game.piles.length).toBeLessThanOrEqual(6);
        game.piles.forEach(height => {
            expect(height).toBeGreaterThanOrEqual(1);
            expect(height).toBeLessThanOrEqual(9);
        });
    });

    test('heightMultiplicities calculates correct counts', () => {
        game.piles = [3, 3, 5, 7, 7, 7];
        const multiplicities = game.heightMultiplicities();
        expect(multiplicities).toEqual({ 3: 2, 5: 1, 7: 3 });
    });

    test('oddMultiplicityHeights returns heights with odd counts', () => {
        game.piles = [3, 3, 5, 7, 7, 7];
        const oddHeights = game.oddMultiplicityHeights();
        expect(oddHeights).toEqual([5, 7]);
    });

    test('isWinning identifies a winning state', () => {
        game.piles = [3, 3, 5, 7, 7, 7];
        expect(game.isWinning()).toBe(true);

        game.piles = [3, 3, 7, 7];
        expect(game.isWinning()).toBe(false);
    });

    test('isLosing identifies a losing state', () => {
        game.piles = [3, 3, 7, 7];
        expect(game.isLosing()).toBe(true);

        game.piles = [3, 3, 5, 7, 7, 7];
        expect(game.isLosing()).toBe(false);
    });

    test('isGameOver returns true when no piles remain', () => {
        game.piles = [];
        expect(game.isGameOver()).toBe(true);

        game.piles = [3];
        expect(game.isGameOver()).toBe(false);
    });

    test('replacePile replaces a pile with new heights', () => {
        game.piles = [5, 7, 9];
        const originalHeight = game.replacePile(1, [3, 4]);
        expect(originalHeight).toBe(7);
        expect(game.piles).toEqual([5, 3, 4, 9]);
    });

    test('removePile removes a pile by index', () => {
        game.piles = [5, 7, 9];
        const removedHeight = game.removePile(1);
        expect(removedHeight).toBe(7);
        expect(game.piles).toEqual([5, 9]);
    });

    test('makeComputerMove follows the correct strategy', () => {
        game.piles = [3, 3, 5, 7, 7, 7];
        const move = game.makeComputerMove();
        expect(move.originalHeight).toBe(7);
        expect(move.newHeights).toEqual([5]);

        game.piles = [3, 3, 7, 7];
        const randomMove = game.makeComputerMove();
        expect(randomMove.newHeights).toEqual([]);
    });
});