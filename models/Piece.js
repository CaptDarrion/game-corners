import AbstractPiece from "./AbstractPiece.js";
export class NormalPiece extends AbstractPiece {
  #isKing = false;
  constructor(playerId) {
    super(playerId);
  }
  move() {
    return this.#isKing ? "King moves" : "Normal move";
  }
  crown() {
    this.#isKing = true;
  }
  isKing() {
    return this.#isKing;
  }
}

export class KingPiece extends NormalPiece {
  constructor(playerId) {
    super(playerId);
    this.crown();
  }
  move() {
    return "King extended move";
  }
}
