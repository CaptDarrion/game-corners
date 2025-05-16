export class GenericList {
  constructor() {
    this._items = [];
  }
  add(item) {
    this._items.push(item);
  }
  get(index) {
    return this._items[index];
  }
  remove(index) {
    return this._items.splice(index, 1)[0];
  }
  size() {
    return this._items.length;
  }
  toArray() {
    return [...this._items];
  }
}

export class GenericStack {
  constructor() {
    this._list = new GenericList();
  }
  push(item) {
    this._list.add(item);
  }
  pop() {
    return this._list.remove(this._list.size() - 1);
  }
  isEmpty() {
    return this._list.size() === 0;
  }
}

export class GenericQueue {
  constructor() {
    this._list = new GenericList();
  }
  enqueue(item) {
    this._list.add(item);
  }
  dequeue() {
    return this._list.remove(0);
  }
  isEmpty() {
    return this._list.size() === 0;
  }
}

export class GenericDictionary {
  constructor() {
    this._map = new Map();
  }
  set(key, value) {
    this._map.set(key, value);
  }
  get(key) {
    return this._map.get(key);
  }
  delete(key) {
    this._map.delete(key);
  }
  size() {
    return this._map.size;
  }
}
