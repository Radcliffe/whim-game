import { GameEngine } from './gameEngine.js';

const game = new GameEngine();

// DOM elements
const pilesContainer = document.getElementById('piles-container');
const messageBox = document.getElementById('message');
const newGameBtn = document.getElementById('new-game-btn');
const computerMoveBtn = document.getElementById('computer-move-btn');
const modal = document.getElementById('split-modal');
const closeModal = document.getElementById('close-modal');
const selectedPileHeight = document.getElementById('selected-pile-height');
const newPilesInput = document.getElementById('new-piles-input');
const replaceBtn = document.getElementById('replace-btn');
const validationMessage = document.getElementById('validation-message');

let selectedPileIndex = -1;
let currentTurn = 'player'; // Tracks whose turn it is: 'player' or 'computer'

newGameBtn.addEventListener('click', () => {
    game.startNewGame();
    renderPiles();
    messageBox.textContent = "Your turn! Click on a pile to replace it.";
    messageBox.className = "message-box player-message";
    computerMoveBtn.disabled = true;
    currentTurn = 'player'; // Player starts the game
});

computerMoveBtn.addEventListener('click', () => {
    if (game.gameOver || currentTurn !== 'computer') return;

    const { originalHeight, newHeights } = game.makeComputerMove();
    const moveDescription = newHeights.length === 0
        ? `removed a pile of height ${originalHeight}.`
        : `replaced a pile of height ${originalHeight} with ${newHeights.join(', ')}.`;

    messageBox.textContent = `Computer ${moveDescription}`;
    messageBox.className = "message-box computer-message";
    renderPiles();

    if (game.isGameOver()) {
        endGame("Game over! Computer wins!");
    } else {
        currentTurn = 'player'; // Switch turn to player
        console.log("Player's turn");
        computerMoveBtn.disabled = true;
    }
});

closeModal.addEventListener('click', closeModalDialog);

replaceBtn.addEventListener('click', () => {
    if (selectedPileIndex === -1 || currentTurn !== 'player') return;

    const inputValue = newPilesInput.value.trim();
    if (!inputValue) {
        validationMessage.textContent = "Please enter at least one pile height or 0 to remove.";
        return;
    }

    const originalHeight = game.piles[selectedPileIndex];
    if (inputValue === "0") {
        game.removePile(selectedPileIndex);
        closeModalDialog();
        messageBox.textContent = `You removed a pile of height ${originalHeight}.`;
        renderPiles();

        if (game.isGameOver()) {
            endGame("Game over! You win!");
        } else {
            currentTurn = 'computer'; // Switch turn to computer
            computerMoveBtn.disabled = false;
        }
        return;
    }

    const newHeights = inputValue.split(/\s+/).map(Number);
    if (newHeights.some(isNaN)) {
        validationMessage.textContent = "All values must be numbers.";
        return;
    }
    if (newHeights.some(h => h <= 0)) {
        validationMessage.textContent = "All pile heights must be positive.";
        return;
    }
    if (newHeights.some(h => h >= originalHeight)) {
        validationMessage.textContent = `All new piles must be shorter than ${originalHeight}.`;
        return;
    }
    if (game.piles.length - 1 + newHeights.length > 20) {
        validationMessage.textContent = "The total number of piles cannot exceed 20.";
        return;
    }

    game.replacePile(selectedPileIndex, newHeights);
    closeModalDialog();
    messageBox.textContent = `You replaced a pile of height ${originalHeight} with ${newHeights.join(', ')}.`;
    renderPiles();

    if (game.isGameOver()) {
        endGame("Game over! You win!");
    } else {
        currentTurn = 'computer'; // Switch turn to computer
        computerMoveBtn.disabled = false;
    }
});

function renderPiles() {
    pilesContainer.innerHTML = '';
    game.piles.forEach((height, index) => {
        const pileDiv = document.createElement('div');
        pileDiv.className = 'pile';
        pileDiv.dataset.index = index;

        const countDiv = document.createElement('div');
        countDiv.className = 'pile-count';
        countDiv.textContent = height;
        pileDiv.appendChild(countDiv);

        for (let i = 0; i < height; i++) {
            const coinDiv = document.createElement('div');
            coinDiv.className = 'coin';
            pileDiv.appendChild(coinDiv);
        }

        if (!game.gameOver) {
            pileDiv.addEventListener('click', () => selectPile(index));
        }

        pilesContainer.appendChild(pileDiv);
    });
}

function selectPile(index) {
    if (game.gameOver || currentTurn == 'computer') return;

    selectedPileIndex = index;
    selectedPileHeight.textContent = game.piles[index];
    newPilesInput.value = '';
    validationMessage.textContent = '';

    modal.style.display = 'flex';
}

function closeModalDialog() {
    modal.style.display = 'none';
    selectedPileIndex = -1;
}

function endGame(message) {
    game.gameOver = true;
    messageBox.textContent = message;
    messageBox.className = "message-box game-over";
    computerMoveBtn.disabled = true;
}

// Initialize the game board
game.startNewGame();
renderPiles();