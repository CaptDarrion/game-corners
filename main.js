class Game {
  constructor(size = 8) {
    this.size = size;
    this.board = [];
    this.selected = null;
    this.currentPlayer = 1;
    this.hasJumpedYet = false;
    this.canChangePiece = true;

    this.boardEl = document.getElementById("board");
    this.statusEl = document.getElementById("status");
    this.endTurnBtn = document.getElementById("endTurnBtn");

    this.endTurnBtn.addEventListener("click", () => {
      this.selected = null;
      this.endTurn();
    });

    this.createBoard();
    this.renderBoard();
  }

  createBoard() {
    this.board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(null)
    );
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        this.board[r][c] = 1;
      }
    }
    for (let r = this.size - 3; r < this.size; r++) {
      for (let c = this.size - 4; c < this.size; c++) {
        this.board[r][c] = 2;
      }
    }
  }

  renderBoard() {
    this.boardEl.innerHTML = "";
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.row = r;
        cell.dataset.col = c;

        const piece = this.board[r][c];
        if (piece) {
          const el = document.createElement("div");
          el.className = `piece player${piece}`;
          if (this.selected && this.selected.r === r && this.selected.c === c) {
            el.classList.add("selected");
          }
          cell.appendChild(el);
        }

        cell.addEventListener("click", this.onCellClick.bind(this));
        this.boardEl.appendChild(cell);
      }
    }

    this.endTurnBtn.disabled = !this.selected || !this.canChangePiece;
  }

  onCellClick(e) {
    const r = parseInt(e.currentTarget.dataset.row);
    const c = parseInt(e.currentTarget.dataset.col);
    const piece = this.board[r][c];

    // Если кликнули по уже выбранной фишке — снимаем выделение
    if (this.selected && this.selected.r === r && this.selected.c === c) {
      this.selected = null;
      this.renderBoard();
      return;
    }

    if (this.selected) {
      if (this.isValidJump(this.selected.r, this.selected.c, r, c)) {
        this.board[r][c] = this.currentPlayer;
        this.board[this.selected.r][this.selected.c] = null;
        this.selected = { r, c };
        this.hasJumpedYet = true;
        this.endTurnBtn.disabled = false;
      } else if (
        !this.hasJumpedYet &&
        this.isValidMove(this.selected.r, this.selected.c, r, c)
      ) {
        this.board[r][c] = this.currentPlayer;
        this.board[this.selected.r][this.selected.c] = null;
        this.selected = null;
        this.endTurn();
      }
    } else if (piece === this.currentPlayer) {
      this.selected = { r, c };
    }

    this.renderBoard();
  }

  endTurn() {
    this.hasJumpedYet = false;
    this.canChangePiece = true;
    this.endTurnBtn.disabled = true;
    this.selected = null;

    if (this.checkWin(this.currentPlayer)) {
      this.statusEl.textContent = `Виграв гравець ${this.currentPlayer}!`;
      this.boardEl.style.pointerEvents = "none";
    } else {
      this.currentPlayer = 3 - this.currentPlayer;
      this.statusEl.textContent = `Хід гравця ${this.currentPlayer} (${
        this.currentPlayer === 1 ? "червоний" : "синій"
      })`;
    }
  }

  isValidMove(r1, c1, r2, c2) {
    const dr = Math.abs(r2 - r1);
    const dc = Math.abs(c2 - c1);
    return dr + dc === 1 && !this.board[r2][c2];
  }

  isValidJump(fromR, fromC, toR, toC) {
    const dr = toR - fromR;
    const dc = toC - fromC;
    if (Math.abs(dr) !== 2 && Math.abs(dc) !== 2) return false;

    const midR = fromR + dr / 2;
    const midC = fromC + dc / 2;

    return (
      midR >= 0 &&
      midR < this.size &&
      midC >= 0 &&
      midC < this.size &&
      this.board[midR][midC] !== null &&
      this.board[toR][toC] === null
    );
  }

  getAvailableJumps(r, c, visited = new Set()) {
    const jumps = [];
    const key = `${r},${c}`;
    if (visited.has(key)) return [];
    visited.add(key);

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];

    for (const [dr, dc] of directions) {
      const midR = r + dr;
      const midC = c + dc;
      const landingR = r + dr * 2;
      const landingC = c + dc * 2;

      if (
        landingR >= 0 &&
        landingR < this.size &&
        landingC >= 0 &&
        landingC < this.size &&
        this.board[midR]?.[midC] !== null &&
        this.board[landingR][landingC] === null
      ) {
        const landingKey = `${landingR},${landingC}`;
        if (!visited.has(landingKey)) {
          jumps.push({ r: landingR, c: landingC });
          jumps.push(
            ...this.getAvailableJumps(landingR, landingC, new Set(visited))
          );
        }
      }
    }

    return jumps;
  }

  checkWin(player) {
    const target =
      player === 1
        ? { rows: [5, 6, 7], cols: [4, 5, 6, 7] }
        : { rows: [0, 1, 2], cols: [0, 1, 2, 3] };

    let count = 0;
    for (let r of target.rows) {
      for (let c of target.cols) {
        if (this.board[r][c] === player) count++;
      }
    }

    return count === 12;
  }
}

new Game();
