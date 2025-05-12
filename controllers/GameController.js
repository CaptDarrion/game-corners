// src/controllers/GameController.js
import Board from "../models/Board.js";
import MoveValidator from "../rules/MoveValidator.js";

export default class GameController {
  constructor(uiController) {
    this.board = new Board();
    this.currentPlayer = 1;
    this.selected = null;
    this.hasJumped = false;
    this.ui = uiController;
    this.prevJumpFrom = null;
    this._init();
  }

  _init() {
    this.ui.bindCellClick(this.handleCellClick.bind(this));
    this.ui.bindEndTurn(this.endTurn.bind(this));
    this.ui.updateStatus(`Хід гравця ${this.currentPlayer}`);
    this._render();
  }

  handleCellClick(r, c) {
    const piece = this.board.getPiece(r, c);
    const pos = { r, c };

    if (!this.selected && piece !== this.currentPlayer) return;
    if (this.selected && this.selected.r === r && this.selected.c === c) {
      this.selected = null;
      return this._render();
    }

    if (this.selected) {
      if (
        this.prevJumpFrom &&
        pos.r === this.prevJumpFrom.r &&
        pos.c === this.prevJumpFrom.c
      ) {
        return;
      }

      if (MoveValidator.isValidJump(this.board, this.selected, pos)) {
        this.prevJumpFrom = { ...this.selected };

        this.board.movePiece(this.selected, pos);
        this.selected = pos;
        this.hasJumped = true;

        const further = MoveValidator.getAvailableJumps(
          this.board,
          this.selected
        );
        if (further.length > 0) {
          return this._render();
        } else {
          this.prevJumpFrom = null;
          this.selected = null;
          return this.endTurn();
        }
      }

      if (
        !this.hasJumped &&
        MoveValidator.isValidMove(this.board, this.selected, pos)
      ) {
        this.prevJumpFrom = null;
        this.board.movePiece(this.selected, pos);
        this.selected = null;
        return this.endTurn();
      }

      return;
    }

    if (piece === this.currentPlayer) {
      this.selected = pos;
      this.prevJumpFrom = null;
    }

    this._render();
  }
  endTurn() {
    this.hasJumped = false;
    this.prevJumpFrom = null;
    this.selected = null;

    if (this._checkWin(this.currentPlayer)) {
      this.ui.updateStatus(`Виграв гравець ${this.currentPlayer}!`);
      return this.ui.disable();
    }
    this.currentPlayer = 3 - this.currentPlayer;
    this.ui.updateStatus(`Хід гравця ${this.currentPlayer}`);
    this._render();
  }

  _checkWin(player) {
    const target =
      player === 1
        ? { rows: [5, 6, 7], cols: [4, 5, 6, 7] }
        : { rows: [0, 1, 2], cols: [0, 1, 2, 3] };
    let cnt = 0;
    for (const r of target.rows) {
      for (const c of target.cols) {
        if (this.board.getPiece(r, c) === player) cnt++;
      }
    }
    return cnt === 12;
  }

  _render() {
    const jumps = [];
    this.ui.updateBoard(this.board.grid, this.selected, jumps);
  }
}
