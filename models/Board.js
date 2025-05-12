export default class Board {
  constructor(size = 8) {
    this.size = size;
    this.grid = this._initGrid();
  }

  _initGrid() {
    const board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(null)
    );
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) board[r][c] = 1;
    }
    for (let r = this.size - 3; r < this.size; r++) {
      for (let c = this.size - 4; c < this.size; c++) board[r][c] = 2;
    }
    return board;
  }

  getPiece(r, c) {
    if (r < 0 || r >= this.size || c < 0 || c >= this.size) return null;
    return this.grid[r][c];
  }

  setPiece(r, c, piece) {
    if (r < 0 || r >= this.size || c < 0 || c >= this.size) return;
    this.grid[r][c] = piece;
  }

  movePiece(from, to) {
    this.setPiece(to.r, to.c, this.getPiece(from.r, from.c));
    this.setPiece(from.r, from.c, null);
  }
}
