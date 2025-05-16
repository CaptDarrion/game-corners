import { NormalPiece } from "./Piece.js";
export default class Board {
  #grid;
  constructor(size = 8) {
    this.size = size;
    this.#grid = this.#initGrid();
  }

  #initGrid() {
    const grid = Array.from({ length: this.size }, () =>
      Array(this.size).fill(null)
    );
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        grid[r][c] = new NormalPiece(1);
      }
    }
    for (let r = this.size - 3; r < this.size; r++) {
      for (let c = this.size - 4; c < this.size; c++) {
        grid[r][c] = new NormalPiece(2);
      }
    }
    return grid;
  }

  get grid() {
    return this.#grid;
  }

  getPiece(r, c) {
    return this.#grid[r]?.[c] || null;
  }

  setPiece(r, c, piece) {
    if (this.#grid[r]) {
      this.#grid[r][c] = piece;
    }
  }

  movePiece(from, to) {
    const piece = this.getPiece(from.r, from.c);
    this.setPiece(to.r, to.c, piece);
    this.setPiece(from.r, from.c, null);
  }

  toJSON() {
    return JSON.stringify(
      this.#grid.map((row) =>
        row.map((p) =>
          p ? { playerId: p.playerId, isKing: p.isKing() } : null
        )
      )
    );
  }

  static fromJSON(json) {
    const parsed = typeof json === "string" ? JSON.parse(json) : json;
    const board = new Board(parsed.length);
    // Перезаписываем сетку на основе сохраненных данных
    board.#grid = parsed.map((row) =>
      row.map((p) => {
        if (!p) return null;
        const piece = new NormalPiece(p.playerId);
        if (p.isKing) piece.crown();
        return piece;
      })
    );
    return board;
  }
}
