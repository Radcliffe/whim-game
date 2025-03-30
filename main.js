import { GameEngine } from './gameEngine.js';
import { GameUI } from './gameUI.js';

document.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine();
    const gameUI = new GameUI(game, document);
    gameUI.startNewGame();
});
