import Board from "../models/Board.js";
import MoveValidator from "../rules/MoveValidator.js";
import FileManager from "../utils/FileManager.js";
import { GenericStack } from "../utils/Collections.js";

export default class GameController {
  #ui;
  #board;
  #selected = null;
  #currentPlayer = 1;
  #hasJumped = false;
  #history;
  constructor(ui) {
    this.#ui = ui;
    this.#board = new Board();
    this.#history = new GenericStack();
    this.#init();
  }
  #init() {
    this.#ui.bindCellClick(this.handleCellClick.bind(this));
    this.#ui.bindEndTurn(this.endTurn.bind(this));
    this.#ui.bindSave(() => this.saveGame());
    this.#ui.bindLoad((file) => this.loadGame(file));
    this.#ui.updateStatus(`Player ${this.#currentPlayer} move`);
    this.#render();
  }
  handleCellClick(r, c) {
    const pos = { r, c },
      piece = this.#board.getPiece(r, c);
    if (!this.#selected && (!piece || piece.playerId !== this.#currentPlayer))
      return;
    if (this.#selected && this.#selected.r === r && this.#selected.c === c) {
      this.#selected = null;
      return this.#render();
    }

    if (this.#selected) {
      if (MoveValidator.isValidJump(this.#board, this.#selected, pos)) {
        this.#history.push(this.#board.toJSON());
        this.#board.movePiece(this.#selected, pos);
        this.#selected = pos;
        this.#hasJumped = true;
        const canContinue = MoveValidator.hasAnyJump(
          this.#board,
          this.#selected
        );
        if (canContinue) {
          return this.#render();
        } else {
          return this.endTurn();
        }
      }
      if (
        !this.#hasJumped &&
        MoveValidator.isValidMove(this.#board, this.#selected, pos)
      ) {
        this.#history.push(this.#board.toJSON());
        this.#board.movePiece(this.#selected, pos);
        this.#selected = null;
        return this.endTurn();
      }
      return;
    }
    if (piece.playerId === this.#currentPlayer) this.#selected = pos;
    this.#render();
  }

  undo() {
    if (!this.#history.isEmpty()) {
      this.#board = Board.fromJSON(this.#history.pop());
      this.#render();
    }
  }
  endTurn() {
    this.#hasJumped = false;
    this.#selected = null;
    if (this.#checkWin(this.#currentPlayer)) {
      this.#ui.updateStatus(`Player ${this.#currentPlayer} wins!`);
      return this.#ui.disable();
    }
    this.#currentPlayer = 3 - this.#currentPlayer;
    this.#ui.updateStatus(`Player ${this.#currentPlayer} move`);
    this.#render();
  }
  #checkWin(player) {
    const target =
      player === 1
        ? { rows: [5, 6, 7], cols: [4, 5, 6, 7] }
        : { rows: [0, 1, 2], cols: [0, 1, 2, 3] };
    let count = 0;
    for (const r of target.rows)
      for (const c of target.cols) {
        const p = this.#board.getPiece(r, c);
        if (p && p.playerId === player) count++;
      }
    return count === 12;
  }
  #render() {
    this.#ui.updateBoard(this.#board.grid, this.#selected);
  }
  saveGame() {
    FileManager.saveAsJSON(
      this.#board.grid.map((row) =>
        row.map((p) =>
          p ? { playerId: p.playerId, isKing: p.isKing() } : null
        )
      ),
      "board.json"
    );
    this.#ui.updateStatus("Saved to file");
  }
  loadGame(file) {
    FileManager.loadFromFile(file)
      .then((data) => {
        this.#board = Board.fromJSON(JSON.stringify(data));
        this.#render();
        this.#ui.updateStatus("Loaded from file");
      })
      .catch(() => this.#ui.updateStatus("Load error"));
  }
}
