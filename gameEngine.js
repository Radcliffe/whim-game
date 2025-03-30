export class GameEngine {
    constructor() {
        this.piles = [];
        this.gameOver = false;
    }

    startNewGame() {
        const numPiles = Math.floor(Math.random() * 5) + 3;
        this.piles = Array.from({ length: numPiles }, () => Math.floor(Math.random() * 9) + 1);
        this.gameOver = false;
    }

    heightMultiplicities() {
        const heightCounts = {};
        this.piles.forEach(height => {
            heightCounts[height] = (heightCounts[height] || 0) + 1;
        });
        return heightCounts;
    }

    oddMultiplicityHeights() {
        const heightCounts = this.heightMultiplicities();
        return Object.keys(heightCounts)
            .filter(height => heightCounts[height] % 2 === 1)
            .map(Number);
    }

    isWinning() {
        // Check if the game is in a winning state.
        // A winning state is when there are odd multiplicities of heights.
        return this.oddMultiplicityHeights().length > 0;
    }

    isLosing() {
        // Check if the game is in a losing state.
        // A losing state is when all heights have even multiplicities.
        return !this.isWinning();
    }

    isGameOver() {
        return this.piles.length === 0;
    }

    replacePile(index, newHeights) {
        if (index < 0 || index >= this.piles.length) {
            throw new Error("Invalid pile index.");
        }

        const originalHeight = this.piles[index];
        this.piles.splice(index, 1, ...newHeights);
        return originalHeight;
    }

    removePile(index) {
        if (index < 0 || index >= this.piles.length) {
            throw new Error("Invalid pile index.");
        }

        const removedHeight = this.piles[index];
        this.piles.splice(index, 1);
        return removedHeight;
    }

    makeComputerMove() {
        const oddMultiplicityHeights = this.oddMultiplicityHeights();

        let targetIndex, newHeights;

        if (oddMultiplicityHeights.length > 0) {
            // Computer has a winning move
            const targetHeight = Math.max(...oddMultiplicityHeights);
            targetIndex = this.piles.findIndex(height => height === targetHeight);
            newHeights = oddMultiplicityHeights.filter(height => height < targetHeight);
        } else {
            targetIndex = Math.floor(Math.random() * this.piles.length);
            newHeights = [];
        }

        const originalHeight = this.piles[targetIndex];
        this.piles.splice(targetIndex, 1, ...newHeights);

        return {
            originalHeight,
            newHeights,
        };
    }
}