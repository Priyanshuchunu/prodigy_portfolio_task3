const board = document.getElementById("board");
const statusText = document.getElementById("status");

let currentPlayer = "X"; // Player is always X
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const WINNING_COMBOS = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function handleClick(cell, index) {
  if (gameState[index] !== "" || !gameActive || currentPlayer !== "X") return;

  makeMove(index, "X");

  if (checkWin("X")) {
    statusText.textContent = "You win! 🎉";
    gameActive = false;
    return;
  }

  if (isDraw()) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "O";
  statusText.textContent = "AI is thinking...";

  setTimeout(() => {
    const bestMove = getBestMove();
    makeMove(bestMove, "O");

    if (checkWin("O")) {
      statusText.textContent = "AI wins! 💻";
      gameActive = false;
    } else if (isDraw()) {
      statusText.textContent = "It's a draw!";
      gameActive = false;
    } else {
      currentPlayer = "X";
      statusText.textContent = "Your turn";
    }
  }, 500);
}

function makeMove(index, player) {
  gameState[index] = player;
  board.children[index].textContent = player;
}

function checkWin(player) {
  return WINNING_COMBOS.some(([a, b, c]) =>
    gameState[a] === player &&
    gameState[b] === player &&
    gameState[c] === player
  );
}

function isDraw() {
  return gameState.every(cell => cell !== "");
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") {
      gameState[i] = "O";
      let score = minimax(gameState, 0, false);
      gameState[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(state, depth, isMaximizing) {
  if (checkWin("O")) return 10 - depth;
  if (checkWin("X")) return depth - 10;
  if (isDraw()) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (state[i] === "") {
        state[i] = "O";
        best = Math.max(best, minimax(state, depth + 1, false));
        state[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (state[i] === "") {
        state[i] = "X";
        best = Math.min(best, minimax(state, depth + 1, true));
        state[i] = "";
      }
    }
    return best;
  }
}

function createBoard() {
  board.innerHTML = "";
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  statusText.textContent = "Your turn";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => handleClick(cell, i));
    board.appendChild(cell);
  }
}

function restartGame() {
  createBoard();
}

createBoard();
