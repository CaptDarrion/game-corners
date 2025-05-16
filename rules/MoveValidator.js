export default class MoveValidator {
  static isValidMove(board, from, to) {
    const dr = Math.abs(to.r - from.r);
    const dc = Math.abs(to.c - from.c);
    return dr + dc === 1 && board.getPiece(to.r, to.c) === null;
  }

  static isValidJump(board, from, to) {
    const dr = to.r - from.r;
    const dc = to.c - from.c;
    const valid =
      (Math.abs(dr) === 2 && dc === 0) ||
      (Math.abs(dc) === 2 && dr === 0) ||
      (Math.abs(dr) === 2 && Math.abs(dc) === 2);
    if (!valid) return false;
    const mid = { r: from.r + dr / 2, c: from.c + dc / 2 };
    if (!board.getPiece(mid.r, mid.c)) return false;
    return board.getPiece(to.r, to.c) === null;
  }
  
  static hasAnyJump(board, from) {
    const dirs = [
      { dr: 2, dc: 0 },
      { dr: -2, dc: 0 },
      { dr: 0, dc: 2 },
      { dr: 0, dc: -2 },
      { dr: 2, dc: 2 },
      { dr: 2, dc: -2 },
      { dr: -2, dc: 2 },
      { dr: -2, dc: -2 },
    ];
    for (const { dr, dc } of dirs) {
      const to = { r: from.r + dr, c: from.c + dc };
      if (to.r < 0 || to.r >= board.size || to.c < 0 || to.c >= board.size)
        continue;
      if (this.isValidJump(board, from, to)) return true;
    }
    return false;
  }
}
