import BoardView from "../views/BoardView.js";
import StatusView from "../views/StatusView.js";
export default class UIController {
  constructor() {
    this.boardView = new BoardView(document.getElementById("board"));
    this.statusView = new StatusView(document.getElementById("status"));
  }
  bindCellClick(fn) {
    this.boardView.bindCellClick(fn);
  }
  bindEndTurn(fn) {
    document.getElementById("endTurnBtn").addEventListener("click", fn);
  }
  bindSave(fn) {
    document.getElementById("saveBtn").addEventListener("click", fn);
  }
  bindLoad(fn) {
    document.getElementById("loadFile").addEventListener("change", (e) => {
      if (e.target.files.length) fn(e.target.files[0]);
    });
  }
  updateBoard(grid, sel) {
    this.boardView.render(grid, sel);
  }
  updateStatus(msg) {
    this.statusView.update(msg);
  }
  disable() {
    document.getElementById("board").style.pointerEvents = "none";
    document.getElementById("endTurnBtn").disabled = true;
  }
}
