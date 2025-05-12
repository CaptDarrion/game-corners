export default class StatusView {
  constructor(el) {
    this.el = el;
  }
  update(txt) {
    this.el.textContent = txt;
  }
}
