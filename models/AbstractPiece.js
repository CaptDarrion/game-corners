import { IMovable } from "../interfaces/IMovable.js";
export default class AbstractPiece extends IMovable {
  constructor(playerId) {
    if (new.target === AbstractPiece)
      throw new TypeError("Cannot instantiate AbstractPiece");
    super();
    this.playerId = playerId;
  }
  move() {
    throw new Error("Method move() must be implemented.");
  }
}
