import GameController from "./controllers/GameController.js";
import BoardView from "./views/BoardView.js";
import StatusView from "./views/StatusView.js";

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const endBtn = document.getElementById("endTurnBtn");
class UIController {
  constructor() {
    this.boardView = new BoardView(boardEl);
    this.statusView = new StatusView(statusEl);
    this.endBtn = endBtn;
  }
  bindCellClick(fn) {
    this.boardView.bindCellClick(fn);
  }
  bindEndTurn(fn) {
    this.endBtn.addEventListener("click", fn);
  }
  updateBoard(grid, sel, jumps) {
    this.boardView.render(grid, sel, jumps);
  }
  updateStatus(t) {
    this.statusView.update(t);
  }
  disable() {
    boardEl.style.pointerEvents = "none";
    this.endBtn.disabled = true;
  }
}
const ui = new UIController();
new GameController(ui);
