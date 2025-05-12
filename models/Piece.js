export default class Piece {
  constructor(playerId) {
    this.playerId = playerId;
    this.isKing = false;
  }

  crown() {
    this.isKing = true;
  }
}
