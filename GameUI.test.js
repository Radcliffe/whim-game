/**
 * @jest-environment jsdom
 */

import { GameEngine } from './gameEngine.js'; 
import { GameUI } from './gameUI.js'; 

describe('GameUI', () => {
  let gameEngine;
  let gameUI;

  beforeEach(() => {
    // Mock the DOM
    document.body.innerHTML = `
      <div id="piles-container"></div>
      <div id="message"></div>
      <button id="new-game-btn"></button>
      <button id="computer-move-btn"></button>
      <div id="split-modal" style="display: none;"></div>
      <button id="close-modal"></button>
      <div id="selected-pile-height"></div>
      <input id="new-piles-input" />
      <button id="replace-btn"></button>
      <div id="validation-message"></div>
    `;

    // DOM elements
    let pilesContainer = document.getElementById('piles-container');
    let messageBox = document.getElementById('message');
    let newGameBtn = document.getElementById('new-game-btn');
    let computerMoveBtn = document.getElementById('computer-move-btn');
    let modal = document.getElementById('split-modal');
    let closeModal = document.getElementById('close-modal');
    let selectedPileHeight = document.getElementById('selected-pile-height');
    let newPilesInput = document.getElementById('new-piles-input');
    let replaceBtn = document.getElementById('replace-btn');
    let validationMessage = document.getElementById('validation-message');

    // Initialize the GameEngine and GameUI
    gameEngine = new GameEngine();
    gameUI = new GameUI(gameEngine, document);
  });

  test('should initialize event listeners', () => {
    const newGameSpy = jest.spyOn(gameUI, 'startNewGame');
    document.getElementById('new-game-btn').click();
    expect(newGameSpy).toHaveBeenCalled();
  });

  test('should start a new game', () => {
    gameUI.startNewGame();
    expect(document.getElementById('message').textContent).toBe("Your turn! Click on a pile to replace it.");
  });

  test('should handle computer move', () => {
    gameEngine.makeComputerMove = jest.fn(() => ({
      originalHeight: 5,
      newHeights: [2, 3],
    }));
    gameUI.currentTurn = 'computer';
    gameEngine.isGameOver = jest.fn(() => false);

    gameUI.handleComputerMove();
    expect(gameUI.currentTurn).toBe('player');

    expect(document.getElementById('message').textContent).toBe("Computer replaced a pile of height 5 with 2, 3.");
  });

  test('should validate input in handleReplacePile', () => {
    gameUI.selectedPileIndex = 0;
    gameUI.currentTurn = 'player';
    document.getElementById('new-piles-input').value = '';

    gameUI.handleReplacePile();

    expect(document.getElementById('validation-message').textContent).toBe("Please enter at least one pile height or 0 to remove.");
  });

  test('should render piles', () => {
    gameEngine.piles = [3, 2, 1];
    gameUI.renderPiles();

    const piles = document.querySelectorAll('.pile');
    expect(piles.length).toBe(3);
    expect(piles[0].querySelector('.pile-count').textContent).toBe('3');
  });

  test('should open and close modal', () => {
    gameUI.selectPile(0);
    expect(document.getElementById('split-modal').style.display).toBe('flex');

    gameUI.closeModalDialog();
    expect(document.getElementById('split-modal').style.display).toBe('none');
  });

  test('should end the game', () => {
    gameUI.endGame("Game over! You win!");
    expect(document.getElementById('message').textContent).toBe("Game over! You win!");
    expect(document.getElementById('computer-move-btn').disabled).toBe(true);
  });

  test('should handle pile selection', () => {
    gameEngine.piles = [3, 2, 1];
    gameUI.selectPile(0);
    expect(document.getElementById('selected-pile-height').textContent).toBe("3");
  });
 
});