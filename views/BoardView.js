export default class BoardView {
  constructor(el) {
    this.el = el;
  }
  render(grid, selected) {
    this.el.innerHTML = "";
    grid.forEach((row, r) =>
      row.forEach((piece, c) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.row = r;
        cell.dataset.col = c;
        if (piece) {
          const dot = document.createElement("div");
          dot.className = `piece player${piece.playerId}`;
          if (piece.isKing && piece.isKing()) dot.classList.add("king");
          if (selected && selected.r === r && selected.c === c)
            dot.classList.add("selected");
          cell.appendChild(dot);
        }
        this.el.appendChild(cell);
      })
    );
  }
  bindCellClick(fn) {
    this.el.addEventListener("click", (e) => {
      const cell = e.target.closest(".cell");
      if (cell) fn(+cell.dataset.row, +cell.dataset.col);
    });
  }
}
