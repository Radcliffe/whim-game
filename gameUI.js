export class GameUI {
    constructor(game, doc) {
        this.game = game;

        // DOM elements
        this.pilesContainer = doc.getElementById('piles-container');
        this.messageBox = doc.getElementById('message');
        this.newGameBtn = doc.getElementById('new-game-btn');
        this.computerMoveBtn = doc.getElementById('computer-move-btn');
        this.modal = doc.getElementById('split-modal');
        this.closeModal = doc.getElementById('close-modal');
        this.selectedPileHeight = doc.getElementById('selected-pile-height');
        this.newPilesInput = doc.getElementById('new-piles-input');
        this.replaceBtn = doc.getElementById('replace-btn');
        this.validationMessage = doc.getElementById('validation-message');

        this.selectedPileIndex = -1;
        this.currentTurn = 'player'; // Tracks whose turn it is: 'player' or 'computer'

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.computerMoveBtn.addEventListener('click', () => this.handleComputerMove());
        this.closeModal.addEventListener('click', () => this.closeModalDialog());
        this.replaceBtn.addEventListener('click', () => this.handleReplacePile());
    }

    startNewGame() {
        this.game.startNewGame();
        this.renderPiles();
        this.messageBox.textContent = "Your turn! Click on a pile to replace it.";
        this.messageBox.className = "message-box player-message";
        this.computerMoveBtn.disabled = true;
        this.currentTurn = 'player'; // Player starts the game
    }

    handleComputerMove() {
        if (this.game.isGameOver() || this.currentTurn !== 'computer') return;
        const { originalHeight, newHeights } = this.game.makeComputerMove();
        const moveDescription = newHeights.length === 0
            ? `removed a pile of height ${originalHeight}.`
            : `replaced a pile of height ${originalHeight} with ${newHeights.join(', ')}.`;


        this.messageBox.textContent = `Computer ${moveDescription}`;
        this.messageBox.className = "message-box computer-message";
        this.renderPiles();

        if (this.game.isGameOver()) {
            this.endGame("Game over! Computer wins!");
        } else {
            this.currentTurn = 'player'; // Switch turn to player
            this.computerMoveBtn.disabled = true;
        }
    }

    handleReplacePile() {
        if (this.selectedPileIndex === -1 || this.currentTurn !== 'player') return;

        const inputValue = this.newPilesInput.value.trim();
        if (!inputValue) {
            this.validationMessage.textContent = "Please enter at least one pile height or 0 to remove.";
            return;
        }

        const originalHeight = this.game.piles[this.selectedPileIndex];
        if (inputValue === "0") {
            this.game.removePile(this.selectedPileIndex);
            this.closeModalDialog();
            this.messageBox.textContent = `You removed a pile of height ${originalHeight}.`;
            this.renderPiles();

            if (this.game.isGameOver()) {
                this.endGame("Game over! You win!");
            } else {
                this.currentTurn = 'computer'; // Switch turn to computer
                this.computerMoveBtn.disabled = false;
            }
            return;
        }

        if (!/^[0-9\s]+$/.test(inputValue)) {
            this.validationMessage.textContent = "Please enter valid pile heights (digits only).";
            return;
        }
        const newHeights = inputValue.split(/\s+/).map(Number);
        if (newHeights.some(isNaN) || newHeights.some(h => h <= 0) || newHeights.some(h => h >= originalHeight)) {
            this.validationMessage.textContent = "Invalid pile heights. Ensure all are positive and less than the original height.";
            return;
        }
        if (this.game.piles.length - 1 + newHeights.length > 12) {
            this.validationMessage.textContent = "The total number of piles cannot exceed 12.";
            return;
        }

        this.game.replacePile(this.selectedPileIndex, newHeights);
        this.closeModalDialog();
        this.messageBox.textContent = `You replaced a pile of height ${originalHeight} with ${newHeights.join(', ')}.`;
        this.renderPiles();

        if (this.game.isGameOver()) {
            this.endGame("Game over! You win!");
        } else {
            this.currentTurn = 'computer'; // Switch turn to computer
            this.computerMoveBtn.disabled = false;
        }
    }

    renderPiles() {
        this.pilesContainer.innerHTML = '';
        this.game.piles.forEach((height, index) => {
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

            if (!this.game.gameOver) {
                pileDiv.addEventListener('click', () => this.selectPile(index));
            }

            this.pilesContainer.appendChild(pileDiv);
        });
    }

    selectPile(index) {
        if (this.game.gameOver || this.currentTurn === 'computer') return;

        this.selectedPileIndex = index;
        this.selectedPileHeight.textContent = this.game.piles[index];
        this.newPilesInput.value = '';
        this.validationMessage.textContent = '';

        this.modal.style.display = 'flex';
    }

    closeModalDialog() {
        this.modal.style.display = 'none';
        this.selectedPileIndex = -1;
    }

    endGame(message) {
        this.game.gameOver = true;
        this.messageBox.textContent = message;
        this.messageBox.className = "message-box game-over";
        this.computerMoveBtn.disabled = true;
    }
}
