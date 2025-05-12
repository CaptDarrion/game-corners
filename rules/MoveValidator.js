export default class MoveValidator {
  static isValidMove(board, from, to) {
    const dr = Math.abs(to.r - from.r);
    const dc = Math.abs(to.c - from.c);
    return dr + dc === 1 && board.getPiece(to.r, to.c) === null;
  }

  static isValidJump(board, from, to) {
    const dr = to.r - from.r;
    const dc = to.c - from.c;

    const absDr = Math.abs(dr);
    const absDc = Math.abs(dc);
    const validDir =
      (absDr === 2 && dc === 0) ||
      (absDc === 2 && dr === 0) ||
      (absDr === 2 && absDc === 2);
    if (!validDir) return false;
    const midR = from.r + dr / 2;
    const midC = from.c + dc / 2;

    if (board.getPiece(midR, midC) === null) return false;

    if (board.getPiece(to.r, to.c) !== null) return false;
    return true;
  }
  static getAvailableJumps(board, position, visited = new Set()) {
    const jumps = [];
    const key = `${position.r},${position.c}`;
    if (visited.has(key)) return [];
    visited.add(key);

    const dirs = [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 },
      { dr: -1, dc: -1 },
      { dr: -1, dc: 1 },
      { dr: 1, dc: -1 },
      { dr: 1, dc: 1 },
    ];

    for (const { dr, dc } of dirs) {
      const mid = { r: position.r + dr, c: position.c + dc };
      const land = { r: position.r + dr * 2, c: position.c + dc * 2 };
      if (
        land.r >= 0 &&
        land.r < board.size &&
        land.c >= 0 &&
        land.c < board.size &&
        board.getPiece(mid.r, mid.c) !== null &&
        board.getPiece(land.r, land.c) === null
      ) {
        jumps.push(land);
        jumps.push(...this.getAvailableJumps(board, land, new Set(visited)));
      }
    }
    return jumps;
  }
}
