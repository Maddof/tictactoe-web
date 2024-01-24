const game = (function () {
  const rows = 3;
  const columns = 3;
  const cellContent = "";
  let board = [];
  let stopPlay;

  // creating two-dimensional array
  const createBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i][j] = cellContent;
      }
    }
  };
  createBoard();
  console.log(board);
  const getBoard = () => board;
  const getBoardLength = () => board.length;

  // Checking for roundchecker before the play,
  // If roundchecker cant play, we set stopPlay to true to stop
  // the computer from playing so player can play again.
  const updateBoard = (r, c, currentMarker) => {
    if (!roundChecker(r, c)) {
      controls.errorMsgPara.textContent = "Cant play that";
      stopPlay = true;
    } else {
      controls.errorMsgPara.textContent = "";
      stopPlay = false;
      return (board[r][c] = currentMarker);
    }
  };

  // True if computer is not allowed to play after checking
  // if player hit the same marker.
  const stopComputerRound = () => stopPlay;

  const renderBoard = () => {
    const buttons = controls.buttons;
    for (let i = 0; i < buttons.length; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      buttons[i].textContent = board[row][col];
    }
  };

  return {
    getBoard,
    updateBoard,
    getBoardLength,
    stopComputerRound,
    createBoard,
    renderBoard,
  };
})();

const players = (function (pName = "Player") {
  const players = [
    {
      name: pName,
      marker: "X",
    },
    {
      name: "Comp",
      marker: "O",
      aidiff: "easy",
    },
  ];
  const setPlayerName = (pName) => {
    return (players[0].name = pName);
  };

  const setAiDiff = (setdiff) => {
    return (players[1].aidiff = setdiff);
  };

  const getPlayerName = () => players[0].name;
  const getCompName = () => players[1].name;
  const getPlayerMarker = () => players[0].marker;
  const getCompMarker = () => players[1].marker;
  const getAiDiff = () => players[1].aidiff;

  return {
    setPlayerName,
    getPlayerName,
    getCompName,
    getPlayerMarker,
    getCompMarker,
    setAiDiff,
    getAiDiff,
  };
})();

const controls = (function () {
  const buttons = document.querySelectorAll(".cell");
  buttons.forEach((button, i) => {
    button.addEventListener("click", () => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      button.classList.add("puff-in-center");
      playRound(row, col);
    });
  });

  const dialog = document.querySelector("dialog");
  const showButton = document.querySelector("dialog + button");
  const closeBtn = document.getElementById("close-modal-btn");
  const resetGameBtn = document.getElementById("reset-game-btn");
  const winnerMsgPara = document.getElementById("winner-msg");
  const errorMsgPara = document.getElementById("error-msg");
  const winnerImg = document.getElementById("winner-img-wrapper");
  const form = document.getElementById("form-name");
  const formInput = document.getElementById("playername");
  const playerNameTitle = document.getElementById("playername-title");
  const aiDiffDesc = document.getElementById("ai-diff-desc");
  const formAi = document.getElementById("form-ai");
  const formAiSelect = document.getElementById("ai-diff-select");

  formAi.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(formAiSelect.value);
    players.setAiDiff(formAiSelect.value);
    aiDiffDesc.textContent = `
      Ai difficulty: ${players.getAiDiff()}
    `;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    players.setPlayerName(formInput.value);
    form.reset();
    playerNameTitle.textContent = `
      Your name: ${players.getPlayerName()}
    `;
  });

  // "Show the dialog" button opens the dialog modally
  showButton.addEventListener("click", () => {
    dialog.showModal();
  });
  const displayWinner = (winMsg, winnerName) => {
    resetGameBtn.innerText = "Play again";
    winnerMsgPara.textContent = winMsg;
    if (winnerName === players.getPlayerName()) {
      winnerImg.innerHTML = `
      <img src="gifs/win.gif" alt="winner" class="giffy" />
      `;
    } else if (winnerName === players.getCompName()) {
      winnerImg.innerHTML = `
      <img src="gifs/lost.gif" alt="lost" class="giffy" />
      `;
    } else {
      winnerImg.innerHTML = `
      <img src="gifs/draw.gif" alt="draw" class="giffy" />
      `;
    }
  };

  const showDialog = () => dialog.showModal();

  // "Close" button closes the dialog
  closeBtn.addEventListener("click", () => {
    dialog.close();
  });

  resetGameBtn.addEventListener("click", () => {
    winnerMsgPara.textContent = "Options";
    errorMsgPara.textContent = "";
    resetGameBtn.textContent = "Reset board";
    winnerImg.innerHTML = ``;
    buttons.forEach((button) => {
      button.classList.remove("puff-in-center");
    });
    game.createBoard();
    game.renderBoard();
    dialog.close();
  });

  return { buttons, showDialog, displayWinner, errorMsgPara };
})();

function playRound(r, c) {
  game.updateBoard(r, c, players.getPlayerMarker());
  const winner = checkWinner();

  if (winner === null && checkDraw()) {
    controls.displayWinner("DRAW!");
    game.renderBoard();
    game.createBoard();
    controls.showDialog();
    // We return nothing to finish code execution and not check
    // anything else or play other rounds.
    return;
  }

  if (winner) {
    const winnerName = players.getPlayerName();
    controls.displayWinner("You are the champ!", winnerName);
    game.renderBoard();
    game.createBoard();
    controls.showDialog();
    return;
  } else {
    computerPlays();
    const compWinner = checkWinner();

    if (compWinner) {
      const winnerName = players.getCompName();
      controls.displayWinner("Dammit!", winnerName);
      game.renderBoard();
      game.createBoard();
      controls.showDialog();
      return;
    } else {
      game.renderBoard();
    }
  }
}

function computerPlays() {
  // Take the exposed boolen value of letting computer play
  let currentStatus = game.stopComputerRound();

  // If boolean is true, computer wont play and we skip.
  if (!currentStatus) {
    // If player has set AI diff to hard we do some extra checking
    if (players.getAiDiff() == "hard") {
      let winningMove = findWinningMove(players.getCompMarker());
      if (winningMove) {
        game.updateBoard(
          winningMove.row,
          winningMove.col,
          players.getCompMarker()
        );
        return;
      } else {
        let blockingMove = findWinningMove(players.getPlayerMarker());
        if (blockingMove) {
          game.updateBoard(
            blockingMove.row,
            blockingMove.col,
            players.getCompMarker()
          );
          return;
        }
      }
    }
    // Basically we are testing the roundchecker function
    // multiple times until we get a true (which we flip to false to stop)
    // Then we know computer is allowed to play
    let randomRow, randomCol;
    do {
      randomRow = Math.floor(Math.random() * game.getBoardLength());
      randomCol = Math.floor(Math.random() * game.getBoardLength());
    } while (!roundChecker(randomRow, randomCol));

    game.updateBoard(randomRow, randomCol, players.getCompMarker());
  } else {
    console.log("Computer skipped");
  }
}

// Helper function for finding a winning move or a
// blocking move

function findWinningMove(marker) {
  let board = game.getBoard();

  // Check rows and columns for a winning move
  for (let i = 0; i < game.getBoardLength(); i++) {
    // Check rows
    if (
      board[i][0] === marker &&
      board[i][1] === marker &&
      board[i][2] === ""
    ) {
      return { row: i, col: 2 };
    }
    if (
      board[i][0] === marker &&
      board[i][2] === marker &&
      board[i][1] === ""
    ) {
      return { row: i, col: 1 };
    }
    if (
      board[i][1] === marker &&
      board[i][2] === marker &&
      board[i][0] === ""
    ) {
      return { row: i, col: 0 };
    }

    // Check columns
    if (
      board[0][i] === marker &&
      board[1][i] === marker &&
      board[2][i] === ""
    ) {
      return { row: 2, col: i };
    }
    if (
      board[0][i] === marker &&
      board[2][i] === marker &&
      board[1][i] === ""
    ) {
      return { row: 1, col: i };
    }
    if (
      board[1][i] === marker &&
      board[2][i] === marker &&
      board[0][i] === ""
    ) {
      return { row: 0, col: i };
    }
  }

  // Check diagonals for a winning move
  if (board[0][0] === marker && board[1][1] === marker && board[2][2] === "") {
    return { row: 2, col: 2 };
  }
  if (board[0][0] === marker && board[2][2] === marker && board[1][1] === "") {
    return { row: 1, col: 1 };
  }
  if (board[1][1] === marker && board[2][2] === marker && board[0][0] === "") {
    return { row: 0, col: 0 };
  }

  if (board[0][2] === marker && board[1][1] === marker && board[2][0] === "") {
    return { row: 2, col: 0 };
  }
  if (board[0][2] === marker && board[2][0] === marker && board[1][1] === "") {
    return { row: 1, col: 1 };
  }
  if (board[1][1] === marker && board[2][0] === marker && board[0][2] === "") {
    return { row: 0, col: 2 };
  }

  return null;
}

function roundChecker(r, c) {
  let board = game.getBoard();
  if (r > 3 || c > 3 || r < 0 || c < 0) {
    return false;
  } else if (board[r][c] === "X" || board[r][c] === "O") {
    return false;
  } else {
    return true;
  }
}

function checkWinner() {
  let board = game.getBoard();
  // Check rows and columns
  for (let i = 0; i < game.getBoardLength(); i++) {
    if (
      (board[i][0] === board[i][1] && board[i][1] === board[i][2]) ||
      (board[0][i] === board[1][i] && board[1][i] === board[2][i])
    ) {
      return board[i][i]; // Returns the winner marker ('X' or 'O')
    }
  }

  // Check diagonals
  if (
    (board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
    (board[0][2] === board[1][1] && board[1][1] === board[2][0])
  ) {
    return board[1][1]; // Returns the winner marker ('X' or 'O')
  }

  return null; // No winner yet
}

function checkDraw() {
  const board = game.getBoard();

  let count = 0;
  for (let row of board) {
    for (let col of row) {
      if (col === "X" || col === "O") {
        count++;
      }
    }
  }
  if (count === 9) {
    return true;
  }
}
