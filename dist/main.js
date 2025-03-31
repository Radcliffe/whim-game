/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gameEngine.js":
/*!***************************!*\
  !*** ./src/gameEngine.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GameEngine: () => (/* binding */ GameEngine)\n/* harmony export */ });\nclass GameEngine {\n    constructor() {\n        this.piles = [];\n        this.gameOver = false;\n        this.MAX_HEIGHT = 8;\n        this.MAX_PILES = 12;\n    }\n\n    startNewGame() {\n        const numPiles = Math.floor(Math.random() * 5) + 2;\n        this.piles = Array.from({ length: numPiles }, () => Math.floor(Math.random() * this.MAX_HEIGHT) + 1);\n        this.gameOver = false;\n    }\n\n    heightMultiplicities() {\n        const heightCounts = {};\n        this.piles.forEach(height => {\n            heightCounts[height] = (heightCounts[height] || 0) + 1;\n        });\n        return heightCounts;\n    }\n\n    oddMultiplicityHeights() {\n        const heightCounts = this.heightMultiplicities();\n        return Object.keys(heightCounts)\n            .filter(height => heightCounts[height] % 2 === 1)\n            .map(Number);\n    }\n\n    isWinning() {\n        // Check if the game is in a winning state.\n        // A winning state is when there are odd multiplicities of heights.\n        return this.oddMultiplicityHeights().length > 0;\n    }\n\n    isLosing() {\n        // Check if the game is in a losing state.\n        // A losing state is when all heights have even multiplicities.\n        return !this.isWinning();\n    }\n\n    isGameOver() {\n        return this.piles.length === 0;\n    }\n\n    replacePile(index, newHeights) {\n        if (index < 0 || index >= this.piles.length) {\n            throw new Error(\"Invalid pile index.\");\n        }\n\n        const originalHeight = this.piles[index];\n        this.piles.splice(index, 1, ...newHeights);\n        return originalHeight;\n    }\n\n    removePile(index) {\n        if (index < 0 || index >= this.piles.length) {\n            throw new Error(\"Invalid pile index.\");\n        }\n\n        const removedHeight = this.piles[index];\n        this.piles.splice(index, 1);\n        return removedHeight;\n    }\n\n    makeComputerMove() {\n        const oddMultiplicityHeights = this.oddMultiplicityHeights();\n\n        let targetIndex, newHeights;\n\n        if (oddMultiplicityHeights.length > 0) {\n            // Computer has a winning move\n            const targetHeight = Math.max(...oddMultiplicityHeights);\n            targetIndex = this.piles.findIndex(height => height === targetHeight);\n            newHeights = oddMultiplicityHeights.filter(height => height < targetHeight);\n        } else {\n            targetIndex = Math.floor(Math.random() * this.piles.length);\n            newHeights = [];\n        }\n\n        if (this.piles.length + newHeights.length - 1 > this.MAX_PILES) {\n            // truncate newHeights to fit within the limit\n            newHeights = newHeights.slice(0, this.MAX_PILES - this.piles.length + 1);\n        }\n\n        const originalHeight = this.piles[targetIndex];\n        this.piles.splice(targetIndex, 1, ...newHeights);\n\n        return {\n            originalHeight,\n            newHeights,\n        };\n    }\n}\n\n//# sourceURL=webpack://whim-game/./src/gameEngine.js?");

/***/ }),

/***/ "./src/gameUI.js":
/*!***********************!*\
  !*** ./src/gameUI.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GameUI: () => (/* binding */ GameUI)\n/* harmony export */ });\nclass GameUI {\n    constructor(game, doc) {\n        this.game = game;\n\n        // DOM elements\n        this.pilesContainer = doc.getElementById('piles-container');\n        this.messageBox = doc.getElementById('message');\n        this.newGameBtn = doc.getElementById('new-game-btn');\n        this.computerMoveBtn = doc.getElementById('computer-move-btn');\n        this.modal = doc.getElementById('split-modal');\n        this.closeModal = doc.getElementById('close-modal');\n        this.selectedPileHeight = doc.getElementById('selected-pile-height');\n        this.newPilesInput = doc.getElementById('new-piles-input');\n        this.replaceBtn = doc.getElementById('replace-btn');\n        this.validationMessage = doc.getElementById('validation-message');\n\n        this.selectedPileIndex = -1;\n        this.currentTurn = 'player'; // Tracks whose turn it is: 'player' or 'computer'\n\n        this.initializeEventListeners();\n    }\n\n    initializeEventListeners() {\n        this.newGameBtn.addEventListener('click', () => this.startNewGame());\n        this.computerMoveBtn.addEventListener('click', () => this.handleComputerMove());\n        this.closeModal.addEventListener('click', () => this.closeModalDialog());\n        this.replaceBtn.addEventListener('click', () => this.handleReplacePile());\n    }\n\n    startNewGame() {\n        this.game.startNewGame();\n        this.renderPiles();\n        this.messageBox.textContent = \"Your turn! Click on a pile to replace it.\";\n        this.messageBox.className = \"message-box player-message\";\n        this.computerMoveBtn.disabled = false;\n        this.currentTurn = 'either'; // Either player can start the game\n    }\n\n    handleComputerMove() {\n        if (this.game.isGameOver() || this.currentTurn == 'human') return;\n        const { originalHeight, newHeights } = this.game.makeComputerMove();\n        const moveDescription = newHeights.length === 0\n            ? `removed a pile of height ${originalHeight}.`\n            : `replaced a pile of height ${originalHeight} with ${newHeights.join(', ')}.`;\n\n\n        this.messageBox.textContent = `Computer ${moveDescription}`;\n        this.messageBox.className = \"message-box computer-message\";\n        this.renderPiles();\n\n        if (this.game.isGameOver()) {\n            this.endGame(\"Game over! Computer wins!\");\n        } else {\n            this.currentTurn = 'player'; // Switch turn to player\n            this.computerMoveBtn.disabled = true;\n        }\n    }\n\n    handleReplacePile() {\n        if (this.selectedPileIndex === -1 || this.currentTurn === 'computer') return;\n\n        const inputValue = this.newPilesInput.value.trim();\n        if (!inputValue) {\n            this.validationMessage.textContent = \"Please enter at least one pile height or 0 to remove.\";\n            return;\n        }\n\n        const originalHeight = this.game.piles[this.selectedPileIndex];\n        if (inputValue === \"0\") {\n            this.game.removePile(this.selectedPileIndex);\n            this.closeModalDialog();\n            this.messageBox.textContent = `You removed a pile of height ${originalHeight}.`;\n            this.renderPiles();\n\n            if (this.game.isGameOver()) {\n                this.endGame(\"Game over! You win!\");\n            } else {\n                this.currentTurn = 'computer'; // Switch turn to computer\n                this.computerMoveBtn.disabled = false;\n            }\n            return;\n        }\n\n        if (!/^[0-9\\s]+$/.test(inputValue)) {\n            this.validationMessage.textContent = \"Please enter valid pile heights (digits only).\";\n            return;\n        }\n        const newHeights = inputValue.split(/\\s+/).map(Number);\n        if (newHeights.some(isNaN) || newHeights.some(h => h <= 0) || newHeights.some(h => h >= originalHeight)) {\n            this.validationMessage.textContent = \"Invalid pile heights. Ensure all are positive and less than the original height.\";\n            return;\n        }\n        if (this.game.piles.length - 1 + newHeights.length > 12) {\n            this.validationMessage.textContent = \"The total number of piles cannot exceed 12.\";\n            return;\n        }\n\n        this.game.replacePile(this.selectedPileIndex, newHeights);\n        this.closeModalDialog();\n        this.messageBox.textContent = `You replaced a pile of height ${originalHeight} with ${newHeights.join(', ')}.`;\n        this.renderPiles();\n\n        if (this.game.isGameOver()) {\n            this.endGame(\"Game over! You win!\");\n        } else {\n            this.currentTurn = 'computer'; // Switch turn to computer\n            this.computerMoveBtn.disabled = false;\n        }\n    }\n\n    renderPiles() {\n        this.pilesContainer.innerHTML = '';\n        this.game.piles.forEach((height, index) => {\n            const pileDiv = document.createElement('div');\n            pileDiv.className = 'pile';\n            pileDiv.dataset.index = index;\n\n            const countDiv = document.createElement('div');\n            countDiv.className = 'pile-count';\n            countDiv.textContent = height;\n            pileDiv.appendChild(countDiv);\n\n            for (let i = 0; i < height; i++) {\n                const coinDiv = document.createElement('div');\n                coinDiv.className = 'coin';\n                pileDiv.appendChild(coinDiv);\n            }\n\n            if (!this.game.gameOver) {\n                pileDiv.addEventListener('click', () => this.selectPile(index));\n            }\n\n            this.pilesContainer.appendChild(pileDiv);\n        });\n    }\n\n    selectPile(index) {\n        if (this.game.gameOver || this.currentTurn === 'computer') return;\n\n        this.selectedPileIndex = index;\n        this.selectedPileHeight.textContent = this.game.piles[index];\n        this.newPilesInput.value = '';\n        this.validationMessage.textContent = '';\n\n        this.modal.style.display = 'flex';\n    }\n\n    closeModalDialog() {\n        this.modal.style.display = 'none';\n        this.selectedPileIndex = -1;\n    }\n\n    endGame(message) {\n        this.game.gameOver = true;\n        this.messageBox.textContent = message;\n        this.messageBox.className = \"message-box game-over\";\n        this.computerMoveBtn.disabled = true;\n    }\n}\n\n\n//# sourceURL=webpack://whim-game/./src/gameUI.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _gameEngine_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameEngine.js */ \"./src/gameEngine.js\");\n/* harmony import */ var _gameUI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameUI.js */ \"./src/gameUI.js\");\n\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n    const game = new _gameEngine_js__WEBPACK_IMPORTED_MODULE_0__.GameEngine();\n    const gameUI = new _gameUI_js__WEBPACK_IMPORTED_MODULE_1__.GameUI(game, document);\n    gameUI.startNewGame();\n});\n\n\n//# sourceURL=webpack://whim-game/./src/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.js");
/******/ 	
/******/ })()
;