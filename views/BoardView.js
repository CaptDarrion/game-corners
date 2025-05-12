export default class BoardView {
  constructor(el) {
    this.el = el;
  }
  render(grid, selected, jumps = []) {
    this.el.innerHTML = "";
    grid.forEach((row, r) =>
      row.forEach((piece, c) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.row = r;
        cell.dataset.col = c;
        if (piece) {
          const pEl = document.createElement("div");
          pEl.className = `piece player${piece}`;
          if (selected && selected.r === r && selected.c === c)
            pEl.classList.add("selected");
          cell.appendChild(pEl);
        }
        if (jumps.some((p) => p.r === r && p.c === c))
          cell.classList.add("jump-highlight");
        this.el.appendChild(cell);
      })
    );
  }
  bindCellClick(handler) {
    this.el.addEventListener("click", (e) => {
      const cell = e.target.closest(".cell");
      if (!cell) return;
      handler(+cell.dataset.row, +cell.dataset.col);
    });
  }
}
