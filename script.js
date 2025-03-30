// Game state
let piles = [];
let gameOver = false;
let selectedPileIndex = -1;

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

// Initialize game
newGameBtn.addEventListener('click', startNewGame);
computerMoveBtn.addEventListener('click', makeComputerMove);
closeModal.addEventListener('click', closeModalDialog);
replaceBtn.addEventListener('click', replacePile);

function startNewGame() {
    // Generate random initial piles (between 3 and 7 piles)
    const numPiles = Math.floor(Math.random() * 5) + 3;
    piles = [];
    
    for (let i = 0; i < numPiles; i++) {
        // Random pile height between 1 and 9
        piles.push(Math.floor(Math.random() * 9) + 1);
    }
    
    gameOver = false;
    renderPiles();
    messageBox.textContent = "Your turn! Click on a pile to replace it.";
    messageBox.className = "message-box player-message";
    computerMoveBtn.disabled = true;
}

function renderPiles() {
    pilesContainer.innerHTML = '';
    
    piles.forEach((height, index) => {
        const pileDiv = document.createElement('div');
        pileDiv.className = 'pile';
        pileDiv.dataset.index = index;
        
        const countDiv = document.createElement('div');
        countDiv.className = 'pile-count';
        countDiv.textContent = height;
        pileDiv.appendChild(countDiv);
        
        // Create coins
        for (let i = 0; i < height; i++) {
            const coinDiv = document.createElement('div');
            coinDiv.className = 'coin';
            pileDiv.appendChild(coinDiv);
        }
        
        if (!gameOver) {
            pileDiv.addEventListener('click', () => selectPile(index));
        }
        
        pilesContainer.appendChild(pileDiv);
    });
}

function selectPile(index) {
    if (gameOver) return;
    
    selectedPileIndex = index;
    selectedPileHeight.textContent = piles[index];
    newPilesInput.value = '';
    validationMessage.textContent = '';
    
    modal.style.display = 'flex';
}

function closeModalDialog() {
    modal.style.display = 'none';
    selectedPileIndex = -1;
}

function replacePile() {
    if (selectedPileIndex === -1) return;
    
    const originalHeight = piles[selectedPileIndex];
    const inputValue = newPilesInput.value.trim();
    
    if (!inputValue) {
        validationMessage.textContent = "Please enter at least one pile height or 0 to remove.";
        return;
    }
    
    // Check if player wants to remove the pile
    if (inputValue === "0") {
        // Remove the selected pile
        piles.splice(selectedPileIndex, 1);
        closeModalDialog();
        messageBox.textContent = `You removed a pile of height ${originalHeight}.`;
        renderPiles();
        
        // Check if the game is over
        if (isGameOver()) {
            endGame("Game over! You win!");
            return;
        }
        
        // Enable computer's move
        computerMoveBtn.disabled = false;
        return;
    }
    
    // Parse the input values
    const newHeights = inputValue.split(/\s+/).map(Number);
    
    // Validate input
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
    
    if (piles.length - 1 + newHeights.length > 20) {
        validationMessage.textContent = "The total number of piles cannot exceed 20.";
        return;
    }
    
    // Remove the selected pile
    piles.splice(selectedPileIndex, 1);
    
    // Add the new piles
    piles.push(...newHeights);
    
    // Close the modal
    closeModalDialog();
    
    // Update game state
    messageBox.textContent = `You replaced a pile of height ${originalHeight} with ${newHeights.join(', ')}.`;
    renderPiles();
    
    // Check if the game is over
    if (isGameOver()) {
        endGame("You");
        return;
    }
    
    // Enable computer's move
    computerMoveBtn.disabled = false;
}

function makeComputerMove() {
    if (gameOver) return;
    
    // Computer's strategy:
    // 1. Find the highest pile with odd multiplicity
    // 2. If not possible, remove a random pile
    
    // Count occurrences of each pile height
    const heightCounts = {};
    piles.forEach(height => {
        heightCounts[height] = (heightCounts[height] || 0) + 1;
    });
    
    // Find piles with odd multiplicity
    const oddMultiplicityHeights = Object.keys(heightCounts)
        .filter(height => heightCounts[height] % 2 === 1)
        .map(Number);
    
    let targetIndex, newHeights;
    
    if (oddMultiplicityHeights.length > 0) {
        // Find the highest pile with odd multiplicity
        const targetHeight = Math.max(...oddMultiplicityHeights);
        targetIndex = piles.findIndex(height => height === targetHeight);
        
        // Replace with a pile that has even multiplicity, or a pile that's one shorter
        if (targetHeight > 1) {
            // We'll replace it with a new pile of each odd multiplicity height less than the target height
            newHeights = oddMultiplicityHeights.filter(height => height < targetHeight);
        } else {
            // If the height is 1, we'll just remove it
            newHeights = [];
        }
    } else {
        // No pile with odd multiplicity, so remove a random pile
        targetIndex = Math.floor(Math.random() * piles.length);
        newHeights = []; // Empty array to remove the pile
    }
    
    // Execute the move
    const originalHeight = piles[targetIndex];
    piles.splice(targetIndex, 1);
    piles.push(...newHeights);
    
    let moveDescription;
    if (newHeights.length === 0) {
        moveDescription = `removed a pile of height ${originalHeight}.`;
    } else {
        moveDescription = `replaced a pile of height ${originalHeight} with ${newHeights.join(', ')}.`;
    }
    
    messageBox.textContent = `Computer ${moveDescription}`;
    messageBox.className = "message-box computer-message";
    renderPiles();
    
    // Check if the game is over
    if (isGameOver()) {
        endGame("Game over! Computer wins!");
        return;
    }
    
    // Disable the computer move button until the player makes a move
    computerMoveBtn.disabled = true;
}

function isGameOver() {
    // Game is over when all coins are gone
    return piles.length === 0 || piles.every(height => height === 0);
}

function endGame(message) {
    gameOver = true;
    messageBox.textContent = message;
    messageBox.className = "message-box game-over";
    computerMoveBtn.disabled = true;
}

// Initialize the game board
startNewGame();